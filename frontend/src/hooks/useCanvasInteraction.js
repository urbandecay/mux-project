import { useRef, useCallback } from 'react';
import useStore from '../store/useStore';
import * as ConnectionManager from '../utils/ConnectionManager';
import * as SelectionManager from '../utils/SelectionManager';
import * as MovementManager from '../utils/MovementManager';

export const useCanvasInteraction = (
  clickStartPosRef, 
  rightClickedTargetRef, 
  dragStartSnapshotRef, 
  visibleNodesMap, 
  onCloseMenu, 
  onOpenMenu,
  onOpenNoteEditor
) => {
  const {
    nodes, wires, groups, camera, parentId,
    focusMode, editingGroupId,
    selectedNodeIds, selectedWireIds,
    setNodes, setWires, setCamera,
    setIsPanning, setPanStart, setSelectionBox, setDrawing, setDragState,
    setSelectedNodeIds, setSelectedWireIds,
    updateNodeText, pushSnapshot, pushHistory, navigateIn, updateGraph
  } = useStore();

  const getWirePathInternal = useCallback((wire, currentNodes, currentWires) => {
      const source = currentNodes.find(n => n.id === wire.sourceId);
      const target = currentNodes.find(n => n.id === wire.targetId);
      if (!source || !target) return [];
      const handles1 = ConnectionManager.getHandles(source, currentNodes, currentWires);
      const handles2 = ConnectionManager.getHandles(target, currentNodes, currentWires);
      const h1 = handles1.find(h => h.id === wire.sourcePortId);
      const h2 = handles2.find(h => h.id === wire.targetPortId);
      if (!h1 || !h2) return [];
      return ConnectionManager.getZPath(h1, h2, wire.centerY, wire.centerX, wire.centerY2);
  }, []);

  const handleNodeDown = useCallback((e, node) => {
    onCloseMenu();
    
    const state = useStore.getState();
    const currentSelected = state.selectedNodeIds;
    
    if (e.button === 2) {
      rightClickedTargetRef.current = { type: 'node', id: node.id };
      clickStartPosRef.current = { x: e.clientX, y: e.clientY };
      
      if (!currentSelected.includes(node.id)) {
          setSelectedNodeIds([node.id]);
          setSelectedWireIds([]);
      }
      return; 
    }

    const currentCamera = state.camera;
    const currentNodes = state.nodes;
    const currentWires = state.wires;
    const currentParentId = state.parentId;
    const currentSelectedNodeIds = state.selectedNodeIds;
    const currentSelectedWireIds = state.selectedWireIds;

    const currentVisibleNodes = currentNodes.filter(n => n.parentId === currentParentId);
    const currentVisibleWires = currentWires.filter(w => w.parentId === currentParentId);

    clickStartPosRef.current = { x: e.clientX, y: e.clientY };

    const worldX = (e.clientX - currentCamera.x) / (currentCamera.zoom || 1);
    const worldY = (e.clientY - currentCamera.y) / (currentCamera.zoom || 1);

    dragStartSnapshotRef.current = { nodes: currentNodes, wires: currentWires, groups: state.groups };

    let finalNodeIds;
    let finalWireIds;
    let dragNodeIds;
    let dragWireIds;

    const hasSelectionForFocus = currentSelectedNodeIds.length > 0 || currentSelectedWireIds.length > 0;
    
    // Simplification: We no longer need to recalculate the whole highlighted set here just to know if we clicked one.
    // If focus mode is active and we have a selection, clicking an UN-highlighted node resets selection.
    // But since that logic was complex, let's keep the core of it intact.
    
    // Let's use the explicit selection manager logic
    if (state.editingGroupId) {
        finalNodeIds = SelectionManager.handleSelectionOnDown(currentSelectedNodeIds, node.id, e.shiftKey);
        finalWireIds = [...currentSelectedWireIds];
        
        if (!e.shiftKey && !currentSelectedNodeIds.includes(node.id)) {
            finalWireIds = [];
        }
        
        if (node.groupId === state.editingGroupId) {
            dragNodeIds = finalNodeIds;
            dragWireIds = finalWireIds;
        } else {
            dragNodeIds = [];
            dragWireIds = [];
        }
    } else {
        finalNodeIds = SelectionManager.handleSelectionOnDown(currentSelectedNodeIds, node.id, e.shiftKey);
        finalWireIds = [...currentSelectedWireIds];

        if (!e.shiftKey && !currentSelectedNodeIds.includes(node.id)) {
            finalWireIds = [];
        }
        dragNodeIds = finalNodeIds;
        dragWireIds = finalWireIds;
    }

    setSelectedNodeIds(finalNodeIds);
    setSelectedWireIds(finalWireIds);
    
    setDragState(MovementManager.prepareDragState(
      worldX, worldY, currentVisibleNodes, currentVisibleWires, dragNodeIds, dragWireIds, null, 
      (w) => getWirePathInternal(w, currentNodes, currentWires), state.editingGroupId
    ));
  }, [onCloseMenu, getWirePathInternal, clickStartPosRef, rightClickedTargetRef, dragStartSnapshotRef, setSelectedNodeIds, setSelectedWireIds, setDragState]);

  return {
    handleNodeDown,
    getWirePathInternal
  };
};