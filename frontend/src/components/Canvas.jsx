import React, { useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { moduleRegistry, DISPLAY_NAMES, GREEN_YELLOW_MODULES } from '../utils/moduleRegistry';
import * as ConnectionManager from '../utils/ConnectionManager';
import * as SpatialManager from '../utils/SpatialManager';
import * as SelectionManager from '../utils/SelectionManager';
import * as MovementManager from '../utils/MovementManager';
import WireLayer from './canvas/WireLayer';
import NodeLayer from './canvas/NodeLayer';

const Canvas = ({ onOpenMenu, onOpenNoteEditor, onCloseMenu }) => {
  const { 
    nodes, wires, groups, camera, wireRadius, wireWidth, parentId,
    drawing, dragState,
    selectedNodeIds, selectedWireIds,
    focusMode, focusDimLevel, editingGroupId,
    activeModules, toggleModuleActive, highlightByIndicators,
    setNodes, setWires, setCamera,
    setIsPanning, setPanStart, setSelectionBox, setDrawing, setDragState,
    setSelectedNodeIds, setSelectedWireIds,
    // Actions
    updateNodeText,
    pushSnapshot, pushHistory,
    navigateIn, updateGraph
  } = useStore();

  const lastClickTimeRef = useRef(0);
  const dragStartSnapshotRef = useRef(null);
  const clickStartPosRef = useRef({ x: 0, y: 0 });
  const rightClickedTargetRef = useRef(null);
  const rafRef = useRef(null);
  const latestMouseRef = useRef(null);
  const canvasRef = useRef(null);
  const selectionBoxRef = useRef(null);
  const activeSelectionBoxRef = useRef(null);

  // Filter for current level
  const visibleNodes = nodes.filter(n => n.parentId === parentId);
  const visibleWires = wires.filter(w => w.parentId === parentId);
  const visibleGroups = groups.filter(g => g.parentId === parentId);

  // Reference to hold the temporary panning state before committing to store
  const cameraRef = useRef(null);
  
  const visibleNodesMap = React.useMemo(() => {
    const map = new Map();
    visibleNodes.forEach(n => map.set(n.id, n));
    return map;
  }, [visibleNodes]);

  const connectionHash = React.useMemo(() => wires.map(w => `${w.id}:${w.sourceId}:${w.targetId}`).join(','), [wires]);

  // Pre-calculate docking/stacking states for all nodes efficiently
  const dockingStateMap = React.useMemo(() => {
    const map = new Map();
    const nodeInfo = new Map();

    // Pass 1: Gather basic info for all visible nodes
    visibleNodes.forEach(node => {
      const { inputs, outputs } = ConnectionManager.getDynamicIO(node, nodes);
      const realH = moduleRegistry[node.label]?.realHeight || 38;
      const hasTopStubs = realH === 38 || inputs.length > 0;
      const hasBottomStubs = realH === 38 || outputs.length > 0;
      nodeInfo.set(node.id, { hasTopStubs, hasBottomStubs, inputs, outputs });
    });

    // Pass 2: Calculate relationships
    visibleNodes.forEach(node => {
      const info = nodeInfo.get(node.id);
      if (!info) return;

      const dockedTop = info.hasTopStubs && visibleNodes.some(other => {
        if (other.id === node.id || Math.abs(other.x - node.x) > 0.1 || Math.abs(other.y - (node.y - 19)) > 0.1) return false;
        return nodeInfo.get(other.id)?.hasBottomStubs;
      });

      const dockedBottom = info.hasBottomStubs && visibleNodes.some(other => {
        if (other.id === node.id || Math.abs(other.x - node.x) > 0.1 || Math.abs(other.y - (node.y + 19)) > 0.1) return false;
        return nodeInfo.get(other.id)?.hasTopStubs;
      });

      const overlappingTop = visibleNodes.some(other => 
        other.id !== node.id && Math.abs(other.x - node.x) < 1 && Math.abs(node.y - other.y - 20) < 2
      );
      const overlappingBottom = visibleNodes.some(other => 
        other.id !== node.id && Math.abs(other.x - node.x) < 1 && Math.abs(other.y - node.y - 20) < 2
      );
      const kissingTop = visibleNodes.some(other => 
        other.id !== node.id && Math.abs(other.x - node.x) < 1 && Math.abs(node.y - other.y - 38) < 2
      );
      const kissingBottom = visibleNodes.some(other => 
        other.id !== node.id && Math.abs(other.x - node.x) < 1 && Math.abs(other.y - node.y - 38) < 2
      );

      map.set(node.id, { 
        dockedTop, dockedBottom, 
        overlappingTop, overlappingBottom, 
        kissingTop, kissingBottom, 
        inputs: info.inputs, outputs: info.outputs 
      });
    });
    
    return map;
  }, [visibleNodes, nodes]);

  const { highlightedNodeIds, highlightedWireIds } = React.useMemo(() => {
    const hNodes = new Set(), hWires = new Set();
    
    if (editingGroupId && focusMode) {
        visibleNodes.forEach(n => { if (n.groupId === editingGroupId) hNodes.add(n.id); });
        visibleWires.forEach(w => { if (w.groupId === editingGroupId) hWires.add(w.id); });
        return { highlightedNodeIds: hNodes, highlightedWireIds: hWires };
    }

    const isAnchor = (nodeId) => {
        const node = visibleNodesMap.get(nodeId);
        if (!node) return false;
        const reg = moduleRegistry[node.label];
        return reg && (reg.isAnchor || reg.isPatchPoint2);
    };

    const hasLight = (nodeId) => {
        const node = visibleNodesMap.get(nodeId);
        if (!node) return false;
        return activeModules[nodeId] !== false && GREEN_YELLOW_MODULES.includes(node.label);
    };

    const isIO = (nodeId) => {
        const node = visibleNodesMap.get(nodeId);
        if (!node) return false;
        const reg = moduleRegistry[node.label];
        return reg && reg.category === "Inputs Outputs";
    };

    const getConnectedRealModules = (nodeId, visited = new Set()) => {
        if (visited.has(nodeId)) return new Set();
        visited.add(nodeId);
        
        const realModules = new Set();
        visibleWires.forEach(w => {
            let otherId = null;
            if (w.sourceId === nodeId) otherId = w.targetId;
            else if (w.targetId === nodeId) otherId = w.sourceId;

            if (otherId) {
                if (hasLight(otherId) || isIO(otherId)) realModules.add(otherId);
                else if (isAnchor(otherId)) {
                    const nested = getConnectedRealModules(otherId, visited);
                    nested.forEach(id => realModules.add(id));
                }
            }
        });
        return realModules;
    };

    // Cache results for efficiency
    const nodeToRealActiveNeighbors = new Map();
    if (highlightByIndicators) {
        visibleNodes.forEach(n => {
            if (hasLight(n.id) || isIO(n.id) || isAnchor(n.id)) {
                nodeToRealActiveNeighbors.set(n.id, getConnectedRealModules(n.id));
            }
        });

        visibleWires.forEach(w => {
            const srcLight = hasLight(w.sourceId);
            const tgtLight = hasLight(w.targetId);
            const srcIO = isIO(w.sourceId);
            const tgtIO = isIO(w.targetId);
            const srcAnchor = isAnchor(w.sourceId);
            const tgtAnchor = isAnchor(w.targetId);

            let shouldHighlight = false;

            // 1. Connection between two Lights
            if (srcLight && tgtLight) {
                shouldHighlight = true;
            } 
            // 2. Connection between a Light and an IO
            else if ((srcLight && tgtIO) || (tgtLight && srcIO)) {
                shouldHighlight = true;
            }
            // 3. Connection to an Anchor
            else if (srcLight && tgtAnchor) {
                const neighbors = nodeToRealActiveNeighbors.get(w.targetId);
                if (neighbors) {
                    for (let id of neighbors) { if (id !== w.sourceId && (hasLight(id) || isIO(id))) { shouldHighlight = true; break; } }
                }
            } else if (tgtLight && srcAnchor) {
                const neighbors = nodeToRealActiveNeighbors.get(w.sourceId);
                if (neighbors) {
                    for (let id of neighbors) { if (id !== w.targetId && (hasLight(id) || isIO(id))) { shouldHighlight = true; break; } }
                }
            } else if (srcIO && tgtAnchor) {
                // IO to Anchor: highlight only if anchor leads to a LIGHT
                const neighbors = nodeToRealActiveNeighbors.get(w.targetId);
                if (neighbors) {
                    for (let id of neighbors) { if (id !== w.sourceId && hasLight(id)) { shouldHighlight = true; break; } }
                }
            } else if (tgtIO && srcAnchor) {
                const neighbors = nodeToRealActiveNeighbors.get(w.sourceId);
                if (neighbors) {
                    for (let id of neighbors) { if (id !== w.targetId && hasLight(id)) { shouldHighlight = true; break; } }
                }
            } else if (srcAnchor && tgtAnchor) {
                // Anchor to Anchor: highlight if it bridges a path between (Light/Light) or (Light/IO)
                const srcNeighbors = nodeToRealActiveNeighbors.get(w.sourceId);
                const tgtNeighbors = nodeToRealActiveNeighbors.get(w.targetId);
                if (srcNeighbors && tgtNeighbors) {
                    for (let sId of srcNeighbors) {
                        for (let tId of tgtNeighbors) {
                            if (sId !== tId && ((hasLight(sId) && hasLight(tId)) || (hasLight(sId) && isIO(tId)) || (isIO(sId) && hasLight(tId)))) {
                                shouldHighlight = true; break;
                            }
                        }
                        if (shouldHighlight) break;
                    }
                }
            }

            if (shouldHighlight) {
                hWires.add(w.id);
                hNodes.add(w.sourceId);
                hNodes.add(w.targetId);
            }
        });

        // Ensure modules with lights ON are always highlighted
        visibleNodes.forEach(n => {
            if (hasLight(n.id)) hNodes.add(n.id);
        });
    }

    // 2. Selection-based highlights (Additive)
    if (selectedNodeIds.length > 0 || selectedWireIds.length > 0) {
        selectedNodeIds.forEach(id => hNodes.add(id));
        selectedWireIds.forEach(id => hWires.add(id));

        const activeGroupIds = new Set();
        selectedNodeIds.forEach(id => { const node = visibleNodesMap.get(id); if (node && node.groupId) activeGroupIds.add(node.groupId); });
        selectedWireIds.forEach(id => { const wire = visibleWires.find(w => w.id === id); if (wire && wire.groupId) activeGroupIds.add(wire.groupId); });

        if (activeGroupIds.size > 0) {
            visibleNodes.forEach(n => { if (n.groupId && activeGroupIds.has(n.groupId)) hNodes.add(n.id); });
            visibleWires.forEach(w => { if (w.groupId && activeGroupIds.has(w.groupId)) hWires.add(w.id); });
        }

        // Helper to trace from a node, continuing only through anchors
        const traceSelection = (nodeId, visited = new Set()) => {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);
            hNodes.add(nodeId);

            visibleWires.forEach(w => {
                let otherId = null;
                if (w.sourceId === nodeId) otherId = w.targetId;
                else if (w.targetId === nodeId) otherId = w.sourceId;

                if (otherId) {
                    hWires.add(w.id);
                    hNodes.add(otherId);
                    if (isAnchor(otherId)) {
                        traceSelection(otherId, visited);
                    }
                }
            });
        };

        selectedNodeIds.forEach(nid => traceSelection(nid));
        selectedWireIds.forEach(wid => {
            const w = visibleWires.find(wire => wire.id === wid);
            if (w) {
                traceSelection(w.sourceId);
                traceSelection(w.targetId);
            }
        });
    }

    return { highlightedNodeIds: hNodes, highlightedWireIds: hWires };
  }, [selectedNodeIds, selectedWireIds, connectionHash, editingGroupId, focusMode, visibleNodesMap, visibleNodes, visibleWires, highlightByIndicators, activeModules]);

  const getWirePath = (wire) => {
    const s = visibleNodesMap.get(wire.sourceId), t = visibleNodesMap.get(wire.targetId);
    if (!s || !t) return [];
    const h1 = ConnectionManager.getHandles(s, nodes, wires).find(h => h.id === wire.sourcePortId);
    const h2 = ConnectionManager.getHandles(t, nodes, wires).find(h => h.id === wire.targetPortId);
    if (!h1 || !h2) return [];
    return ConnectionManager.getZPath(h1, h2, wire.centerY, wire.centerX, wire.centerY2);
  };

  const handleNodeDown = (e, node) => {
    onCloseMenu();
    const state = useStore.getState();
    if (e.button === 2) {
      rightClickedTargetRef.current = { type: 'node', id: node.id };
      clickStartPosRef.current = { x: e.clientX, y: e.clientY };
      if (!state.selectedNodeIds.includes(node.id)) { setSelectedNodeIds([node.id]); setSelectedWireIds([]); }
      return; 
    }
    clickStartPosRef.current = { x: e.clientX, y: e.clientY };
    const worldX = (e.clientX - state.camera.x) / (state.camera.zoom || 1), worldY = (e.clientY - state.camera.y) / (state.camera.zoom || 1);
    dragStartSnapshotRef.current = { nodes: state.nodes, wires: state.wires, groups: state.groups };

    let finalNodeIds, finalWireIds, dragNodeIds, dragWireIds;
    const isHighlighted = (state.selectedNodeIds.length > 0 || state.selectedWireIds.length > 0) && highlightedNodeIds.has(node.id);
    
    if (state.editingGroupId) {
        finalNodeIds = SelectionManager.handleSelectionOnDown(state.selectedNodeIds, node.id, e.shiftKey);
        finalWireIds = [...state.selectedWireIds];
        if (!e.shiftKey && !state.selectedNodeIds.includes(node.id)) finalWireIds = [];
        if (node.groupId === state.editingGroupId) { dragNodeIds = finalNodeIds; dragWireIds = finalWireIds; } else { dragNodeIds = []; dragWireIds = []; }
    } else if (state.focusMode && (state.selectedNodeIds.length > 0 || state.selectedWireIds.length > 0) && isHighlighted) {
        finalWireIds = [...state.selectedWireIds];
        if (e.shiftKey) { finalNodeIds = SelectionManager.handleSelectionOnDown(state.selectedNodeIds, node.id, true); dragNodeIds = finalNodeIds; dragWireIds = finalWireIds; }
        else {
            if (state.selectedNodeIds.includes(node.id)) { finalNodeIds = [...state.selectedNodeIds]; dragNodeIds = finalNodeIds; dragWireIds = finalWireIds; }
            else { finalNodeIds = [...state.selectedNodeIds, node.id]; dragNodeIds = [node.id]; dragWireIds = []; }
        }
    } else {
        finalNodeIds = SelectionManager.handleSelectionOnDown(state.selectedNodeIds, node.id, e.shiftKey);
        finalWireIds = [...state.selectedWireIds];
        if (!e.shiftKey && !state.selectedNodeIds.includes(node.id)) finalWireIds = [];
        dragNodeIds = finalNodeIds; dragWireIds = finalWireIds;
    }
    setSelectedNodeIds(finalNodeIds); setSelectedWireIds(finalWireIds);
    
    const getWirePathInternal = (w) => {
        const s = visibleNodesMap.get(w.sourceId), t = visibleNodesMap.get(w.targetId);
        if (!s || !t) return [];
        const h1 = ConnectionManager.getHandles(s, state.nodes, state.wires).find(h => h.id === w.sourcePortId);
        const h2 = ConnectionManager.getHandles(t, state.nodes, state.wires).find(h => h.id === w.targetPortId);
        if (!h1 || !h2) return [];
        return ConnectionManager.getZPath(h1, h2, w.centerY, w.centerX, w.centerY2);
    };
    setDragState(MovementManager.prepareDragState(worldX, worldY, visibleNodes, visibleWires, dragNodeIds, dragWireIds, null, getWirePathInternal, state.editingGroupId));
  };

  const handleNodeDoubleClick = (e, node) => { if (node.label === 'MUX Modular') navigateIn(node.id); };

  const handlePortDown = (e, node, handle) => {
    onCloseMenu(); clickStartPosRef.current = { x: e.clientX, y: e.clientY };
    const state = useStore.getState();
    if (state.editingGroupId && node.groupId !== state.editingGroupId) return;
    const worldX = (e.clientX - state.camera.x) / (state.camera.zoom || 1), worldY = (e.clientY - state.camera.y) / (state.camera.zoom || 1);
    const now = Date.now(); if (now - lastClickTimeRef.current < 300) return; lastClickTimeRef.current = now;
    setDrawing({ sourceId: node.id, sourcePortId: handle.id, sourcePortType: handle.type, sourcePortDirection: handle.direction, startPos: { x: handle.x, y: handle.y }, endPos: { x: worldX, y: worldY }, targetId: null, targetPortId: null });
  };

  const handleUpdateNodeText = (id, newText, openEditor = false) => { if (openEditor) onOpenNoteEditor(id, newText); else updateNodeText(id, newText); };

  const handleMouseDown = (e) => {
    onCloseMenu(); rightClickedTargetRef.current = null;
    const state = useStore.getState();
    clickStartPosRef.current = { x: e.clientX, y: e.clientY };
    const worldX = (e.clientX - state.camera.x) / (state.camera.zoom || 1), worldY = (e.clientY - state.camera.y) / (state.camera.zoom || 1);
    if (e.button === 1 || e.button === 2) { setIsPanning(true); setPanStart({ x: e.clientX, y: e.clientY, camX: state.camera.x, camY: state.camera.y }); return; }

    const getWirePathInternal = (w) => {
        const s = visibleNodesMap.get(w.sourceId), t = visibleNodesMap.get(w.targetId);
        if (!s || !t) return [];
        const h1 = ConnectionManager.getHandles(s, state.nodes, state.wires).find(h => h.id === w.sourcePortId);
        const h2 = ConnectionManager.getHandles(t, state.nodes, state.wires).find(h => h.id === w.targetPortId);
        if (!h1 || !h2) return [];
        return ConnectionManager.getZPath(h1, h2, w.centerY, w.centerX, w.centerY2);
    };

    const wiresWithPaths = visibleWires.map(w => ({ ...w, points: getWirePathInternal(w) }));
    const hasSelection = state.selectedNodeIds.length > 0 || state.selectedWireIds.length > 0;
    let hit = ConnectionManager.hitTestSegments(worldX, worldY, wiresWithPaths.filter(w => state.selectedWireIds.includes(w.id)), 10);
    let clickedDimmedWire = false;

    if (!hit) {
      let testableWires = wiresWithPaths;
      if (state.editingGroupId) {
          testableWires = wiresWithPaths.filter(w => w.groupId === state.editingGroupId);
          if (!ConnectionManager.hitTestSegments(worldX, worldY, testableWires, 10) && ConnectionManager.hitTestSegments(worldX, worldY, wiresWithPaths, 10)) clickedDimmedWire = true;
      } else if (state.focusMode && hasSelection) {
        const brightWires = [], dimmedWires = [];
        wiresWithPaths.forEach(w => { if (state.selectedWireIds.includes(w.id) || state.selectedNodeIds.includes(w.sourceId) || state.selectedNodeIds.includes(w.targetId)) brightWires.push(w); else dimmedWires.push(w); });
        testableWires = brightWires;
        if (ConnectionManager.hitTestSegments(worldX, worldY, dimmedWires, 10)) clickedDimmedWire = true;
      }
      hit = ConnectionManager.hitTestSegments(worldX, worldY, testableWires, 10);
    }

    if (hit) {
      dragStartSnapshotRef.current = { nodes: state.nodes, wires: state.wires, groups: state.groups };
      let finalWireIds, finalNodeIds, dragNodeIds, dragWireIds;
      if (state.editingGroupId) {
          finalWireIds = SelectionManager.handleWireSelectionOnDown(state.selectedWireIds, hit.id, e.shiftKey);
          finalNodeIds = [...state.selectedNodeIds]; if (!e.shiftKey && !state.selectedWireIds.includes(hit.id)) finalNodeIds = [];
          dragNodeIds = finalNodeIds; dragWireIds = finalWireIds;
      } else if (state.focusMode && hasSelection) {
         finalNodeIds = [...state.selectedNodeIds];
         if (e.shiftKey) { finalWireIds = SelectionManager.handleWireSelectionOnDown(state.selectedWireIds, hit.id, true); dragNodeIds = finalNodeIds; dragWireIds = finalWireIds; }
         else { if (state.selectedWireIds.includes(hit.id)) { finalWireIds = [...state.selectedWireIds]; dragNodeIds = finalNodeIds; dragWireIds = finalWireIds; } else { finalWireIds = [...state.selectedWireIds, hit.id]; dragNodeIds = []; dragWireIds = [hit.id]; } }
      } else {
         finalWireIds = SelectionManager.handleWireSelectionOnDown(state.selectedWireIds, hit.id, e.shiftKey);
         finalNodeIds = [...state.selectedNodeIds]; if (!e.shiftKey && !state.selectedWireIds.includes(hit.id)) finalNodeIds = [];
         dragNodeIds = finalNodeIds; dragWireIds = finalWireIds;
      }
      setSelectedWireIds(finalWireIds); setSelectedNodeIds(finalNodeIds);
      if (hit.isVertical && !(hit.wire.points.length === 6 && hit.segmentIndex === 2)) { setDragState({ type: 'pending-unhook', startX: worldX, startY: worldY, hit }); return; }
      setDragState(MovementManager.prepareDragState(worldX, worldY, visibleNodes, visibleWires, dragNodeIds, dragWireIds, hit.segmentIndex, getWirePathInternal, state.editingGroupId, hit.id));
      return;
    }
    if (clickedDimmedWire) return;
    if (!e.shiftKey) { setSelectedNodeIds([]); setSelectedWireIds([]); }
    activeSelectionBoxRef.current = { startX: worldX, startY: worldY, currentX: worldX, currentY: worldY };
    if (selectionBoxRef.current) { selectionBoxRef.current.style.display = 'block'; selectionBoxRef.current.style.left = `${worldX}px`; selectionBoxRef.current.style.top = `${worldY}px`; selectionBoxRef.current.style.width = '0px'; selectionBoxRef.current.style.height = '0px'; }
  };

  const handleMouseMove = React.useCallback((e) => {
    latestMouseRef.current = { clientX: e.clientX, clientY: e.clientY, ctrlKey: e.ctrlKey, metaKey: e.metaKey, shiftKey: e.shiftKey };
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!latestMouseRef.current) return;
      const { clientX, clientY, ctrlKey, metaKey } = latestMouseRef.current;
      const state = useStore.getState();
      const worldX = (clientX - state.camera.x) / (state.camera.zoom || 1), worldY = (clientY - state.camera.y) / (state.camera.zoom || 1);

      if (state.isPanning) {
        const newCamX = state.panStart.camX + (clientX - state.panStart.x), newCamY = state.panStart.camY + (clientY - state.panStart.y);
        cameraRef.current = { x: newCamX, y: newCamY, zoom: state.camera.zoom };
        if (canvasRef.current) canvasRef.current.style.transform = `translate(${newCamX}px, ${newCamY}px) scale(${state.camera.zoom || 1})`;
        return;
      }

      if (state.drawing) {
        let snapTarget = null, closestDist = 20; 
        visibleNodes.forEach(node => {
          if (node.id === state.drawing.sourceId || (state.editingGroupId && node.groupId !== state.editingGroupId)) return; 
          ConnectionManager.getHandles(node, state.nodes, state.wires).forEach(h => {
            if ((h.type !== state.drawing.sourcePortType && h.type !== 'universal' && state.drawing.sourcePortType !== 'universal') || (h.direction !== 'universal' && state.drawing.sourcePortDirection !== 'universal' && h.direction === state.drawing.sourcePortDirection)) return;
            const dist = Math.hypot(h.x - worldX, h.y - worldY);
            if (dist < closestDist) { closestDist = dist; snapTarget = { id: node.id, portId: h.id, x: h.x, y: h.y }; }
          });
        });
        setDrawing(prev => ({ ...prev, endPos: snapTarget ? { x: snapTarget.x, y: snapTarget.y } : { x: worldX, y: worldY }, targetId: snapTarget ? snapTarget.id : null, targetPortId: snapTarget ? snapTarget.portId : null }));
        return;
      }

      if (state.dragState) {
        const dx = worldX - state.dragState.startX, dy = worldY - state.dragState.startY;
        if (state.dragState.type === 'pending-unhook') {
          if (Math.hypot(dx, dy) > 3) {
            const { hit } = state.dragState, wire = hit.wire, sourceNodeId = (hit.segmentIndex < (wire.points.length - 1) / 2) ? wire.targetId : wire.sourceId, sourcePortId = (hit.segmentIndex < (wire.points.length - 1) / 2) ? wire.targetPortId : wire.sourcePortId;
            const sourceNode = state.nodes.find(n => n.id === sourceNodeId);
            if (sourceNode) {
              const h = ConnectionManager.getHandles(sourceNode, state.nodes, state.wires).find(h => h.id === sourcePortId);
              if (h) { pushSnapshot(); setWires(prev => prev.filter(w => w.id !== wire.id)); setDrawing({ sourceId: sourceNode.id, sourcePortId: h.id, sourcePortType: h.type, sourcePortDirection: h.direction, startPos: { x: h.x, y: h.y }, endPos: { x: worldX, y: worldY }, targetId: null, targetPortId: null }); setDragState(null); return; }
            }
          }
          return;
        }
        if ((latestMouseRef.current.ctrlKey || latestMouseRef.current.metaKey) && Object.keys(state.dragState.initialNodes).length > 0) {
          const nextNodes = MovementManager.calculateNodeDrag(state.dragState, dx, dy, state.nodes);
          const draggingNodeIds = Object.keys(state.dragState.initialNodes);
          const visualNodes = state.nodes.filter(n => !n.id.startsWith('ghost-')).map(n => draggingNodeIds.includes(n.id) ? { ...n, x: state.dragState.initialNodes[n.id].x, y: state.dragState.initialNodes[n.id].y } : n);
          const clones = nextNodes.filter(n => draggingNodeIds.includes(n.id)).map(n => ({ ...n, id: `ghost-${n.id}`, displayName: n.displayName ? `${n.displayName} (Copy)` : `${n.label} (Copy)`, parentId: state.parentId }));
          setNodes([...visualNodes, ...clones]);
        } else {
          const cleanNodes = state.nodes.filter(n => !n.id.startsWith('ghost-'));
          const nextNodes = MovementManager.calculateNodeDrag(state.dragState, dx, dy, cleanNodes), nextWires = MovementManager.calculateWireDrag(state.dragState, dx, dy, state.wires, nextNodes);
          if (nextNodes !== cleanNodes || nextWires !== state.wires) updateGraph({ nodes: nextNodes, wires: nextWires });
        }
        return;
      }

      if (activeSelectionBoxRef.current) {
        const { startX, startY } = activeSelectionBoxRef.current;
        activeSelectionBoxRef.current.currentX = worldX; activeSelectionBoxRef.current.currentY = worldY;
        if (selectionBoxRef.current) {
          selectionBoxRef.current.style.display = 'block';
          selectionBoxRef.current.style.left = `${Math.min(startX, worldX)}px`; selectionBoxRef.current.style.top = `${Math.min(startY, worldY)}px`;
          selectionBoxRef.current.style.width = `${Math.abs(worldX - startX)}px`; selectionBoxRef.current.style.height = `${Math.abs(worldY - startY)}px`;
          if (worldX < startX) { selectionBoxRef.current.style.background = 'rgba(76, 175, 80, 0.2)'; selectionBoxRef.current.style.border = '1px dashed #4caf50'; }
          else { selectionBoxRef.current.style.background = 'rgba(0, 128, 255, 0.2)'; selectionBoxRef.current.style.border = '1px solid #0080ff'; }
        }
      }
    });
  }, [setCamera, setDrawing, setNodes, updateGraph, visibleNodes, visibleWires, visibleNodesMap]);

  const handleMouseUp = React.useCallback((e) => {
    const state = useStore.getState();
    const currentVisibleNodes = state.nodes.filter(n => n.parentId === state.parentId), currentVisibleWires = state.wires.filter(w => w.parentId === state.parentId);
    const getWirePathInternal = (w) => {
        const s = visibleNodesMap.get(w.sourceId), t = visibleNodesMap.get(w.targetId);
        if (!s || !t) return [];
        const h1 = ConnectionManager.getHandles(s, state.nodes, state.wires).find(h => h.id === w.sourcePortId);
        const h2 = ConnectionManager.getHandles(t, state.nodes, state.wires).find(h => h.id === w.targetPortId);
        if (!h1 || !h2) return [];
        return ConnectionManager.getZPath(h1, h2, w.centerY, w.centerX, w.centerY2);
    };

    if (state.drawing) {
      if (state.drawing.targetId && state.drawing.targetPortId) {
        pushSnapshot();
        const midY = (state.drawing.startPos.y + state.drawing.endPos.y) / 2;
        let sId = state.drawing.sourceId, sPId = state.drawing.sourcePortId, tId = state.drawing.targetId, tPId = state.drawing.targetPortId;
        if (state.drawing.sourcePortDirection === 'input') [sId, sPId, tId, tPId] = [tId, tPId, sId, sPId];
        let finalWireType = state.drawing.sourcePortType;
        if (finalWireType === 'universal') {
            const targetNode = state.nodes.find(n => n.id === tId);
            if (targetNode) {
                 const targetHandle = ConnectionManager.getHandles(targetNode, state.nodes, state.wires).find(h => h.id === tPId);
                 if (targetHandle && targetHandle.type !== 'universal') finalWireType = targetHandle.type;
            }
        }
        const sNode = state.nodes.find(n => n.id === sId), tNode = state.nodes.find(n => n.id === tId);
        let wireGroupId = (sNode && tNode && sNode.groupId === tNode.groupId) ? sNode.groupId : undefined;
        setWires(prev => [...prev, { id: `wire-${Date.now()}-${Math.floor(Math.random() * 1000)}`, sourceId: sId, sourcePortId: sPId, targetId: tId, targetPortId: tPId, type: finalWireType, centerY: ConnectionManager.snap(midY, true), parentId: state.parentId, groupId: wireGroupId }]);
      }
      setDrawing(null);
    }

    if (activeSelectionBoxRef.current) {
      const finalBox = activeSelectionBoxRef.current;
      const insideNodes = SpatialManager.getNodesInRect(finalBox, currentVisibleNodes).map(n => n.id);
      const insideWires = SpatialManager.getWiresInRect(finalBox, currentVisibleWires, getWirePathInternal).map(w => w.id);
      setSelectedNodeIds(prev => [...new Set([...prev, ...insideNodes])]); setSelectedWireIds(prev => [...new Set([...prev, ...insideWires])]);
      activeSelectionBoxRef.current = null; if (selectionBoxRef.current) selectionBoxRef.current.style.display = 'none';
    }

    if (e.button === 2) {
      const moveDist = clickStartPosRef.current ? Math.hypot(e.clientX - clickStartPosRef.current.x, e.clientY - clickStartPosRef.current.y) : 0;
      if (moveDist <= 5) {
        const cCamera = cameraRef.current || state.camera;
        const worldX = (e.clientX - cCamera.x) / (cCamera.zoom || 1), worldY = (e.clientY - cCamera.y) / (cCamera.zoom || 1);
        let id, type, displayName;
        if (rightClickedTargetRef.current) {
           id = rightClickedTargetRef.current.id; type = rightClickedTargetRef.current.type;
           if (type === 'node') { const node = state.nodes.find(n => n.id === id); if (node) displayName = node.displayName || DISPLAY_NAMES[node.label] || node.label; }
        } else {
           const hasSelection = state.selectedNodeIds.length > 0 || state.selectedWireIds.length > 0;
           let testableWires = currentVisibleWires.map(w => ({ ...w, points: getWirePathInternal(w) }));
           if (state.focusMode && hasSelection) { testableWires = testableWires.filter(w => state.selectedWireIds.includes(w.id) || state.selectedNodeIds.includes(w.sourceId) || state.selectedNodeIds.includes(w.targetId)); }
           const hitWireId = ConnectionManager.hitTestWires(worldX, worldY, testableWires, 10);
           if (hitWireId) { type = 'wire'; id = hitWireId; } else { type = 'pane'; }
        }
        onOpenMenu({ top: e.clientY, left: e.clientX, worldX: ConnectionManager.snap(worldX, false), worldY: ConnectionManager.snap(worldY, true), id, type, displayName });
      }
      rightClickedTargetRef.current = null;
    }

    setWires(prev => prev.map(w => {
      if (w.parentId !== state.parentId) return w;
      const path = getWirePathInternal(w);
      return (path.length === 4 && w.centerY2 !== undefined) ? { ...w, centerY2: undefined } : w;
    }));

    if (state.dragState) {
      if (dragStartSnapshotRef.current) {
        const { nodes: oldN, wires: oldW } = dragStartSnapshotRef.current;
        if (state.nodes !== oldN || state.wires !== oldW) pushHistory(dragStartSnapshotRef.current);
        dragStartSnapshotRef.current = null;
      }
      const ghosts = state.nodes.filter(n => n.id.startsWith('ghost-'));
      if (ghosts.length > 0) {
        setNodes(prev => {
          const currentNodesInner = prev.filter(n => !n.id.startsWith('ghost-')), ghostNodes = prev.filter(n => n.id.startsWith('ghost-'));
          let updatedNodes = [...currentNodesInner]; const finalizedClones = [], groupsMap = new Map();
          ghostNodes.forEach(ghost => {
            const original = currentNodesInner.find(n => n.id === ghost.id.replace('ghost-', ''));
            if (original) {
              const label = original.label, isIO = moduleRegistry[label]?.category === "Inputs Outputs", base = isIO ? (original.displayName || label).replace(/\s*\d+$/, '').trim() : (original.displayName || label).replace(/\s*\(\d+\)$/, '').trim();
              const key = `${label}:::${base || label}`; if (!groupsMap.has(key)) groupsMap.set(key, { label, base: base || label, ghosts: [] }); groupsMap.get(key).ghosts.push(ghost);
            }
          });
          groupsMap.forEach(({ label, base, ghosts: groupGhosts }) => {
            const isIO = moduleRegistry[label]?.category === "Inputs Outputs";
            const sameGroup = updatedNodes.filter(n => n.parentId === state.parentId && n.label === label && (n.displayName || n.label).includes(base));
            const suffixes = sameGroup.map(n => { const nName = n.displayName || n.label, m = isIO ? nName.match(/\s*(\d+)$/) : nName.match(/\s*\((\d+)\)$/); return m ? parseInt(m[1]) : 0; });
            const maxS = Math.max(0, ...suffixes);
            let nextNum = (sameGroup.length === 1 && maxS === 0) ? 2 : Math.max(sameGroup.length === 1 ? 1 : 0, maxS) + 1;
            if (sameGroup.length === 1 && maxS === 0) updatedNodes = updatedNodes.map(n => (n.parentId === state.parentId && n.label === label && (n.displayName || n.label) === base) ? { ...n, displayName: isIO ? `${base} 1` : `${base} (1)` } : n);
            groupGhosts.forEach((ghost, idx) => finalizedClones.push({ ...ghost, id: `${label}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`, displayName: isIO ? `${base} ${nextNum + idx}` : `${base} (${nextNum + idx})`, parentId: state.parentId }));
          });
          return [...updatedNodes, ...finalizedClones];
        });
      }
    }
    if (state.isPanning) { if (cameraRef.current) { setCamera(cameraRef.current); cameraRef.current = null; } setIsPanning(false); }
    setDragState(null);
  }, [setWires, setDrawing, setSelectedNodeIds, setSelectedWireIds, setSelectionBox, onOpenMenu, pushSnapshot, pushHistory, setNodes, visibleNodesMap]);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp); window.addEventListener('mousemove', handleMouseMove);
    return () => { window.removeEventListener('mouseup', handleMouseUp); window.removeEventListener('mousemove', handleMouseMove); };
  }, [handleMouseUp, handleMouseMove]);

  const isFocusModeActive = focusMode && (selectedNodeIds.length > 0 || selectedWireIds.length > 0 || editingGroupId !== null || highlightByIndicators);

  return (
    <div 
      className={isFocusModeActive ? "focus-mode-active" : ""}
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', '--focus-dim-level': focusDimLevel }} 
      onMouseDown={handleMouseDown} onContextMenu={(e) => e.preventDefault()}
    >
      <div ref={canvasRef} style={{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom || 1})`, transformOrigin: '0 0', width: '100%', height: '100%', pointerEvents: 'none', willChange: 'transform', backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}>
        <div ref={selectionBoxRef} style={{ position: 'absolute', zIndex: 5000, pointerEvents: 'none', display: 'none', background: 'rgba(0, 128, 255, 0.2)', border: '1px solid #0080ff' }} />
        
        <WireLayer 
          visibleWires={visibleWires} drawing={drawing} wireRadius={wireRadius} 
          getWirePath={getWirePath} highlightedWireIds={highlightedWireIds} selectedWireIds={selectedWireIds} 
        />
        
        <NodeLayer 
          visibleNodes={visibleNodes} dockingStateMap={dockingStateMap} 
          selectedNodeIds={selectedNodeIds} highlightedNodeIds={highlightedNodeIds} 
          activeModules={activeModules} toggleModuleActive={toggleModuleActive} 
          handleNodeDown={handleNodeDown} handleNodeDoubleClick={handleNodeDoubleClick} 
          handlePortDown={handlePortDown} handleUpdateNodeText={handleUpdateNodeText} 
        />
        
      </div>
    </div>
  );
};

export default Canvas;
