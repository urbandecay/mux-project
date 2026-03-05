import React, { useState, useEffect, useCallback } from 'react';
import useStore from './store/useStore';
import Canvas from './components/Canvas';
import CustomContextMenu from './components/ContextMenu';
import NoteEditor from './components/NoteEditor';
import ZoomControls from './components/ZoomControls';
import ProjectControls from './components/ProjectControls';
import GroupManager from './components/GroupManager';
import './components/ContextMenu.css'; 
import './App.css';

const BG_COLOR = '#1a1a1a';

export default function App() {
  const { 
    nodes, wireRadius, wireWidth,
    patchPointSize, patchPointColorMode, patchPointHitboxRadius,
    setPatchPointSize, setPatchPointColorMode, setPatchPointHitboxRadius,
    selectedNodeIds, selectedWireIds,
    replacingNodeId,
    setAllModulesActive, highlightByIndicators, setHighlightByIndicators,
    setWireRadius, setWireWidth, setSelectionBox, setDrawing, setDragState,
    setReplacingNodeId,
    deleteNode, deleteWire,
    renameNode, updateNodeText, replaceNode,
    setNodeColor,
    addNewNode, createGroup, ungroup, renameGroup,
    enterGroupEdit, exitGroupEdit,
    undo, redo,
    navigationStack, navigateOut
  } = useStore();

  // Local UI State
  const [menu, setMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategories, setOpenCategories] = useState({});
  const [noteEditor, setNoteEditor] = useState(null); // { id, text }

  const handleSampleColor = useCallback(async (nodeId) => {
    if (!window.EyeDropper) {
      // Fallback: Create a temporary color input
      const input = document.createElement('input');
      input.type = 'color';
      input.style.display = 'none';
      document.body.appendChild(input);
      
      input.onchange = (e) => {
        setNodeColor(nodeId, e.target.value);
        document.body.removeChild(input);
      };
      
      input.click();
      return;
    }
    const eyeDropper = new window.EyeDropper();
    try {
      const result = await eyeDropper.open();
      setNodeColor(nodeId, result.sRGBHex);
    } catch (e) {
      // User canceled
    }
  }, [setNodeColor]);

  const onCloseMenu = useCallback(() => {
    setSearchTerm('');
    setOpenCategories({});
    setMenu(null);
    setReplacingNodeId(null);
  }, [setReplacingNodeId]);

  const handleDeleteItem = useCallback((id, type) => {
    if (type === 'node') deleteNode(id);
    else if (type === 'wire') deleteWire(id);
  }, [deleteNode, deleteWire]);

  // Global Keyboard Handlers
  useEffect(() => {
    const onKey = (e) => { 
      // Escape
      if (e.key === 'Escape') { 
        setDrawing(null); setDragState(null); setSelectionBox(null); onCloseMenu();
        exitGroupEdit();
      } 
      
      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only delete if not typing in an input (though event bubbling usually handles this, better safe)
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          selectedNodeIds.forEach(id => deleteNode(id));
          selectedWireIds.forEach(id => deleteWire(id));
        }
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
          redo();
          e.preventDefault();
      }

      // Grouping Shortcut (Ctrl+G)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        if (selectedNodeIds.length > 0) {
            createGroup(selectedNodeIds);
        }
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    selectedNodeIds, selectedWireIds, 
    deleteNode, deleteWire, 
    setDrawing, setDragState, setSelectionBox, onCloseMenu,
    undo, redo, createGroup
  ]);

  // Prevent Browser Zoom & Gestures
  useEffect(() => {
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

  return (
    <div style={{ 
      width: '100vw', height: '100vh', background: BG_COLOR, overflow: 'hidden', 
      userSelect: 'none',
      imageRendering: 'pixelated'
    }} onContextMenu={(e) => e.preventDefault()}>
      
      {/* Control Panel */}
      <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 1000, background: '#333', padding: '6px 8px', borderRadius: '4px', border: '1px solid #555', color: '#eee', display: 'flex', flexDirection: 'column', gap: '6px', width: '130px' }}>
        {/* Wire Radius */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px' }}>Corner:</span>
          <input 
            type="range" 
            min="0" max="25" 
            value={wireRadius} 
            onChange={(e) => setWireRadius(Number(e.target.value))} 
            style={{ width: '60px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '10px', width: '12px', textAlign: 'right' }}>{wireRadius}</span>
        </div>

        {/* Wire Width Toggle */}
        <button 
            onClick={() => setWireWidth(wireWidth === 3 ? 4 : 3)}
            style={{ width: '100%', background: wireWidth === 4 ? '#0080ff' : '#444', color: '#fff', border: '1px solid #555', padding: '3px', borderRadius: '3px', fontSize: '9px', cursor: 'pointer' }}
        >
            {wireWidth === 4 ? 'Thick Wires' : 'Thin Wires'}
        </button>

        <div style={{ borderTop: '1px solid #555', margin: '2px 0' }} />

        {/* Global Light Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
                <button
                    onClick={() => setAllModulesActive(true)}
                    style={{ flex: 1, background: '#444', color: '#fff', border: '1px solid #555', padding: '3px', borderRadius: '3px', fontSize: '9px', cursor: 'pointer' }}
                >
                    On
                </button>
                <button
                    onClick={() => setAllModulesActive(false)}
                    style={{ flex: 1, background: '#444', color: '#fff', border: '1px solid #555', padding: '3px', borderRadius: '3px', fontSize: '9px', cursor: 'pointer' }}
                >
                    Off
                </button>
            </div>
            <button
                onClick={() => setHighlightByIndicators(!highlightByIndicators)}
                style={{
                    width: '100%',
                    background: highlightByIndicators ? '#4caf50' : '#444',
                    color: '#fff',
                    border: '1px solid #555',
                    padding: '3px',
                    borderRadius: '3px',
                    fontSize: '9px',
                    cursor: 'pointer'
                }}
            >
                Indicator Highlight: {highlightByIndicators ? 'ON' : 'OFF'}
            </button>
        </div>

        <div style={{ borderTop: '1px solid #555', margin: '2px 0' }} />

        {/* Patch Point Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
                onClick={() => setPatchPointSize(patchPointSize === 5 ? 7 : (patchPointSize === 7 ? 9 : 5))}
                style={{ width: '100%', background: '#444', color: '#fff', border: '1px solid #555', padding: '3px', borderRadius: '3px', fontSize: '9px', cursor: 'pointer' }}
            >
                PP Size: {patchPointSize === 5 ? 'Small' : (patchPointSize === 7 ? 'Medium' : 'Large')}
            </button>
            <button
                onClick={() => setPatchPointColorMode(patchPointColorMode === 'light' ? 'dark' : 'light')}
                style={{ width: '100%', background: patchPointColorMode === 'dark' ? '#0080ff' : '#444', color: '#fff', border: '1px solid #555', padding: '3px', borderRadius: '3px', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}
            >
                PP <span style={{ color: '#3b74fd' }}>C</span><span style={{ color: '#ff4444' }}>o</span><span style={{ color: '#48ff09' }}>l</span><span style={{ color: '#ff4444' }}>o</span><span style={{ color: '#3b74fd' }}>r</span>: {patchPointColorMode === 'light' ? 'Light' : 'Matched'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px' }}>PP Hitbox:</span>
                <button 
                  onClick={() => setPatchPointHitboxRadius(Math.max(0, patchPointHitboxRadius - 1))}
                  style={{ background: '#444', color: '#fff', border: '1px solid #555', padding: '1px 5px', borderRadius: '2px', cursor: 'pointer' }}
                >-</button>
                <span style={{ fontSize: '10px', width: '12px', textAlign: 'center' }}>{patchPointHitboxRadius}</span>
                <button 
                  onClick={() => setPatchPointHitboxRadius(Math.min(10, patchPointHitboxRadius + 1))}
                  style={{ background: '#444', color: '#fff', border: '1px solid #555', padding: '1px 5px', borderRadius: '2px', cursor: 'pointer' }}
                >+</button>
            </div>
        </div>

      </div>      {/* Navigation Breadcrumbs */}
      {navigationStack.length > 0 && (
        <div style={{ position: 'fixed', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 1100, display: 'flex', gap: '5px' }}>
          <button 
            onClick={navigateOut}
            style={{ 
              background: '#444', color: '#fff', border: '1px solid #666', 
              padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '28px', fontSize: '11px', display: 'flex', alignItems: 'center'
            }}
          >
            ← Back to Parent
          </button>
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0 10px', borderRadius: '4px', color: '#aaa', fontSize: '11px', display: 'flex', alignItems: 'center', height: '28px' }}>
            Level: {navigationStack.length}
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <ZoomControls />
      
      {/* Project Controls */}
      <ProjectControls />

      {/* Group Manager */}
      <GroupManager />

      {/* Main Canvas */}
      <Canvas 
        onOpenMenu={setMenu} 
        onOpenNoteEditor={(id, text) => setNoteEditor({ id, text })}
        onCloseMenu={onCloseMenu}
      />

      {/* UI Overlays */}
      <CustomContextMenu 
        menu={menu} 
        onDelete={handleDeleteItem} 
        onRename={renameNode}
        onRenameGroup={renameGroup}
        onUngroup={ungroup}
        onGroup={createGroup}
        onEnterGroupEdit={enterGroupEdit}
        onSampleColor={handleSampleColor}
        onAddNode={addNewNode} 
        onClose={onCloseMenu}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        openCategories={openCategories}
        setOpenCategories={setOpenCategories}
        replacingNodeId={replacingNodeId}
        setReplacingNodeId={setReplacingNodeId}
        onReplaceNode={replaceNode}
      />

      {noteEditor && (
        <NoteEditor
          node={{ ...nodes.find(n => n.id === noteEditor.id), text: noteEditor.text }}
          onSave={(id, text, _, extra) => updateNodeText(id, text, extra)}
          onClose={() => setNoteEditor(null)}
        />
      )}
    </div>
  );
}
