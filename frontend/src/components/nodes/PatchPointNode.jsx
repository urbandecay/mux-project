import React from 'react';
import useStore from '../../store/useStore';
import * as ConnectionManager from '../../utils/ConnectionManager';

const PatchPointNode = ({ 
  node, 
  inputs,
  outputs,
  isSelected, 
  onNodeDown, 
  onNodeDoubleClick,
  onPortDown
}) => {
  const patchPointSize = useStore(state => state.patchPointSize);
  const patchPointColorMode = useStore(state => state.patchPointColorMode);
  const patchPointHitboxRadius = useStore(state => state.patchPointHitboxRadius);

  const pp2Handles = ConnectionManager.getHandlesFromIO(node, inputs, outputs, useStore.getState().wires);
  const portType = pp2Handles.length > 0 ? pp2Handles[0].type : 'universal';
  const lightColors = { audio: '#f30019', event: '#3b74fd', modulation: '#48ff09', universal: '#ffffff' };
  const darkColors = { audio: '#7d181a', event: '#184b80', modulation: '#187e1a', universal: '#ffffff' };
  const palette = patchPointColorMode === 'dark' ? darkColors : lightColors;
  const pp2Color = portType === 'universal' ? '#ffffff' : (palette[portType] || '#ffffff');
  
  const offsetX = 10.5 - (patchPointSize / 2);
  const offsetY = 0 - (patchPointSize / 2);
  const hitBoxWidth = patchPointSize + (patchPointHitboxRadius * 2);
  const hitBoxHeight = patchPointSize + (patchPointHitboxRadius * 2);

  return (
    <div 
      className="mux-node"
      style={{ position: 'absolute', left: node.x + offsetX, top: node.y + offsetY, width: patchPointSize, height: patchPointSize, cursor: 'grab', zIndex: isSelected ? 100 : 1 }}
      onMouseDown={(e) => { onNodeDown(e, node); e.stopPropagation(); }}
      onDoubleClick={(e) => { onNodeDoubleClick(e, node); e.stopPropagation(); }}
    >
      <div style={{ width: '100%', height: '100%', background: pp2Color, outline: isSelected ? '1px solid #0080ff' : 'none', outlineOffset: '1px', pointerEvents: 'auto', position: 'relative', zIndex: 20 }} />
      {pp2Handles.map(h => (
        <div 
          key={h.id} 
          onMouseDown={(e) => { onPortDown(e, node, h); e.stopPropagation(); }}
          style={{ position: 'absolute', left: h.x - (node.x + offsetX) - (hitBoxWidth / 2), top: h.y - (node.y + offsetY) - (hitBoxHeight / 2), width: hitBoxWidth, height: hitBoxHeight, cursor: 'crosshair', pointerEvents: 'auto', zIndex: 10 }} 
        />
      ))}
    </div>
  );
};

export default PatchPointNode;
