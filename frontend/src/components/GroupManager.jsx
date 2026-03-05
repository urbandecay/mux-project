import React from 'react';
import useStore from '../store/useStore';

const GroupManager = () => {
    const { groups, parentId, renameGroup, ungroup, setSelectedNodeIds, selectedNodeIds, editingGroupId, nodes } = useStore();
    
    const visibleGroups = groups.filter(g => g.parentId === parentId);
    
    if (visibleGroups.length === 0) return null;

    // Determine which groups are currently considered "selected" based on node selection
    const selectedGroupIds = new Set();
    selectedNodeIds.forEach(nodeId => {
        const node = nodes.find(n => n.id === nodeId);
        if (node && node.groupId) {
            selectedGroupIds.add(node.groupId);
        }
    });

    return (
        <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '200px',
            maxHeight: '300px',
            backgroundColor: 'rgba(30, 30, 30, 0.9)',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#eee',
            fontSize: '11px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            pointerEvents: 'auto'
        }}>
            <div style={{ 
                padding: '6px 10px', 
                borderBottom: '1px solid #444', 
                fontWeight: 'bold',
                backgroundColor: 'rgba(50, 50, 50, 0.5)'
            }}>
                Groups ({visibleGroups.length})
            </div>
            <div style={{ overflowY: 'auto', padding: '5px 0' }}>
                {visibleGroups.map(group => {
                    const isSelected = selectedGroupIds.has(group.id);
                    const isEditing = editingGroupId === group.id;

                    return (
                        <div 
                            key={group.id} 
                            style={{ 
                                padding: '4px 10px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                cursor: 'default',
                                backgroundColor: isEditing ? 'rgba(0, 128, 255, 0.4)' : (isSelected ? 'rgba(255, 255, 255, 0.15)' : 'transparent'),
                                borderLeft: isEditing ? '3px solid #0080ff' : (isSelected ? '3px solid #aaa' : '3px solid transparent')
                            }}
                            onMouseEnter={(e) => {
                                if (!isEditing && !isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isEditing && !isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <span 
                                style={{ 
                                    flex: 1, 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    fontWeight: isEditing || isSelected ? 'bold' : 'normal'
                                }}
                                onClick={() => {
                                    // Select all nodes and wires in this group
                                    const { nodes, wires } = useStore.getState();
                                    const groupNodeIds = nodes.filter(n => n.groupId === group.id).map(n => n.id);
                                    const groupWireIds = wires.filter(w => w.groupId === group.id).map(w => w.id);
                                    setSelectedNodeIds(groupNodeIds);
                                    useStore.getState().setSelectedWireIds(groupWireIds);
                                }}
                                onDoubleClick={() => {
                                    const newName = prompt('Enter new group name:', group.name);
                                    if (newName) renameGroup(group.id, newName);
                                }}
                                title="Click to select, Double-click to rename"
                            >
                                {group.name}
                                {isEditing && <span style={{ marginLeft: '5px', fontSize: '9px', color: '#88ccff', fontStyle: 'italic' }}>(Editing)</span>}
                            </span>
                            <button 
                                onClick={() => ungroup(group.id)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: isEditing || isSelected ? '#ccc' : '#888',
                                    cursor: 'pointer',
                                    padding: '0 4px',
                                    fontSize: '10px'
                                }}
                                title="Ungroup"
                            >
                                ✕
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GroupManager;
