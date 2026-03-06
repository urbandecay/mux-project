import * as ConnectionManager from './ConnectionManager';
import * as SpatialManager from './SpatialManager';
import { moduleRegistry } from './moduleRegistry';

export const prepareDragState = (startX, startY, currentNodes, currentWires, activeNodeIds, activeWireIds, draggedSegmentIndex = null, getWirePath, editingGroupId = null, draggedWireId = null) => {
    const initialNodes = {};
    
    // 1. Capture Active Nodes (Explicitly selected)
    const seedNodes = currentNodes.filter(n => activeNodeIds.includes(n.id));
    seedNodes.forEach(n => {
      initialNodes[n.id] = { x: n.x, y: n.y };
    });

    // 2. Capture Group Members
    // If any node in a group is selected, we move the whole group.
    // CRITICAL: We SKIP this if we are currently EDITING that specific group.
    const activeGroupIds = new Set(seedNodes.map(n => n.groupId).filter(gid => gid && gid !== editingGroupId));
    const capturedWireIds = new Set(activeWireIds);

    if (activeGroupIds.size > 0) {
        currentNodes.forEach(n => {
            if (n.groupId && activeGroupIds.has(n.groupId)) {
                initialNodes[n.id] = { x: n.x, y: n.y };
            }
        });
        
        // Capture wires in groups
        currentWires.forEach(w => {
            if (w.groupId && activeGroupIds.has(w.groupId)) {
                capturedWireIds.add(w.id);
            }
        });
    }

    // 3. Capture Follower Nodes (Docked Notes)
    const allCapturedNodeIds = Object.keys(initialNodes);
    currentNodes.filter(n => allCapturedNodeIds.includes(n.id)).forEach(movedNode => {
      const movedWidth = SpatialManager.getNodeWidth(movedNode);
      
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
    });

    const initialWiresY = {};
    const initialWiresY2 = {};
    const initialWiresX = {};
    const initialWirePointCounts = {};

    currentWires.filter(w => capturedWireIds.has(w.id)).forEach(w => {
      const path = getWirePath(w);
      initialWirePointCounts[w.id] = path.length;
      
      // Capture centerY
      if (w.centerY !== undefined) {
        initialWiresY[w.id] = w.centerY;
      } else {
        if (path && path.length >= 4) initialWiresY[w.id] = path[1].y;
        else if (path && path.length >= 2) initialWiresY[w.id] = (path[0].y + path[path.length-1].y) / 2;
        else initialWiresY[w.id] = 0;
      }

      // Capture centerY2
      if (w.centerY2 !== undefined) {
        initialWiresY2[w.id] = w.centerY2;
      } else {
        if (path && path.length === 6) initialWiresY2[w.id] = path[3].y; // Segment 3 horizontal
        else initialWiresY2[w.id] = initialWiresY[w.id];
      }
      
      // Capture centerX
      if (w.centerX !== undefined) {
        initialWiresX[w.id] = w.centerX;
      } else {
        if (path && path.length === 6) initialWiresX[w.id] = path[2].x; // Segment 2 vertical
        else initialWiresX[w.id] = 0;
      }
    });

    return { 
      startX, startY, initialNodes, initialWiresY, initialWiresY2, initialWiresX, 
      initialWirePointCounts, draggedSegmentIndex, draggedWireId
    };
};

export const calculateNodeDrag = (dragState, dx, dy, nodes) => {
    if (!dragState || Object.keys(dragState.initialNodes).length === 0) return nodes;

    let hasChanges = false;
    const nextNodes = nodes.map(n => {
        const init = dragState.initialNodes[n.id];
        if (init) {
          const newX = ConnectionManager.snap(init.x + dx, false);
          const newY = ConnectionManager.snap(init.y + dy, true);
          if (n.x !== newX || n.y !== newY) {
              hasChanges = true;
              return { ...n, x: newX, y: newY };
          }
        }
        return n;
    });
    
    return hasChanges ? nextNodes : nodes;
};

