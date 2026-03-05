import React from 'react';
import { moduleRegistry, DISPLAY_NAMES, GREEN_YELLOW_MODULES, getModuleIcon } from '../../utils/moduleRegistry';
import * as ConnectionManager from '../../utils/ConnectionManager';
import ProceduralModule from '../ProceduralModule';

const StandardNode = ({ 
  node, 
  inputs,
  outputs,
  isSelected, 
  isHighlighted,
  isActive,
  onIndicatorClick,
  onNodeDown, 
  onNodeDoubleClick,
  onPortDown,
  dockedTop, 
  dockedBottom, 
  overlappingTop,
  overlappingBottom,
  kissingTop,
  kissingBottom
}) => {
  const module = moduleRegistry[node.label];
  const width = node.label === 'MUX Modular' 
    ? Math.max(99, ((Math.max(inputs.length, outputs.length) > 0 ? (10.5 + (Math.max(inputs.length, outputs.length) - 1) * 14 + 6) + 5 : 99))) 
    : (node.width || module?.width || 99);
    
  const isGreenYellow = GREEN_YELLOW_MODULES.includes(node.label);

  const clipTop = dockedTop ? 9 : 0;
  const clipBottom = dockedBottom ? 9 : 0;
  const clipPath = `inset(${clipTop}px 0px ${clipBottom}px 0px)`;

  return (
    <div 
      className="mux-node"
      data-highlighted={isHighlighted}
      data-selected={isSelected}
      style={{ position: 'absolute', left: node.x, top: node.y, width, height: 38, zIndex: isSelected ? 100 : 1, cursor: 'grab', pointerEvents: 'none' }}
      onMouseDown={(e) => { onNodeDown(e, node); e.stopPropagation(); }}
      onDoubleClick={(e) => { onNodeDoubleClick(e, node); e.stopPropagation(); }}
    >
      <ProceduralModule 
        width={width} inputs={inputs} outputs={outputs} originalLabel={node.label} displayName={node.displayName || DISPLAY_NAMES[node.label]}
        isSelected={isSelected} hasIndicator={isGreenYellow} isActive={isActive} onIndicatorClick={() => onIndicatorClick(node.id)}
        icon={getModuleIcon(node.label, module?.category)} dockedTop={dockedTop} dockedBottom={dockedBottom} color={node.color}
      />

      {/* Render Ports - Matches Debug Folder logic for stacking interactivity */}
      {ConnectionManager.getHandlesFromIO(node, inputs, outputs).map(h => {
        // Hiding logic from Debug Folder
        if ((h.direction === 'input' && (dockedTop || overlappingTop || kissingTop)) || 
            (h.direction === 'output' && (dockedBottom || overlappingBottom || kissingBottom))) {
          return null;
        }

        return (
          <div 
            key={h.id} 
            onMouseDown={(e) => { onPortDown(e, node, h); e.stopPropagation(); }}
            style={{ 
              position: 'absolute', 
              left: h.x - node.x - 7, 
              top: h.y - node.y - 7, // Exactly -7px for input (0) and output (38)
              width: 14, 
              height: 14, 
              cursor: 'crosshair', 
              pointerEvents: 'auto', 
              zIndex: h.direction === 'output' && kissingBottom ? 15 : 10 
            }} 
          />
        );
      })}
    </div>
  );
};

export default StandardNode;
