import { moduleRegistry } from './moduleRegistry';

export const getNodeWidth = (node) => {
    const mod = moduleRegistry[node.label];
    if (mod?.isAnchor) return 20;
    if (mod?.isPatchPoint2) return 5;
    if (node.label === 'MUX Modular') {
        // Approximate width based on port count (matches MuxNode logic)
        // We'd ideally want a more shared source for this, but for spatial indexing this is fine
        return 99; 
    }
    return mod?.width || 99;
};

export const isNodeInBounds = (node, rect) => {
    const w = getNodeWidth(node);
    const mod = moduleRegistry[node.label];
    const h = mod?.realHeight || 38;
    const { startX, currentX, startY, currentY } = rect;
    const x1 = Math.min(startX, currentX);
    const x2 = Math.max(startX, currentX);
    const y1 = Math.min(startY, currentY);
    const y2 = Math.max(startY, currentY);

    const isDraggingLeft = currentX < startX;

    if (isDraggingLeft) {
        // Touching: Node bounding box intersects with selection box
        return node.x <= x2 && node.x + w >= x1 &&
               node.y <= y2 && node.y + h >= y1;
    } else {
        // Fully Contained: Node bounding box is strictly inside selection box
        return node.x >= x1 && node.x + w <= x2 &&
               node.y >= y1 && node.y + h <= y2;
    }
};

export const getNodesInRect = (rect, nodes) => {
    return nodes.filter(node => isNodeInBounds(node, rect));
};

export const getWiresInRect = (rect, wires, getWirePath) => {
    const { startX, currentX, startY, currentY } = rect;
    const x1 = Math.min(startX, currentX);
    const x2 = Math.max(startX, currentX);
    const y1 = Math.min(startY, currentY);
    const y2 = Math.max(startY, currentY);

    const isDraggingLeft = currentX < startX;

    return wires.filter(w => {
        const path = getWirePath(w);
        if (!path || path.length === 0) return false;

        if (isDraggingLeft) {
            // Touching: Any segment of the wire intersects the box
            for (let i = 0; i < path.length - 1; i++) {
                const p1 = path[i];
                const p2 = path[i+1];
                
                // Segment bounding box
                const segX1 = Math.min(p1.x, p2.x);
                const segX2 = Math.max(p1.x, p2.x);
                const segY1 = Math.min(p1.y, p2.y);
                const segY2 = Math.max(p1.y, p2.y);

                if (segX1 <= x2 && segX2 >= x1 && segY1 <= y2 && segY2 >= y1) {
                    return true;
                }
            }
            return false;
        } else {
            // Fully Contained: Every point of the wire is inside the box
            return path.every(p => p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2);
        }
    });
};