export const calculateWireDrag = (dragState, dx, dy, wires, nextNodes) => {
    if (!dragState || !dragState.initialWiresY) return wires;

    // Check if we have any wire data to move
    const hasWireData = Object.keys(dragState.initialWiresY).length > 0;
    const hasNodeMovement = Object.keys(dragState.initialNodes).length > 0;

    if (!hasWireData && !hasNodeMovement) return wires;

    const nodeMap = new Map(nextNodes.map(n => [n.id, n]));
    
    let hasChanges = false;
    const nextWires = wires.map(w => {
        const initY = dragState.initialWiresY[w.id];
        const initY2 = dragState.initialWiresY2[w.id];
        const initX = dragState.initialWiresX[w.id];
        
        if (initY === undefined && !hasNodeMovement) return w;

        let updated = { ...w };
        let wireChanged = false;
        
        // CASE A: Dragging a specific wire segment
        // If this wire is the one being dragged OR if it's part of the captured group and we are dragging a segment
        const isDraggedWire = dragState.draggedWireId === w.id;
        const isCapturedWire = dragState.initialWiresY[w.id] !== undefined;
        const hasDraggedSegment = dragState.draggedSegmentIndex !== null && dragState.draggedSegmentIndex !== undefined;

        if ((isDraggedWire || (isCapturedWire && hasDraggedSegment)) && initY !== undefined) {
          const pointCount = dragState.initialWirePointCounts[w.id];
          
          // Get port positions for clamping
          const source = nodeMap.get(w.sourceId);
          const target = nodeMap.get(w.targetId);
          let h1 = null, h2 = null;
          if (source && target) {
            h1 = ConnectionManager.getHandles(source, nextNodes, wires).find(h => h.id === w.sourcePortId);
            h2 = ConnectionManager.getHandles(target, nextNodes, wires).find(h => h.id === w.targetPortId);
          }
        
          if (pointCount === 4) {
              // Z-connection: Only one horizontal segment (index 1)
              // If we are dragging ANY horizontal segment of the group (1 or 3), we move this one
              if (dragState.draggedSegmentIndex === 1 || dragState.draggedSegmentIndex === 3) {
                  let newY = ConnectionManager.snap(initY + dy, true);
                  if (h1 && h2) {
                    const minY = h1.y + 11;
                    const maxY = h2.y - 11;
                    newY = Math.max(minY, Math.min(maxY, newY));
                  }
                  if (updated.centerY !== newY || updated.centerY2 !== undefined || updated.centerX !== undefined) {
                      updated.centerY = newY;
                      updated.centerY2 = undefined;
                      updated.centerX = undefined;
                      wireChanged = true;
                  }
              }
          } else if (pointCount === 6) {
              // S-connection: Two horizontal segments (1, 3) and one vertical (2)
              if (dragState.draggedSegmentIndex === 1) {
                let newY = ConnectionManager.snap(initY + dy, true);
                if (h1) newY = Math.max(h1.y + 11, newY);
                if (updated.centerY !== newY || updated.centerY2 !== initY2 || updated.centerX !== initX) {
                    updated.centerY = newY;
                    if (updated.centerY2 === undefined) updated.centerY2 = initY2;
                    if (updated.centerX === undefined) updated.centerX = initX;
                    wireChanged = true;
                }
              } else if (dragState.draggedSegmentIndex === 3) {
                let newY = ConnectionManager.snap(initY2 + dy, true);
                if (h2) newY = Math.min(h2.y - 11, newY);
                if (updated.centerY2 !== newY || updated.centerY !== initY || updated.centerX !== initX) {
                    updated.centerY2 = newY;
                    if (updated.centerY === undefined) updated.centerY = initY;
                    if (updated.centerX === undefined) updated.centerX = initX;
                    wireChanged = true;
                }
              } else if (dragState.draggedSegmentIndex === 2) {
                let newX = ConnectionManager.snap(initX + dx, false);
                if (updated.centerX !== newX || updated.centerY !== initY || updated.centerY2 !== initY2) {
                    updated.centerX = newX;
                    if (updated.centerY === undefined) updated.centerY = initY;
                    if (updated.centerY2 === undefined) updated.centerY2 = initY2;
                    wireChanged = true;
                }
              }
          }
        } 
        // CASE B: Moving a group or pushing via nodes (no segment drag context)
        else {
          // 1. Move explicitly selected wire properties
          if (initY !== undefined) {
            let newY = ConnectionManager.snap(initY + dy, true);
            if (updated.centerY !== newY) { updated.centerY = newY; wireChanged = true; }
          }
          if (initY2 !== undefined) {
            let newY2 = ConnectionManager.snap(initY2 + dy, true);
            if (updated.centerY2 !== newY2) { updated.centerY2 = newY2; wireChanged = true; }
          }
          if (initX !== undefined) {
            let newX = ConnectionManager.snap(initX + dx, false);
            if (updated.centerX !== newX) { updated.centerX = newX; wireChanged = true; }
          }

          // 2. Clamping / "Push but not Pull" Logic
          const source = nodeMap.get(w.sourceId);
          const target = nodeMap.get(w.targetId);
          if (source && target) {
            const h1 = ConnectionManager.getHandles(source, nextNodes, wires).find(h => h.id === w.sourcePortId);
            const h2 = ConnectionManager.getHandles(target, nextNodes, wires).find(h => h.id === w.targetPortId);
            
            if (h1 && h2) {
                // If handles are far enough apart for 3-segment logic (Z-connection)
                if (h1.y + 19 <= h2.y - 19) {
                  // Push but not Pull for Z-connection
                  let currentY = updated.centerY !== undefined ? updated.centerY : (h1.y + h2.y) / 2;
                  
                  // Push from Top Stub
                  if (h1.y + 19 > currentY) {
                      currentY = ConnectionManager.snap(h1.y + 19, true);
                  }
                  // Push from Bottom Stub
                  if (h2.y - 19 < currentY) {
                      currentY = ConnectionManager.snap(h2.y - 19, true);
                  }

                  if (updated.centerY !== currentY || updated.centerY2 !== undefined || updated.centerX !== undefined) {
                      updated.centerY = currentY;
                      // We definitely don't want centerY2/centerX for a Z
                      updated.centerY2 = undefined;
                      updated.centerX = undefined;
                      wireChanged = true;
                  }
                } else {
                  // Push but not pull logic for S-connections (6-point)
                  const currentY1 = updated.centerY !== undefined ? updated.centerY : (h1.y + h2.y) / 2;
                  const minAllowedY1 = h1.y + 19;
                  if (minAllowedY1 > currentY1) {
                    let newY = ConnectionManager.snap(minAllowedY1, true);
                    if (updated.centerY !== newY) { updated.centerY = newY; wireChanged = true; }
                  }

                  const currentY2 = updated.centerY2 !== undefined ? updated.centerY2 : (updated.centerY !== undefined ? updated.centerY : (h1.y + h2.y) / 2);
                  const maxAllowedY2 = h2.y - 19;
                  if (maxAllowedY2 < currentY2) {
                    if (updated.centerY2 === undefined) {
                        updated.centerY2 = updated.centerY !== undefined ? updated.centerY : ConnectionManager.snap((h1.y + h2.y) / 2, true);
                        wireChanged = true;
                    }
                    let newY2 = ConnectionManager.snap(maxAllowedY2, true);
                    if (updated.centerY2 !== newY2) { updated.centerY2 = newY2; wireChanged = true; }
                  }
                }
            }
          }
        }

        if (wireChanged) {
            hasChanges = true;
            return updated;
        }
        return w;
    });

    return hasChanges ? nextWires : wires;
};
