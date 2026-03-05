import { moduleRegistry } from './moduleRegistry';

export const snap = (val, isY = false) => {
  const spacing = isY ? 19 : 14;
  return Math.round(val / spacing) * spacing;
};

const EMPTY_ARRAY = [];

export const getDynamicIO = (node, allNodes = []) => {
  const module = moduleRegistry[node.label];
  if (node.label !== 'MUX Modular') {
    return { inputs: module?.inputs || EMPTY_ARRAY, outputs: module?.outputs || EMPTY_ARRAY };
  }

  const inputs = [];
  const outputs = [];

  // Find children in the flat list
  const childNodes = allNodes.filter(n => n.parentId === node.id);

  childNodes.forEach(n => {
    // Inside Input Node = Outside Input Port
    if (n.label === 'Audio Input') inputs.push('audio');
    if (n.label === 'Event Input') inputs.push('event');
    if (n.label === 'Modulation Input') inputs.push('modulation');
    
    // Inside Output Node = Outside Output Port
    if (n.label === 'Audio Output') outputs.push('audio');
    if (n.label === 'Event Output') outputs.push('event');
    if (n.label === 'Modulation Output') outputs.push('modulation');
  });

  return { inputs, outputs };
};

export const getHandlesFromIO = (node, inputs, outputs, allWires = []) => {
  const module = moduleRegistry[node.label];
  if (!module) return [];

  if (module.isAnchor) {
    return [
      { id: 'anchor', x: node.x + 10, y: node.y + 10, type: 'universal', direction: 'universal' }
    ];
  }

  if (module.isPatchPoint2) {
    // Determine type based on existing connections
    let portType = 'universal';
    const connectedWires = allWires.filter(w => w.sourceId === node.id || w.targetId === node.id);
    if (connectedWires.length > 0) {
      portType = connectedWires[0].type || 'universal';
    }
    // Snap to the center of the grid increment (offset by 10.5 horizontally to match ports)
    return [
      { id: 'pp2-in', x: node.x + 10.5, y: node.y, type: portType, direction: 'input' },
      { id: 'pp2-out', x: node.x + 10.5, y: node.y, type: portType, direction: 'output' }
    ];
  }

  // Notes don't have ports
  if (module.isNote) return [];

  const offset = 10.5;

  // All standard modules are now procedural with height 38
  const h = 38;
  const handles = [];
  
  // Inputs (Top Row)
  (inputs || []).forEach((type, i) => {
    // tip of the stub is at y=0 relative to module
    handles.push({ 
      id: `in-${i}`, 
      x: node.x + offset + i * 14, 
      y: node.y, 
      type, 
      direction: 'input' 
    });
  });

  // Outputs (Bottom Row)
  (outputs || []).forEach((type, i) => {
    // tip of the stub is at y=38 relative to module
    handles.push({ 
      id: `out-${i}`, 
      x: node.x + offset + i * 14, 
      y: node.y + 38, 
      type, 
      direction: 'output' 
    });
  });

  return handles;
};

export const getHandles = (node, allNodes = [], allWires = []) => {
  const { inputs, outputs } = getDynamicIO(node, allNodes);
  return getHandlesFromIO(node, inputs, outputs, allWires);
};

export const getZPath = (start, end, centerY = null, centerX = null, centerY2 = null) => {
  if (Math.abs(start.x - end.x) < 0.1) {
    return [
      { x: start.x, y: start.y },
      { x: end.x, y: end.y }
    ];
  }

  const dy = end.y - start.y;
  let targetY1 = (centerY !== null && centerY !== undefined) ? centerY : (start.y + dy / 2);
  let targetY2 = (centerY2 !== null && centerY2 !== undefined) ? centerY2 : targetY1;

  // If we want a Z-connection (no centerY2) and it's physically possible, 
  // we force it to stay a Z by clamping.
  if ((centerY2 === null || centerY2 === undefined) && (start.y + 11 <= end.y - 11)) {
    targetY1 = Math.max(start.y + 11, Math.min(end.y - 11, targetY1));
    targetY2 = targetY1;
  }

  const y1 = Math.max(start.y + 11, targetY1);
  const y2 = Math.min(end.y - 11, targetY2);

  if (y1 === y2 && targetY1 === targetY2) {
    return [
      { x: start.x, y: start.y },
      { x: start.x, y: y1 },
      { x: end.x, y: y1 },
      { x: end.x, y: end.y }
    ];
  }

  const midX = (centerX !== null && centerX !== undefined) ? centerX : (start.x + end.x) / 2;

  return [
    { x: start.x, y: start.y },
    { x: start.x, y: y1 },
    { x: midX, y: y1 },
    { x: midX, y: y2 },
    { x: end.x, y: y2 },
    { x: end.x, y: end.y }
  ];
};

export const hitTestWires = (x, y, wires, threshold = 10) => {
  for (const wire of wires) {
    if (!wire.points) continue;
    for (let i = 0; i < wire.points.length - 1; i++) {
      const p1 = wire.points[i];
      const p2 = wire.points[i+1];
      const dist = distToSegment({ x, y }, p1, p2);
      if (dist < threshold) return wire.id;
    }
  }
  return null;
};

export const hitTestSegments = (x, y, wires, threshold = 10) => {
  for (const wire of wires) {
    if (!wire.points) continue;
    for (let i = 0; i < wire.points.length - 1; i++) {
      const p1 = wire.points[i];
      const p2 = wire.points[i+1];
      const dist = distToSegment({ x, y }, p1, p2);
      if (dist < threshold) {
        const isVertical = Math.abs(p1.x - p2.x) < 1;
        return { id: wire.id, segmentIndex: i, isVertical, wire };
      }
    }
  }
  return null;
};

export const hitTestWireHorizontal = (x, y, wires, threshold = 10) => {
  for (const wire of wires) {
    if (!wire.points || wire.points.length < 2) continue;
    for (let i = 0; i < wire.points.length - 1; i++) {
      const p1 = wire.points[i];
      const p2 = wire.points[i+1];
      if (Math.abs(p1.y - p2.y) < 1) {
        const minX = Math.min(p1.x, p2.x) - threshold;
        const maxX = Math.max(p1.x, p2.x) + threshold;
        if (x < minX || x > maxX) continue;
        const dist = distToSegment({ x, y }, p1, p2);
        if (dist < threshold) return { id: wire.id, segmentIndex: i };
      }
    }
  }
  return null;
};

export const hitTestWireVertical = (x, y, wires, threshold = 10) => {
  for (const wire of wires) {
    if (!wire.points || wire.points.length !== 6) continue;
    const p1 = wire.points[2];
    const p2 = wire.points[3];
    if (Math.abs(p1.x - p2.x) < 1) {
      const minY = Math.min(p1.y, p2.y) - threshold;
      const maxY = Math.max(p1.y, p2.y) + threshold;
      if (y < minY || y > maxY) continue;
      const dist = distToSegment({ x, y }, p1, p2);
      if (dist < threshold) return { id: wire.id, segmentIndex: 2 };
    }
  }
  return null;
};

function distToSegment(p, v, w) {
  const l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
  if (l2 === 0) return Math.sqrt(Math.pow(p.x - v.x, 2) + Math.pow(p.y - v.y, 2));
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.sqrt(Math.pow(p.x - (v.x + t * (w.x - v.x)), 2) + Math.pow(p.y - (v.y + t * (w.y - v.y)), 2));
}