import { moduleRegistry } from './moduleRegistry';

export const snap = (val, isY = false) => {
  const spacing = isY ? 19 : 14;
  return Math.round(val / spacing) * spacing;
};

export const getHandles = (node) => {
  const module = moduleRegistry[node.label];
  if (!module) return [];

  if (module.isAnchor) {
    return [
      { id: 'anchor', x: node.x + 10, y: node.y + 10, type: 'universal', direction: 'universal' }
    ];
  }

  const h = 38;
  const realH = module.realHeight || 38;
  const hasInputs = module.inputs && module.inputs.length > 0;
  const hasOutputs = module.outputs && module.outputs.length > 0;

  // Calculate marginTop exactly like in MuxNode
  let marginTop = 0;
  if (realH < h) {
    const isSource = !hasInputs;
    const isSink = !hasOutputs;
    if (isSource) marginTop = h - realH;
    else if (!isSink) marginTop = (h - realH) / 2;
  }

  const handles = [];
  
  // Inputs (Top)
  (module.inputs || []).forEach((type, i) => {
    const offsetX = (module.inputOffsets && module.inputOffsets[i] !== undefined) 
      ? module.inputOffsets[i] 
      : (14 + i * 14);
    // Port is 5px from the top of the IMAGE
    handles.push({ id: `in-${i}`, x: node.x + offsetX, y: node.y + marginTop + 5, type, direction: 'input' });
  });

  // Outputs (Bottom)
  (module.outputs || []).forEach((type, i) => {
    const offsetX = (module.outputOffsets && module.outputOffsets[i] !== undefined) 
      ? module.outputOffsets[i] 
      : (14 + i * 14);
    // Port is 5px from the bottom of the IMAGE
    handles.push({ id: `out-${i}`, x: node.x + offsetX, y: node.y + marginTop + realH - 5, type, direction: 'output' });
  });

  return handles;
};

export const getZPath = (start, end, centerY = null, centerX = null, centerY2 = null) => {
  if (Math.abs(start.x - end.x) < 0.1) {
    return [
      { x: start.x, y: start.y },
      { x: end.x, y: end.y }
    ];
  }

  const dy = end.y - start.y;
  const targetY1 = (centerY !== null && centerY !== undefined) ? centerY : (start.y + dy / 2);
  const targetY2 = (centerY2 !== null && centerY2 !== undefined) ? centerY2 : targetY1;
  const y1 = Math.max(start.y + 19, targetY1);
  const y2 = Math.min(end.y - 19, targetY2);

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