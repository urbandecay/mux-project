import React from 'react';
import ModuleLabel from '../ModuleLabel';
import { DISPLAY_NAMES } from '../../utils/moduleRegistry';

const AnchorNode = ({ 
  node, 
  isSelected, 
  onNodeDown 
}) => {
  const width = 20;
  return (
    <div 
      className="mux-node"
      style={{ position: 'absolute', left: node.x, top: node.y, width, height: 20 }}
      onMouseDown={(e) => { onNodeDown(e, node); e.stopPropagation(); }}
    >
      <div style={{ width: 6, height: 6, margin: '7px', background: '#fff', pointerEvents: 'auto', boxShadow: isSelected ? '0 0 0 2px #0080ff' : 'none' }} />
      <ModuleLabel label={node.label} displayName={node.displayName || DISPLAY_NAMES[node.label]} isAnchor={true} width={width} />
    </div>
  );
};

export default AnchorNode;
