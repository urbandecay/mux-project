import * as ConnectionManager from './ConnectionManager';
import { moduleRegistry } from './moduleRegistry';

export const prepareDragState = (startX, startY, currentNodes, currentWires, activeNodeIds, activeWireIds, draggedSegmentIndex = null, getWirePath, currentFrames = [], activeFrameIds = []) => {
    const initialNodes = {};
    const initialFrames = {};
    
    // 1. Capture Active Frames
    currentFrames.filter(f => activeFrameIds.includes(f.id)).forEach(f => {
      initialFrames[f.id] = { x: f.x, y: f.y };
    });

    // 2. Capture Active Nodes (Explicitly selected)
    currentNodes.filter(n => activeNodeIds.includes(n.id)).forEach(n => {
      initialNodes[n.id] = { x: n.x, y: n.y };
    });

    // 3. Capture Nodes inside Active Frames (Willy-nilly grouping)
    currentFrames.filter(f => activeFrameIds.includes(f.id)).forEach(frame => {
      currentNodes.forEach(node => {
        // If node is already in initialNodes, skip
        if (initialNodes[node.id]) return;

        const module = moduleRegistry[node.label];
        if (!module) return;
        const w = module.isAnchor ? 20 : (module.width || 99);
        const h = 38;

        // Check if node is inside frame bounds
        if (node.x >= frame.x && node.x + w <= frame.x + frame.width &&
            node.y >= frame.y && node.y + h <= frame.y + frame.height) {
          initialNodes[node.id] = { x: node.x, y: node.y };
        }
      });
    });

    // 4. Capture Follower Nodes (Docked Notes)
    const allCapturedNodeIds = Object.keys(initialNodes);
    currentNodes.filter(n => allCapturedNodeIds.includes(n.id)).forEach(movedNode => {
      const movedModule = moduleRegistry[movedNode.label];
      if (movedModule && !movedModule.isNote) {
        const movedWidth = movedModule.isAnchor ? 20 : (movedModule.width || 99);
        
        currentNodes.forEach(otherNode => {
          const otherModule = moduleRegistry[otherNode.label];
          if (otherModule && otherModule.isNote && !allCapturedNodeIds.includes(otherNode.id)) {
            const yMatch = Math.abs(otherNode.y - movedNode.y) < 10;
            const xMatch = Math.abs(otherNode.x - (movedNode.x + movedWidth)) < 18 || 
                           Math.abs(otherNode.x - (movedNode.x - 38)) < 18;
            
            if (yMatch && xMatch) {
              initialNodes[otherNode.id] = { x: otherNode.x, y: otherNode.y };
            }
          }
        });
      }
    });

    const initialWiresY = {};
    const initialWiresY2 = {};
    const initialWiresX = {};
    const initialWirePointCounts = {};

    currentWires.filter(w => activeWireIds.includes(w.id)).forEach(w => {
      const path = getWirePath(w);
      initialWirePointCounts[w.id] = path.length;
      
      if (w.centerY !== undefined) {
        initialWiresY[w.id] = w.centerY;
      } else {
        if (path && path.length >= 4) initialWiresY[w.id] = path[1].y;
        else if (path && path.length >= 2) initialWiresY[w.id] = (path[0].y + path[path.length-1].y) / 2;
      }

      if (w.centerY2 !== undefined) {
        initialWiresY2[w.id] = w.centerY2;
      } else {
        if (path && path.length === 6) initialWiresY2[w.id] = path[4].y;
        else initialWiresY2[w.id] = initialWiresY[w.id];
      }
      
      if (w.centerX !== undefined) {
        initialWiresX[w.id] = w.centerX;
      } else {
        if (path && path.length === 6) {
          initialWiresX[w.id] = path[2].x;
        } else if (path && path.length >= 2) {
          initialWiresX[w.id] = (path[0].x + path[path.length-1].x) / 2;
        }
      }
    });

    return { 
      startX, startY, initialNodes, initialFrames, initialWiresY, initialWiresY2, initialWiresX, 
      initialWirePointCounts, draggedSegmentIndex 
    };
};

export const calculateNodeDrag = (dragState, dx, dy, nodes) => {
    if (!dragState || Object.keys(dragState.initialNodes).length === 0) return nodes;

    return nodes.map(n => {
        const init = dragState.initialNodes[n.id];
        if (init) {
          // Frames use 19/14 grid, same as nodes
          return { ...n, x: ConnectionManager.snap(init.x + dx, false), y: ConnectionManager.snap(init.y + dy, true) };
        }
        return n;
    });
};

