import React, { useRef, useMemo, useEffect, useState } from 'react';
import { moduleRegistry } from './moduleRegistry';

const CustomContextMenu = ({ menu, onDelete, onRename, onRenameFrame, onAddNode, onAddFrame, onClose, searchTerm, setSearchTerm, openCategories, setOpenCategories }) => {
  const inputRef = useRef(null);
  const renameInputRef = useRef(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    if (menu?.type === 'node' || menu?.type === 'frame') {
      setRenameValue(menu.displayName || '');
    }
    setIsRenaming(false);
  }, [menu]);

  const categories = useMemo(() => {
    const groups = {};
    Object.keys(moduleRegistry).forEach((key) => {
      if (key === 'Anchor') return; // Hide Anchor from the list
      const module = moduleRegistry[key];
      if (!groups[module.category]) groups[module.category] = [];
      
      if (!searchTerm || key.toLowerCase().includes(searchTerm.toLowerCase())) {
        groups[module.category].push(key);
      }
    });
    Object.keys(groups).forEach(cat => {
      if (groups[cat].length === 0) delete groups[cat];
    });
    return groups;
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      const allOpen = {};
      Object.keys(categories).forEach(cat => allOpen[cat] = true);
      setOpenCategories(allOpen);
    } else {
      setOpenCategories({});
    }
  }, [searchTerm, categories, setOpenCategories]);

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [menu]);

  if (!menu) return null;

  const toggleCategory = (cat) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleRenameSubmit = (e) => {
    if (e.key === 'Enter') {
      if (menu.type === 'node') onRename(menu.id, renameValue);
      else if (menu.type === 'frame') onRenameFrame(menu.id, renameValue);
      onClose();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
    }
  };

  return (
    <div className="context-menu" style={{ top: menu.top, left: menu.left, maxHeight: '450px', display: 'flex', flexDirection: 'column' }} onMouseDown={e => e.stopPropagation()}>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {isRenaming ? (
          <div style={{ padding: '8px' }}>
            <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px' }}>Rename {menu.type === 'node' ? 'Node' : 'Frame'}:</div>
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={handleRenameSubmit}
              style={{
                width: '100%',
                background: '#000',
                color: '#fff',
                border: '1px solid #444',
                fontSize: '12px',
                padding: '4px',
                outline: 'none'
              }}
            />
            <div style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>Press Enter to save, Esc to cancel</div>
          </div>
        ) : (
          <>
            {menu.type !== 'pane' && (
              <div className="context-menu-item" onClick={() => { onDelete(menu.id, menu.type); onClose(); }}>
                Delete {menu.type.charAt(0).toUpperCase() + menu.type.slice(1)}
              </div>
            )}
            {(menu.type === 'node' || menu.type === 'frame') && (
              <div className="context-menu-item" onClick={() => setIsRenaming(true)}>
                Rename {menu.type.charAt(0).toUpperCase() + menu.type.slice(1)}
              </div>
            )}
            {menu.type === 'pane' && (
              <div className="context-menu-item" onClick={() => { onAddFrame(menu.worldX, menu.worldY); onClose(); }} style={{ borderBottom: '1px solid #444' }}>
                Add Group Frame
              </div>
            )}
          </>
        )}
        
        {menu.type === 'pane' && (
          <div className="menu-modules-list">
            <div className="context-menu-header" style={{ padding: '2px 12px', color: '#aaa', fontSize: '11px', fontWeight: 'bold', borderTop: '1px solid #444', fontFamily: '"DejaVu Sans", sans-serif' }}>Modules</div>
            {Object.keys(categories).sort().map((category) => {
              const isOpen = openCategories[category];
              return (
                <div key={category} className="menu-category-group">
                  <div 
                    className="context-menu-item category-header" 
                    onClick={() => toggleCategory(category)}
                    style={{ 
                      display: 'flex', justifyContent: 'flex-start', alignItems: 'center', 
                      background: isOpen ? '#333' : 'transparent',
                      paddingTop: '3px', paddingBottom: '3px',
                      gap: '8px',
                      fontSize: '12px',
                      fontFamily: '"DejaVu Sans", sans-serif'
                    }}
                  >
                    <span style={{ fontSize: '10px', width: '10px' }}>{isOpen ? '▼' : '▶'}</span>
                    {category} 
                  </div>
                  {isOpen && (
                    <div className="category-content" style={{ background: '#252525' }}>
                      {categories[category].sort().map((moduleName) => (
                        <div 
                          key={moduleName} 
                          className="context-menu-item sub-item" 
                          onClick={() => { onAddNode(moduleName, menu.worldX, menu.worldY); onClose(); }}
                          style={{ 
                            paddingLeft: '48px', fontSize: '12px',
                            paddingTop: '2px', paddingBottom: '2px',
                            fontFamily: '"DejaVu Sans", sans-serif'
                          }}
                        >
                          {moduleName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!menu.id && (
        <div className="menu-search-container" style={{ padding: '12px 8px', borderTop: '1px solid #555', background: '#1a1a1a' }}>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', background: '#000', color: '#fff', border: '1px solid #444', 
              fontSize: '11px', padding: '3px 4px', outline: 'none' 
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CustomContextMenu;
