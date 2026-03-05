import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { moduleRegistry, DISPLAY_NAMES } from './moduleRegistry';
import * as ConnectionManager from './ConnectionManager';
import * as SpatialManager from './SpatialManager';
import * as SelectionManager from './SelectionManager';
import * as MovementManager from './MovementManager';
import Wire from './Wire';
import MuxNode from './MuxNode';
import Frame from './Frame';
import CustomContextMenu from './ContextMenu';
import NoteEditor from './NoteEditor';
import './ContextMenu.css'; 

const BG_COLOR = '#1a1a1a';

const initialNodes = [
  { id: '1', label: 'Oscillator', x: 252, y: 56 },
  { id: '2', label: '4P Lowpass Filter', x: 252, y: 196 },
  { id: '3', label: 'Audio Output', x: 252, y: 350 },
];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [dynamicWires, setDynamicWires] = useState([]); 
  const [frames, setFrames] = useState([]);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [wireRadius, setWireRadius] = useState(0); // 0 = Sharp, 20 = Round
  
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, camX: 0, camY: 0 });
  
  const [selectionBox, setSelectionBox] = useState(null); 
  
  const [drawing, setDrawing] = useState(null); 
  
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [selectedWireIds, setSelectedWireIds] = useState([]); 
  const [selectedFrameIds, setSelectedFrameIds] = useState([]);
  const [menu, setMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategories, setOpenCategories] = useState({});
  const [noteEditor, setNoteEditor] = useState(null); // { id, text }

  const lastClickTimeRef = useRef(0);
  const [dragState, setDragState] = useState(null);
  const [debugLogs, setDebugLogs] = useState([]);

  const addDebugLog = (msg) => {
    setDebugLogs(prev => [`${Date.now() % 10000}: ${msg}`, ...prev].slice(0, 15));
  };

  const getWirePath = useCallback((wire) => {
    const source = nodes.find(n => n.id === wire.sourceId);
    const target = nodes.find(n => n.id === wire.targetId);
    if (!source || !target) return [];
    
    const handles1 = ConnectionManager.getHandles(source);
    const handles2 = ConnectionManager.getHandles(target);
    
    const h1 = handles1.find(h => h.id === wire.sourcePortId);
    const h2 = handles2.find(h => h.id === wire.targetPortId);
    
    if (!h1 || !h2) return [];

    return ConnectionManager.getZPath(h1, h2, wire.centerY, wire.centerX, wire.centerY2);
  }, [nodes]);

  const handleDelete = useCallback((id, type) => {
    if (type === 'node') {
      setNodes(prev => prev.filter(n => n.id !== id));
      setDynamicWires(prev => prev.filter(w => w.sourceId !== id && w.targetId !== id));
      setSelectedNodeIds(prev => prev.filter(nid => nid !== id));
    } else if (type === 'wire') {
      setDynamicWires(prev => prev.filter(w => w.id !== id));
      setSelectedWireIds(prev => prev.filter(wid => wid !== id));
    } else if (type === 'frame') {
      setFrames(prev => prev.filter(f => f.id !== id));
      setSelectedFrameIds(prev => prev.filter(fid => fid !== id));
    }
  }, []);

  const handleRenameNode = useCallback((id, newDisplayName) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, displayName: newDisplayName } : n));
  }, []);

  const handleRenameFrame = useCallback((id, newTitle) => {
    setFrames(prev => prev.map(f => f.id === id ? { ...f, title: newTitle } : f));
  }, []);

  const handleUpdateNodeText = useCallback((id, newText, openEditor = false, extraData = {}) => {
    if (openEditor) {
      setNoteEditor({ id, text: newText });
    } else {
      setNodes(prev => prev.map(n => n.id === id ? { ...n, text: newText, ...extraData } : n));
    }
  }, []);

  // --- Handlers for MuxNode ---

  const handleNodeDown = (e, node) => {
    addDebugLog(`Node Down: ${node.label}`);
    if (menu) setMenu(null);
    const worldX = e.clientX - camera.x;
    const worldY = e.clientY - camera.y;

    const finalNodeIds = SelectionManager.handleSelectionOnDown(selectedNodeIds, node.id, e.shiftKey);
    let finalWireIds = [...selectedWireIds];
    let finalFrameIds = [...selectedFrameIds];

    if (!e.shiftKey && !selectedNodeIds.includes(node.id)) {
      finalWireIds = [];
      finalFrameIds = [];
    }

    setSelectedNodeIds(finalNodeIds);
    setSelectedWireIds(finalWireIds);
    setSelectedFrameIds(finalFrameIds);
    
    setDragState(MovementManager.prepareDragState(
      worldX, worldY, nodes, dynamicWires, finalNodeIds, finalWireIds, null, getWirePath, frames, finalFrameIds
    ));
  };

  const handleFrameDown = (e, frame) => {
    addDebugLog(`Frame Down: ${frame.id}`);
    if (menu) setMenu(null);
    const worldX = e.clientX - camera.x;
    const worldY = e.clientY - camera.y;

    const finalFrameIds = SelectionManager.handleSelectionOnDown(selectedFrameIds, frame.id, e.shiftKey);
    let finalNodeIds = [...selectedNodeIds];
    let finalWireIds = [...selectedWireIds];

    if (!e.shiftKey && !selectedFrameIds.includes(frame.id)) {
      finalNodeIds = [];
      finalWireIds = [];
    }

    setSelectedFrameIds(finalFrameIds);
    setSelectedNodeIds(finalNodeIds);
    setSelectedWireIds(finalWireIds);

    setDragState(MovementManager.prepareDragState(
      worldX, worldY, nodes, dynamicWires, finalNodeIds, finalWireIds, null, getWirePath, frames, finalFrameIds
    ));
  };

  const handlePortDown = (e, node, handle) => {
    addDebugLog(`Port Down: ${handle.id}`);
    if (menu) onClose();
    
    // If we are already drawing, don't start a new one. 
    // This allows the MouseUp on the floor to finalize the current connection.
    if (drawing) {
      addDebugLog("Port Down: Drawing already active");
      return;
    }

    const worldX = e.clientX - camera.x;
    const worldY = e.clientY - camera.y;

    // Strict Double-Click & Active Draw Guard
    const now = Date.now();
    if (now - lastClickTimeRef.current < 300) {
      addDebugLog("Guard: Double-click blocked");
      return; 
    }
    
    lastClickTimeRef.current = now;

    setDrawing({ 
      sourceId: node.id, 
      sourcePortId: handle.id, 
      sourcePortType: handle.type, 
      sourcePortDirection: handle.direction, 
      startPos: { x: handle.x, y: handle.y },
      endPos: { x: worldX, y: worldY },
      targetId: null,
      targetPortId: null
    });
  };

  // --- Main Floor Handlers ---

  const handleMouseDown = (e) => {
    addDebugLog(`Floor Down: ${e.target.tagName}`);
    console.log("Global Mouse Down:", e.target); // DEBUG
    if (menu) onClose();
    const worldX = e.clientX - camera.x;
    const worldY = e.clientY - camera.y;

    if (e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY, camX: camera.x, camY: camera.y });
      return;
    }

    // Since MuxNode handles its own clicks with stopPropagation, 
    // anything reaching here is either a Wire click or a Floor click.

    // 1. Wires (Horizontal/Vertical Drag OR Selection)
    const wiresWithPaths = dynamicWires.map(w => ({ ...w, points: getWirePath(w) }));
    
    // Check Vertical Bridge First (for centerX drag)
    const vertHit = ConnectionManager.hitTestWireVertical(worldX, worldY, wiresWithPaths, 10);
    const vertWireId = vertHit?.id;
    // Then Check Horizontal (for centerY drag)
    const horizHit = ConnectionManager.hitTestWireHorizontal(worldX, worldY, wiresWithPaths, 10);
    const horizWireId = horizHit?.id;
    // Finally, check general hit (for selection)
    const hitWireId = ConnectionManager.hitTestWires(worldX, worldY, wiresWithPaths, 10);

    const targetWireId = vertWireId || horizWireId || hitWireId;

    if (targetWireId) {
      const finalWireIds = SelectionManager.handleWireSelectionOnDown(selectedWireIds, targetWireId, e.shiftKey);
      let finalNodeIds = [...selectedNodeIds];
      let finalFrameIds = [...selectedFrameIds];

      if (!e.shiftKey && !selectedWireIds.includes(targetWireId)) {
        finalNodeIds = [];
        finalFrameIds = [];
      }

      setSelectedWireIds(finalWireIds);
      setSelectedNodeIds(finalNodeIds);
      setSelectedFrameIds(finalFrameIds);
      
      // Start drag for the selected wire(s)
      const dragIndex = vertHit?.segmentIndex ?? horizHit?.segmentIndex;
      setDragState(MovementManager.prepareDragState(
        worldX, worldY, nodes, dynamicWires, finalNodeIds, finalWireIds, dragIndex, getWirePath, frames, finalFrameIds
      ));
      return;
    }

    // 2. Background (Box Select)
    if (!e.shiftKey) {
      setSelectedNodeIds([]);
      setSelectedWireIds([]);
      setSelectedFrameIds([]);
    }
    setSelectionBox({ startX: worldX, startY: worldY, currentX: worldX, currentY: worldY });
  };

  const handleMouseMove = (e) => {
    const worldX = e.clientX - camera.x;
    const worldY = e.clientY - camera.y;

    if (isPanning) {
      setCamera({ x: panStart.camX + (e.clientX - panStart.x), y: panStart.camY + (e.clientY - panStart.y) });
      return;
    }

    if (drawing) {
      let snapTarget = null;
      let closestDist = 20; 
      nodes.forEach(node => {
        if (node.id === drawing.sourceId) return; 
        ConnectionManager.getHandles(node).forEach(h => {
          // Rule 1: Source and Target must have same color/type
          if (h.type !== drawing.sourcePortType) return;
          
          // Rule 2: Must connect Input <-> Output (opposite directions)
          // Exception: Universal ports (anchors) can connect to anything of the same type
          if (h.direction !== 'universal' && drawing.sourcePortDirection !== 'universal') {
            if (h.direction === drawing.sourcePortDirection) return;
          }

          const dist = Math.hypot(h.x - worldX, h.y - worldY);
          if (dist < closestDist) {
            closestDist = dist;
            snapTarget = { id: node.id, portId: h.id, x: h.x, y: h.y };
          }
        });
      });
      setDrawing(prev => ({
        ...prev,
        endPos: snapTarget ? { x: snapTarget.x, y: snapTarget.y } : { x: worldX, y: worldY },
        targetId: snapTarget ? snapTarget.id : null,
        targetPortId: snapTarget ? snapTarget.portId : null
      }));
      return;
    }

    if (dragState) {
      const dx = worldX - dragState.startX;
      const dy = worldY - dragState.startY;

      const nextNodes = MovementManager.calculateNodeDrag(dragState, dx, dy, nodes);
      if (nextNodes !== nodes) setNodes(nextNodes);

      const nextWires = MovementManager.calculateWireDrag(dragState, dx, dy, dynamicWires, nextNodes);
      if (nextWires !== dynamicWires) setDynamicWires(nextWires);

      const nextFrames = MovementManager.calculateFrameDrag(dragState, dx, dy, frames);
      if (nextFrames !== frames) setFrames(nextFrames);
      
      return;
    }

    if (selectionBox) {
      setSelectionBox(prev => ({ ...prev, currentX: worldX, currentY: worldY }));
      return;
    }
  };

  const handleMouseUp = () => {
    if (drawing) {
      if (drawing.targetId && drawing.targetPortId) {
        const midY = (drawing.startPos.y + drawing.endPos.y) / 2;
        
        // Normalize: Ensure source is ALWAYS the output and target is ALWAYS the input
        let finalSourceId = drawing.sourceId;
        let finalSourcePortId = drawing.sourcePortId;
        let finalTargetId = drawing.targetId;
        let finalTargetPortId = drawing.targetPortId;

        if (drawing.sourcePortDirection === 'input') {
          finalSourceId = drawing.targetId;
          finalSourcePortId = drawing.targetPortId;
          finalTargetId = drawing.sourceId;
          finalTargetPortId = drawing.sourcePortId;
        }

        setDynamicWires(prev => [...prev, { 
          id: `wire-${Date.now()}-${Math.floor(Math.random() * 1000)}`, 
          sourceId: finalSourceId, 
          sourcePortId: finalSourcePortId,
          targetId: finalTargetId,
          targetPortId: finalTargetPortId,
          type: drawing.sourcePortType,
          centerY: ConnectionManager.snap(midY, true)
        }]);
      }
      setDrawing(null);
    }

    if (selectionBox) {
      const insideNodes = SpatialManager.getNodesInRect(selectionBox, nodes).map(n => n.id);
      const insideWires = SpatialManager.getWiresInRect(selectionBox, dynamicWires, getWirePath).map(w => w.id);
      
      // Also select frames if they are fully inside the box? Or partially?
      // Let's go with partially for now for consistency
      const insideFrames = frames.filter(f => {
        const x1 = Math.min(selectionBox.startX, selectionBox.currentX);
        const y1 = Math.min(selectionBox.startY, selectionBox.currentY);
        const x2 = Math.max(selectionBox.startX, selectionBox.currentX);
        const y2 = Math.max(selectionBox.startY, selectionBox.currentY);
        return f.x < x2 && f.x + f.width > x1 && f.y < y2 && f.y + f.height > y1;
      }).map(f => f.id);

      setSelectedNodeIds(prev => [...new Set([...prev, ...insideNodes])]);
      setSelectedWireIds(prev => [...new Set([...prev, ...insideWires])]);
      setSelectedFrameIds(prev => [...new Set([...prev, ...insideFrames])]);
      setSelectionBox(null);
    }

    setDynamicWires(prev => prev.map(w => {
      const path = getWirePath(w);
      if (path.length === 4 && w.centerY2 !== undefined) {
        return { ...w, centerY2: undefined };
      }
      return w;
    }));

    setIsPanning(false);
    setDragState(null);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const worldX = e.clientX - camera.x;
    const worldY = e.clientY - camera.y;
    
    const clickedNode = nodes.find(node => SpatialManager.isPointInNode(worldX, worldY, node));
    
    const clickedFrame = frames.find(frame => SpatialManager.isPointInFrame(worldX, worldY, frame));

    const wiresWithPaths = dynamicWires.map(w => ({ ...w, points: getWirePath(w) }));
    const hitWireId = ConnectionManager.hitTestWires(worldX, worldY, wiresWithPaths, 10);

    const type = clickedNode ? 'node' : (clickedFrame ? 'frame' : (hitWireId ? 'wire' : 'pane'));
    const id = clickedNode ? clickedNode.id : (clickedFrame ? clickedFrame.id : hitWireId);

    setMenu({ 
      top: e.clientY, left: e.clientX, worldX: ConnectionManager.snap(worldX, false), worldY: ConnectionManager.snap(worldY, true), 
      id, 
      type,
      displayName: clickedNode ? (clickedNode.displayName || DISPLAY_NAMES[clickedNode.label] || clickedNode.label) : (clickedFrame ? clickedFrame.title : undefined)
    });
  };

  useEffect(() => {
    const onKey = (e) => { 
      if (e.key === 'Escape') { 
        setDrawing(null); setDragState(null); setSelectionBox(null); onClose();
      } 
      if (e.key === 'Delete' || e.key === 'Backspace') {
        selectedNodeIds.forEach(id => handleDelete(id, 'node'));
        selectedWireIds.forEach(id => handleDelete(id, 'wire'));
        selectedFrameIds.forEach(id => handleDelete(id, 'frame'));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedNodeIds, selectedWireIds, selectedFrameIds, handleDelete]);

  useEffect(() => {
    // Force browser zoom reset
    document.body.style.zoom = "100%";
    
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    const handleGesture = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('gesturestart', handleGesture, { passive: false });
    window.addEventListener('gesturechange', handleGesture, { passive: false });
    window.addEventListener('gestureend', handleGesture, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('gesturestart', handleGesture);
      window.removeEventListener('gesturechange', handleGesture);
      window.removeEventListener('gestureend', handleGesture);
    };
  }, []);

  const onClose = useCallback(() => {
    setSearchTerm('');
    setOpenCategories({});
    setMenu(null);
  }, []);

  return (
    <div style={{ 
      width: '100vw', height: '100vh', background: BG_COLOR, overflow: 'hidden', 
      userSelect: 'none',
      imageRendering: 'pixelated'
    }} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onContextMenu={handleContextMenu}>
      {/* UI Controls for Wire Radius */}
      <div style={{ position: 'fixed', top: 10, right: 10, width: 250, background: 'rgba(0,0,0,0.8)', color: '#0f0', padding: 10, fontFamily: 'monospace', fontSize: 12, pointerEvents: 'auto', zIndex: 9999 }}>
        <div style={{ display: 'flex', gap: '5px', marginBottom: 5 }}>
          <button onClick={() => navigator.clipboard.writeText(debugLogs.join('\n'))} style={{ cursor: 'pointer', background: '#333', color: '#fff', border: '1px solid #555', padding: '2px 5px' }}>Copy</button>
          <button onClick={() => setDebugLogs([])} style={{ cursor: 'pointer', background: '#333', color: '#fff', border: '1px solid #555', padding: '2px 5px' }}>Clear</button>
        </div>
        {debugLogs.map((log, i) => <div key={i}>{log}</div>)}
      </div>

      <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 1000, background: '#333', padding: '10px', borderRadius: '4px', border: '1px solid #555', color: '#eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '12px' }}>Wire Corner:</span>
        <input 
          type="range" 
          min="0" max="25" 
          value={wireRadius} 
          onChange={(e) => setWireRadius(Number(e.target.value))} 
          style={{ width: '100px', cursor: 'pointer' }}
        />
        <span style={{ fontSize: '12px', width: '20px' }}>{wireRadius}</span>
      </div>

      <div style={{ transform: `translate(${camera.x}px, ${camera.y}px)`, width: '100%', height: '100%' }}>
        
        {selectionBox && (
          <div style={{
            position: 'absolute', zIndex: 5000, pointerEvents: 'none',
            left: Math.min(selectionBox.startX, selectionBox.currentX),
            top: Math.min(selectionBox.startY, selectionBox.currentY),
            width: Math.abs(selectionBox.currentX - selectionBox.startX),
            height: Math.abs(selectionBox.currentY - selectionBox.startY),
            background: 'rgba(0, 128, 255, 0.2)', border: '1px solid #0080ff',
          }} />
        )}

        <svg style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none', width: '1px', height: '1px' }}>
          {dynamicWires
            .map(w => {
              const points = getWirePath(w);
              if (!points || points.length === 0) {
                 return null;
              }
              
              const isSelected = selectedWireIds.includes(w.id);
              const isConnectedToSelection = selectedNodeIds.includes(w.sourceId) || selectedNodeIds.includes(w.targetId);
              
              // Only dim if there's actually something selected
              const hasSelection = selectedNodeIds.length > 0 || selectedWireIds.length > 0 || selectedFrameIds.length > 0;
              const isBright = !hasSelection || isSelected || isConnectedToSelection;
              
              return { ...w, points, isBright, isSelected };
            })
            .sort((a, b) => (a.isBright === b.isBright ? 0 : a.isBright ? 1 : -1))
            .map((w) => (
              w && <Wire key={w.id} points={w.points} type={w.type} isSelected={w.isSelected} isDimmed={!w.isBright} cornerRadius={wireRadius} />
            ))
          }
          {drawing && (() => {
             let start = drawing.startPos;
             let end = drawing.endPos;
             if (drawing.sourcePortDirection === 'input') {
               start = drawing.endPos;
               end = drawing.startPos;
             }
             const path = ConnectionManager.getZPath(start, end);
             return <Wire points={path} type={drawing.sourcePortType} isGhost cornerRadius={wireRadius} />;
          })()}
        </svg>

        {frames.map(frame => (
          <Frame 
            key={frame.id}
            frame={frame}
            isSelected={selectedFrameIds.includes(frame.id)}
            isDimmed={(selectedNodeIds.length > 0 || selectedWireIds.length > 0 || selectedFrameIds.length > 0) && !selectedFrameIds.includes(frame.id)}
            onFrameDown={handleFrameDown}
            onRename={handleRenameFrame}
          />
        ))}

        {nodes.map(node => {
          const module = moduleRegistry[node.label];
          if(!module && !module?.isAnchor) return null;

          const height = 38; // Grid unit
          const realH = module.realHeight || 38;
          const hasInputs = module.inputs && module.inputs.length > 0;
          const hasOutputs = module.outputs && module.outputs.length > 0;
          
          // A module has a top stub if it is 38px OR if it has inputs.
          // (Small source modules like Audio Input don't have top stubs)
          const hasTopStubs = realH === 38 || hasInputs;
          
          // A module has a bottom stub if it is 38px OR if it has outputs.
          // (Small sink modules like Audio Output don't have bottom stubs)
          const hasBottomStubs = realH === 38 || hasOutputs;
          
          const dockedTop = hasTopStubs && nodes.some(other => {
            const otherModule = moduleRegistry[other.label];
            const otherHasBottomStubs = (otherModule?.realHeight || 38) === 38 || (otherModule?.outputs && otherModule.outputs.length > 0);
            return other.id !== node.id && 
                   other.x === node.x && 
                   other.y === node.y - 19 &&
                   otherHasBottomStubs;
          });

          const dockedBottom = hasBottomStubs && nodes.some(other => {
            const otherModule = moduleRegistry[other.label];
            const otherHasTopStubs = (otherModule?.realHeight || 38) === 38 || (otherModule?.inputs && otherModule.inputs.length > 0);
            return other.id !== node.id && 
                   other.x === node.x && 
                   other.y === node.y + 19 &&
                   otherHasTopStubs;
          });

          return (
            <MuxNode 
              key={node.id}
              node={node}
              isSelected={selectedNodeIds.includes(node.id)}
              isDimmed={(selectedNodeIds.length > 0 || selectedWireIds.length > 0 || selectedFrameIds.length > 0) && !selectedNodeIds.includes(node.id)}
              dockedTop={dockedTop}
              dockedBottom={dockedBottom}
              onNodeDown={handleNodeDown}
              onPortDown={handlePortDown}
              onUpdateText={handleUpdateNodeText}
            />
          );
        })}
      </div>
      <CustomContextMenu 
        menu={menu} 
        onDelete={handleDelete} 
        onRename={handleRenameNode}
        onRenameFrame={handleRenameFrame}
        onAddNode={(label, x, y) => setNodes(prev => [...prev, { id: `${label}-${Date.now()}`, label, x, y }])} 
        onAddFrame={(x, y) => setFrames(prev => [...prev, { id: `frame-${Date.now()}`, x, y, width: 200, height: 150, title: 'New Group' }])}
        onClose={onClose}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        openCategories={openCategories}
        setOpenCategories={setOpenCategories}
      />

      {noteEditor && (
        <NoteEditor
          node={{ ...nodes.find(n => n.id === noteEditor.id), text: noteEditor.text }}
          onSave={handleUpdateNodeText}
          onClose={() => setNoteEditor(null)}
        />
      )}
    </div>
  );
}