import React, { useRef, useMemo, useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { moduleRegistry, getModuleIcon } from '../utils/moduleRegistry';
import ProceduralIcon from './ProceduralIcon';

const CustomContextMenu = ({ 
  menu, onDelete, onRename, onRenameGroup, onUngroup, onSampleColor, onAddNode, onGroup, onEnterGroupEdit, onClose, 
  searchTerm, setSearchTerm, openCategories, setOpenCategories,
  replacingNodeId, setReplacingNodeId, onReplaceNode
}) => {
  const { nodes, groups, selectedNodeIds } = useStore();
  const inputRef = useRef(null);
  const renameInputRef = useRef(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isRenamingGroup, setIsRenamingGroup] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [groupRenameValue, setGroupRenameValue] = useState('');

  const targetNode = useMemo(() => {
    if (menu?.type === 'node') return nodes.find(n => n.id === menu.id);
    return null;
  }, [menu, nodes]);

  const targetGroup = useMemo(() => {
    if (targetNode?.groupId) return groups.find(g => g.id === targetNode.groupId);
    return null;
  }, [targetNode, groups]);

  useEffect(() => {
    if (menu?.type === 'node') {
      setRenameValue(menu.displayName || '');
    }
    if (targetGroup) {
      setGroupRenameValue(targetGroup.name || '');
    }
    setIsRenaming(false);
    setIsRenamingGroup(false);
  }, [menu, targetGroup]);

  const categories = useMemo(() => {
    const groupsMap = {};
    Object.keys(moduleRegistry).forEach((key) => {
      if (key === 'Anchor') return; // Hide Anchor from the list
      const module = moduleRegistry[key];
      if (!groupsMap[module.category]) groupsMap[module.category] = [];
      
      if (!searchTerm || key.toLowerCase().includes(searchTerm.toLowerCase())) {
        groupsMap[module.category].push(key);
      }
    });
    Object.keys(groupsMap).forEach(cat => {
      if (groupsMap[cat].length === 0) delete groupsMap[cat];
    });
    return groupsMap;
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
    if (isRenamingGroup && renameInputRef.current) {
        renameInputRef.current.focus();
        renameInputRef.current.select();
    }
  }, [isRenaming, isRenamingGroup]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [menu, replacingNodeId]); // Re-focus on search if we enter replace mode

  if (!menu) return null;

  const toggleCategory = (cat) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleRenameSubmit = (e) => {
    if (e.key === 'Enter') {
      if (isRenamingGroup && targetGroup) {
          onRenameGroup(targetGroup.id, groupRenameValue);
      } else if (isRenaming) {
          onRename(menu.id, renameValue);
      }
      onClose();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
      setIsRenamingGroup(false);
    }
  };

  // When replacing, we treat the menu as a module picker
  const isPickingModule = menu.type === 'pane' || replacingNodeId !== null;

  return (
    <div className="context-menu" style={{ top: menu.top, left: menu.left, maxHeight: '450px', display: 'flex', flexDirection: 'column' }} onMouseDown={e => e.stopPropagation()}>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        
        {isRenaming || isRenamingGroup ? (
          <div style={{ padding: '8px' }}>
            <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px' }}>Rename {isRenamingGroup ? 'Group' : 'Node'}:</div>
            <input
              ref={renameInputRef}
              type="text"
              value={isRenamingGroup ? groupRenameValue : renameValue}
              onChange={(e) => isRenamingGroup ? setGroupRenameValue(e.target.value) : setRenameValue(e.target.value)}
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
            {!isPickingModule && menu.type !== 'pane' && (
              <div className="context-menu-item" onClick={() => { onDelete(menu.id, menu.type); onClose(); }}>
                Delete {menu.type.charAt(0).toUpperCase() + menu.type.slice(1)}
              </div>
            )}
            {!isPickingModule && menu.type === 'node' && (
              <div className="context-menu-item" onClick={() => setIsRenaming(true)}>
                Rename Node
              </div>
            )}
            
            {/* Grouping Actions */}
            {!isPickingModule && selectedNodeIds.length > 1 && (
                <div className="context-menu-item" onClick={() => { onGroup(selectedNodeIds); onClose(); }} style={{ fontWeight: 'bold', borderTop: '1px solid #444' }}>
                    Group Selected
                </div>
            )}
            {!isPickingModule && targetGroup && (
                <>
                    <div className="context-menu-item" onClick={() => { onEnterGroupEdit(targetGroup.id); onClose(); }} style={{ fontWeight: 'bold', borderTop: '1px solid #444' }}>
                        Edit Group ({targetGroup.name})
                    </div>
                    <div className="context-menu-item" onClick={() => { setIsRenamingGroup(true); }}>
                        Rename Group
                    </div>
                    <div className="context-menu-item" onClick={() => { onUngroup(targetGroup.id); onClose(); }}>
                        Ungroup
                    </div>
                </>
            )}

            {!isPickingModule && menu.type === 'node' && (
              <div className="context-menu-item" onClick={() => { onSampleColor(menu.id); onClose(); }} style={{ borderTop: targetGroup ? 'none' : '1px solid #444' }}>
                Sample Color
              </div>
            )}
            {!isPickingModule && menu.type === 'node' && (
              <div className="context-menu-item" onClick={() => setReplacingNodeId(menu.id)}>
                Replace Node
              </div>
            )}
          </>
        )}
        
        {isPickingModule && (
          <div className="menu-modules-list">
            <div className="context-menu-header" style={{ padding: '2px 12px', color: '#aaa', fontSize: '11px', fontWeight: 'bold', borderTop: '1px solid #444', fontFamily: '"DejaVu Sans", sans-serif' }}>
              {replacingNodeId ? 'Replace with...' : 'Modules'}
            </div>
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
                      {categories[category].sort().map((moduleName) => {
                        const icon = getModuleIcon(moduleName, category);
                        return (
                          <div 
                            key={moduleName} 
                            className="context-menu-item sub-item" 
                            onClick={() => { 
                              if (replacingNodeId) {
                                onReplaceNode(replacingNodeId, moduleName);
                              } else {
                                onAddNode(moduleName, menu.worldX, menu.worldY);
                              }
                              onClose(); 
                            }}
                            style={{ 
                              paddingLeft: '40px', fontSize: '12px',
                              paddingTop: '3px', paddingBottom: '3px',
                              fontFamily: '"DejaVu Sans", sans-serif',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start', // OVERRIDE the space-between from CSS
                              gap: '8px'
                            }}
                          >
                            {icon && (
                              <ProceduralIcon 
                                name={icon} 
                                style={{ flexShrink: 0 }}
                              />
                            )}
                            {moduleName}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {(menu.type === 'pane' || replacingNodeId !== null) && (
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