export const calculateFrameDrag = (dragState, dx, dy, frames) => {
    if (!dragState || !dragState.initialFrames || Object.keys(dragState.initialFrames).length === 0) return frames;

    return frames.map(f => {
        const init = dragState.initialFrames[f.id];
        if (init) {
            return { ...f, x: ConnectionManager.snap(init.x + dx, false), y: ConnectionManager.snap(init.y + dy, true) };
        }
        return f;
    });
};

export const calculateWireDrag = (dragState, dx, dy, wires, nextNodes) => {
    if (!dragState || !dragState.initialWiresY) return wires;

    // Check if we have any wire data to move
    const hasWireData = Object.keys(dragState.initialWiresY).length > 0 || 
                        Object.keys(dragState.initialWiresX).length > 0;
    
    // Also need to update wires if nodes moved (Push logic)
    const hasNodeMovement = Object.keys(dragState.initialNodes).length > 0;

    if (!hasWireData && !hasNodeMovement) return wires;

    return wires.map(w => {
        const initY = dragState.initialWiresY[w.id];
        const initY2 = dragState.initialWiresY2[w.id];
        const initX = dragState.initialWiresX[w.id];
        let updated = { ...w };
        
        // CASE A: Dragging a specific wire segment (manually)
        if (dragState.draggedSegmentIndex !== null && dragState.draggedSegmentIndex !== undefined) {
          // This only applies if THIS wire is the one being dragged (checking existence in initialWiresY implies selection)
          if (initY !== undefined) { 
             const pointCount = dragState.initialWirePointCounts[w.id];
          
            if (pointCount === 4) {
                const newY = ConnectionManager.snap(initY + dy, true);
                updated.centerY = newY;
                updated.centerY2 = undefined; 
            } else if (pointCount === 6) {
                if (dragState.draggedSegmentIndex === 1) {
                updated.centerY = ConnectionManager.snap(initY + dy, true);
                } else if (dragState.draggedSegmentIndex === 3) {
                updated.centerY2 = ConnectionManager.snap(initY2 + dy, true);
                } else if (dragState.draggedSegmentIndex === 2) {
                updated.centerX = ConnectionManager.snap(initX + dx, false);
                }
            }
          }
        } 
        // CASE B: Moving a group (Nodes + Wires)
        else {
          // 1. Move explicitly selected wire properties
          if (initY !== undefined) {
            updated.centerY = ConnectionManager.snap(initY + dy, true);
          }
          if (initY2 !== undefined) {
            updated.centerY2 = ConnectionManager.snap(initY2 + dy, true);
          }
          if (initX !== undefined) {
            updated.centerX = ConnectionManager.snap(initX + dx, false);
          }

          // 2. "Push but not Pull" Logic: Apply if nodes are moving
          if (hasNodeMovement) {
            const source = nextNodes.find(n => n.id === w.sourceId);
            const target = nextNodes.find(n => n.id === w.targetId);
            if (source && target) {
              const h1 = ConnectionManager.getHandles(source).find(h => h.id === w.sourcePortId);
              const h2 = ConnectionManager.getHandles(target).find(h => h.id === w.targetPortId);
              
              if (h1 && h2) {
                  // KINK ERASURE: If handles are far enough apart for 3-segment logic, 
                  // erase the stored offsets so it starts fresh next time it kinks.
                  if (h1.y + 19 <= h2.y - 19) {
                    updated.centerY = undefined;
                    updated.centerY2 = undefined;
                    updated.centerX = undefined;
                  } else {
                    // Push but not pull logic
                    const currentY1 = updated.centerY !== undefined ? updated.centerY : (h1.y + h2.y) / 2;
                    const minAllowedY1 = h1.y + 19;
                    if (minAllowedY1 > currentY1) {
                      updated.centerY = ConnectionManager.snap(minAllowedY1, true);
                    }

                    const currentY2 = updated.centerY2 !== undefined ? updated.centerY2 : (updated.centerY !== undefined ? updated.centerY : (h1.y + h2.y) / 2);
                    const maxAllowedY2 = h2.y - 19;
                    if (maxAllowedY2 < currentY2) {
                      if (updated.centerY2 === undefined) updated.centerY2 = updated.centerY !== undefined ? updated.centerY : ConnectionManager.snap((h1.y + h2.y) / 2, true);
                      updated.centerY2 = ConnectionManager.snap(maxAllowedY2, true);
                    }
                  }
              }
            }
          }
        }

        return updated;
    });
};
