import { moduleRegistry } from './moduleRegistry';

export const getNodesInRect = (rect, nodes) => {
  // Ensure x1 is min, x2 is max, etc.
  const x1 = Math.min(rect.startX, rect.currentX);
  const y1 = Math.min(rect.startY, rect.currentY);
  const x2 = Math.max(rect.startX, rect.currentX);
  const y2 = Math.max(rect.startY, rect.currentY);

  return nodes.filter(node => {
    const module = moduleRegistry[node.label];
    if (!module && !module?.isAnchor) return false;
    const w = module?.isAnchor ? 20 : (module?.width || 99);
    const h = 38; // Grid height is always 38
    
    // Check overlapping rectangles
    return node.x < x2 && node.x + w > x1 && node.y < y2 && node.y + h > y1;
  });
};

export const isNodeInBounds = (node, bounds) => {
    const module = moduleRegistry[node.label];
    if (!module && !module?.isAnchor) return false;
    const w = module?.isAnchor ? 20 : (module?.width || 99);
    const h = 38;
    
    return node.x >= bounds.x && 
           node.x + w <= bounds.x + bounds.width && 
           node.y >= bounds.y && 
           node.y + h <= bounds.y + bounds.height;
};

export const getNodesInFrame = (frame, nodes) => {
    return nodes.filter(node => isNodeInBounds(node, frame));
};

export const getWiresInFrame = (frame, wires, getWirePath) => {
    return wires.filter(w => {
        const points = getWirePath(w);
        if (!points || points.length === 0) return false;
        // A wire is "in" a frame if all its points are inside the frame bounds
        return points.every(p => 
            p.x >= frame.x && p.x <= frame.x + frame.width &&
            p.y >= frame.y && p.y <= frame.y + frame.height
        );
    });
};

export const isPointInFrame = (x, y, frame) => {
    return x >= frame.x && x <= frame.x + frame.width && 
           y >= frame.y && y <= frame.y + frame.height;
};

export const getWiresInRect = (rect, wires, getWirePath) => {
  const x1 = Math.min(rect.startX, rect.currentX);
  const y1 = Math.min(rect.startY, rect.currentY);
  const x2 = Math.max(rect.startX, rect.currentX);
  const y2 = Math.max(rect.startY, rect.currentY);

  return wires.filter(w => {
    const points = getWirePath(w);
    if (!points || points.length < 2) return false;
    
    // Check if any segment is within the box
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i+1];
      const wx1 = Math.min(p1.x, p2.x);
      const wx2 = Math.max(p1.x, p2.x);
      const wy1 = Math.min(p1.y, p2.y);
      const wy2 = Math.max(p1.y, p2.y);
      
      if (wx1 < x2 && wx2 > x1 && wy1 < y2 && wy2 > y1) return true;
    }
    return false;
  });
};

export const isPointInNode = (x, y, node) => {
    const module = moduleRegistry[node.label];
    if (!module) return false;
    const w = module.isAnchor ? 20 : (module.width || 99);
    const h = 38; 
    return x >= node.x && x <= node.x + w && y >= node.y && y <= node.y + h;
};
