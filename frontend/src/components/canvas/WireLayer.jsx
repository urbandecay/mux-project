import React from 'react';
import Wire from '../Wire';
import * as ConnectionManager from '../../utils/ConnectionManager';

const WireLayer = ({ visibleWires, drawing, wireRadius, getWirePath, highlightedWireIds, selectedWireIds }) => {
  return (
    <svg style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none', width: '1px', height: '1px' }}>
      {visibleWires.map(w => {
          const points = getWirePath(w); if (!points || points.length === 0) return null;
          const isBright = highlightedWireIds.has(w.id);
          return { ...w, points, isBright, isSelected: selectedWireIds.includes(w.id) };
        })
        .sort((a, b) => ((a.isSelected ? 2 : 0) + (a.isBright ? 1 : 0)) - ((b.isSelected ? 2 : 0) + (a.isBright ? 1 : 0)))
        .map((w) => w && <Wire key={w.id} points={w.points} type={w.type} color={w.color} isSelected={w.isSelected} isDark={!w.isBright} isHighlighted={w.isBright} cornerRadius={wireRadius} />)
      }
      {drawing && <Wire points={ConnectionManager.getZPath(drawing.sourcePortDirection === 'input' ? drawing.endPos : drawing.startPos, drawing.sourcePortDirection === 'input' ? drawing.startPos : drawing.endPos)} type={drawing.sourcePortType} isGhost cornerRadius={wireRadius} />}
    </svg>
  );
};

export default React.memo(WireLayer);