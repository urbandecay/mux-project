import React, { useMemo } from 'react';
import useStore from '../store/useStore';

const COLORS = {
  audio: { bright: '#f30019', dimmed: '#7d181a' },
  modulation: { bright: '#48ff09', dimmed: '#187e1a' },
  event: { bright: '#3b74fd', dimmed: '#184b80' },
  universal: { bright: '#ffffff', dimmed: '#888888' }
};

const Wire = ({ points, type = 'audio', color = null, isGhost = false, isSelected = false, isDark = false, isHighlighted = false, cornerRadius = 0 }) => {
  const wireWidth = useStore(state => state.wireWidth);
  const colorKey = type?.toLowerCase() || 'audio';
  const colorSet = COLORS[colorKey] || COLORS.audio;
  const strokeColor = color || (isGhost ? colorSet.bright : (isDark ? colorSet.dimmed : colorSet.bright));
  const opacity = isGhost ? 0.6 : undefined;
  const cleanPoints = useMemo(() => {
    if (!points || points.length < 2) return [];
    const result = [points[0]];
    for (let i = 1; i < points.length; i++) {
      const prev = result[result.length - 1];
      const curr = points[i];
      if (Math.abs(curr.x - prev.x) > 0.1 || Math.abs(curr.y - prev.y) > 0.1) {
        result.push(curr);
      }
    }
    return result;
  }, [points]);

  if (cleanPoints.length < 2) return null;

  // Convert points to a path with rounded corners
  let d = `M ${cleanPoints[0].x} ${cleanPoints[0].y}`;
  
  if (cornerRadius > 0 && cleanPoints.length > 2) {
    for (let i = 1; i < cleanPoints.length - 1; i++) {
      const prev = cleanPoints[i - 1];
      const curr = cleanPoints[i];
      const next = cleanPoints[i + 1];

      // Calculate vectors
      const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
      const v2 = { x: next.x - curr.x, y: next.y - curr.y };
      
      const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
      const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
      
      // Avoid division by zero
      if (len1 < 0.1 || len2 < 0.1) {
        d += ` L ${curr.x} ${curr.y}`;
        continue;
      }

      // Skip rounding if it's a straight line (collinear)
      const isCollinear = Math.abs(v1.x * v2.y - v1.y * v2.x) < 0.1;
      if (isCollinear) {
        d += ` L ${curr.x} ${curr.y}`;
        continue;
      }

      // Limit radius to avoid overlap.
      // For the first and last segments (connected to modules), we allow the arc 
      // to start as close as 2px from the tip of the stub.
      const isFirstCorner = i === 1;
      const isLastCorner = i === cleanPoints.length - 2;
      
      const limit1 = isFirstCorner ? Math.max(0, len1 - 2) : len1 / 2;
      const limit2 = isLastCorner ? Math.max(0, len2 - 2) : len2 / 2;
      
      const r = Math.min(cornerRadius, limit1, limit2);

      // Start of curve (backing up from corner)
      const startX = curr.x - (v1.x / len1) * r;
      const startY = curr.y - (v1.y / len1) * r;
      
      // End of curve (moving forward from corner)
      const endX = curr.x + (v2.x / len2) * r;
      const endY = curr.y + (v2.y / len2) * r;

      d += ` L ${startX} ${startY} Q ${curr.x} ${curr.y} ${endX} ${endY}`;
    }
    d += ` L ${cleanPoints[cleanPoints.length - 1].x} ${cleanPoints[cleanPoints.length - 1].y}`;
  } else {
    // Simple polyline logic if radius is 0 or not enough points
    cleanPoints.forEach((p, i) => {
      if (i > 0) d += ` L ${p.x} ${p.y}`;
    });
  }

  return (
    <g className="mux-wire" data-highlighted={isHighlighted || isGhost} data-selected={isSelected} style={{ opacity }}>
      {/* Invisible thicker stroke for easier selection */}
      <path 
        d={d}
        fill="none" 
        stroke="transparent" 
        strokeWidth={wireWidth + 10} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Main Wire */}
      <path 
        d={d} 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth={wireWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ opacity }}
      />
    </g>
  );
};

const areEqual = (prevProps, nextProps) => {
  if (prevProps.points?.length !== nextProps.points?.length) return false;
  if (prevProps.points && nextProps.points) {
    for (let i = 0; i < prevProps.points.length; i++) {
      if (prevProps.points[i].x !== nextProps.points[i].x || prevProps.points[i].y !== nextProps.points[i].y) {
        return false;
      }
    }
  }
  return prevProps.type === nextProps.type &&
         prevProps.color === nextProps.color &&
         prevProps.isGhost === nextProps.isGhost &&
         prevProps.isSelected === nextProps.isSelected &&
         prevProps.isDark === nextProps.isDark &&
         prevProps.isHighlighted === nextProps.isHighlighted &&
         prevProps.cornerRadius === nextProps.cornerRadius;
};

export default React.memo(Wire, areEqual);
