import React, { useMemo } from 'react';

const COLORS = {
  audio: { bright: '#ff0000', dimmed: '#7d181a' },
  modulation: { bright: '#00ff00', dimmed: '#187d1a' },
  event: { bright: '#0080ff', dimmed: '#004080' },
  universal: { bright: '#ffffff', dimmed: '#888888' }
};

const WIRE_WIDTH = 4;

const Wire = ({ points, type = 'audio', isGhost = false, isSelected = false, isDimmed = false, cornerRadius = 0 }) => {
  const colorKey = type?.toLowerCase() || 'audio';
  const colorSet = COLORS[colorKey] || COLORS.audio;
  const strokeColor = isGhost ? colorSet.bright : (isDimmed ? colorSet.dimmed : colorSet.bright);
  const opacity = isGhost ? 0.6 : 1;
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
      
      // Avoid division by zero if points are still too close
      if (len1 < 0.1 || len2 < 0.1) {
        d += ` L ${curr.x} ${curr.y}`;
        continue;
      }

      // Limit radius to half the length of the shortest segment to avoid overlap
      const r = Math.min(cornerRadius, len1 / 2, len2 / 2);

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
    <g>
      {/* Invisible thicker stroke for easier selection */}
      <path 
        d={d}
        fill="none" 
        stroke="transparent" 
        strokeWidth={WIRE_WIDTH + 10} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Main Wire */}
      <path 
        d={d} 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth={WIRE_WIDTH} 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ opacity }}
      />
    </g>
  );
};

export default Wire;
