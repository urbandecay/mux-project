import React from 'react';
import ProceduralIcon from '../ProceduralIcon';

const NoteNode = ({ 
  node, 
  isSelected, 
  isHighlighted, 
  onNodeDown, 
  onUpdateText 
}) => {
  const noteH = 20;
  return (
    <div 
      className="mux-node"
      data-highlighted={isHighlighted}
      data-selected={isSelected}
      style={{ 
        position: 'absolute', left: node.x, top: node.y + (38 - noteH) / 2, width: 18, height: noteH, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: isSelected ? 100 : 1, cursor: 'pointer',
        outline: isSelected ? '1px solid #0080ff' : 'none', outlineOffset: '2px'
      }}
      onMouseDown={(e) => { onNodeDown(e, node); e.stopPropagation(); }}
      onDoubleClick={(e) => { e.stopPropagation(); onUpdateText(node.id, node.text || '', true); }}
    >
      <ProceduralIcon name="notepad" style={{ display: 'block' }} />
    </div>
  );
};

export default NoteNode;
