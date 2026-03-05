import * as ConnectionManager from '../../utils/ConnectionManager';
import { generateDisplayName, updateInitialNodeNameIfNecessary } from '../../utils/namingUtils';

export const createGraphSlice = (set, get) => ({
  nodes: [], // Will be initialized by root
  wires: [], // Will be initialized by root
  groups: [],
  activeModules: {},
  
  setNodes: (nodes) => set({ nodes: typeof nodes === 'function' ? nodes(get().nodes) : nodes }),
  setWires: (wires) => set({ wires: typeof wires === 'function' ? wires(get().wires) : wires }),
  setGroups: (groups) => set({ groups: typeof groups === 'function' ? groups(get().groups) : groups }),

  toggleModuleActive: (id) => set(state => {
      const currentState = state.activeModules[id] !== false;
      return { activeModules: { ...state.activeModules, [id]: !currentState } };
  }),
  setAllModulesActive: (isActive) => set(state => {
      const updates = {};
      state.nodes.forEach(n => updates[n.id] = isActive);
      return { activeModules: updates };
  }),

  addNewNode: (label, x, y) => {
    get().pushSnapshot();
    const state = get();
    const currentParentId = state.parentId;

    const snappedX = ConnectionManager.snap(x, false);
    const snappedY = ConnectionManager.snap(y, true);

    const updatedNodes = updateInitialNodeNameIfNecessary(state.nodes, currentParentId, label);
    if (updatedNodes !== state.nodes) {
        set({ nodes: updatedNodes });
    }

    const newDisplayName = generateDisplayName(updatedNodes, currentParentId, label);

    const newNodeId = `${label}-${Date.now()}`;
    const newNode = { 
        id: newNodeId, 
        label, 
        x: snappedX, 
        y: snappedY, 
        displayName: newDisplayName,
        parentId: currentParentId,
        groupId: state.editingGroupId || undefined
    };

    let newChildren = [];
    let newWires = [];

    if (label === 'MUX Modular') {
       const inAId = `Audio Input-${Date.now()}-1`;
       const outAId = `Audio Output-${Date.now()}-2`;
       const inEId = `Event Input-${Date.now()}-3`;
       const outEId = `Event Output-${Date.now()}-4`;
       
       newChildren = [
           { id: inAId, label: 'Audio Input', x: 56, y: 57, displayName: 'Audio Input', parentId: newNodeId }, 
           { id: outAId, label: 'Audio Output', x: 56, y: 247, displayName: 'Audio Output', parentId: newNodeId }, 
           { id: inEId, label: 'Event Input', x: 252, y: 57, displayName: 'Event Input', parentId: newNodeId }, 
           { id: outEId, label: 'Event Output', x: 252, y: 247, displayName: 'Event Output', parentId: newNodeId }
       ];
       newWires = [
           { id: `wire-init-a-${Date.now()}`, sourceId: inAId, sourcePortId: 'out-0', targetId: outAId, targetPortId: 'in-0', type: 'audio', parentId: newNodeId },
           { id: `wire-init-e-${Date.now()}`, sourceId: inEId, sourcePortId: 'out-0', targetId: outEId, targetPortId: 'in-0', type: 'event', parentId: newNodeId }
       ];
    }
    
    set((s) => ({
      nodes: [...s.nodes, newNode, ...newChildren],
      wires: [...s.wires, ...newWires]
    }));
  },

  deleteNode: (id) => {
    get().pushSnapshot();
    
    const collectChildren = (nodeIds, allNodes) => {
        let children = [];
        nodeIds.forEach(pId => {
            const kids = allNodes.filter(n => n.parentId === pId).map(n => n.id);
            children = [...children, ...kids, ...collectChildren(kids, allNodes)];
        });
        return children;
    };

    set((state) => {
      const allIdsToDelete = [id, ...collectChildren([id], state.nodes)];
      const newNodes = state.nodes.filter(n => !allIdsToDelete.includes(n.id));
      const activeGroupIds = new Set(newNodes.map(n => n.groupId).filter(Boolean));
      const newGroups = state.groups.filter(g => activeGroupIds.has(g.id));

      return {
        nodes: newNodes,
        wires: state.wires.filter(w => !allIdsToDelete.includes(w.sourceId) && !allIdsToDelete.includes(w.targetId) && !allIdsToDelete.includes(w.parentId)),
        groups: newGroups,
        selectedNodeIds: state.selectedNodeIds.filter(nid => !allIdsToDelete.includes(nid)),
        editingGroupId: (state.editingGroupId && !activeGroupIds.has(state.editingGroupId)) ? null : state.editingGroupId
      };
    });
  },

  deleteWire: (id) => {
    get().pushSnapshot();
    set((state) => ({
      wires: state.wires.filter(w => w.id !== id),
      selectedWireIds: state.selectedWireIds.filter(wid => wid !== id)
    }));
  },

  renameNode: (id, newDisplayName) => {
    get().pushSnapshot();
    set((state) => ({
      nodes: state.nodes.map(n => n.id === id ? { ...n, displayName: newDisplayName } : n)
    }));
  },

  updateNodeText: (id, newText, extraData = {}) => {
    get().pushSnapshot();
    set((state) => ({
      nodes: state.nodes.map(n => n.id === id ? { ...n, text: newText, ...extraData } : n)
    }));
  },

  setNodeColor: (id, color) => {
    get().pushSnapshot();
    const state = get();
    const node = state.nodes.find(n => n.id === id);
    if (!node) return;

    if (node.groupId) {
        set((state) => ({
            nodes: state.nodes.map(n => n.groupId === node.groupId ? { ...n, color } : n),
            wires: state.wires.map(w => w.groupId === node.groupId ? { ...w, color } : w)
        }));
    } else {
        set((state) => ({
            nodes: state.nodes.map(n => n.id === id ? { ...n, color } : n)
        }));
    }
  },

  replaceNode: (oldNodeId, newLabel) => {
    const state = get();
    const oldNode = state.nodes.find(n => n.id === oldNodeId);
    if (!oldNode) return;

    state.pushSnapshot();
    
    const updatedNodes = updateInitialNodeNameIfNecessary(state.nodes, oldNode.parentId, newLabel);
    const newDisplayName = generateDisplayName(updatedNodes, oldNode.parentId, newLabel);

    const newNode = {
      id: `${newLabel}-${Date.now()}`,
      label: newLabel,
      x: oldNode.x,
      y: oldNode.y,
      displayName: newDisplayName,
      text: oldNode.text,
      parentId: oldNode.parentId,
      groupId: oldNode.groupId,
      color: oldNode.color
    };

    const newWires = state.wires.map(w => {
      if (w.sourceId !== oldNodeId && w.targetId !== oldNodeId) return w;

      const isSource = w.sourceId === oldNodeId;
      const oldPortId = isSource ? w.sourcePortId : w.targetPortId;
      const oldPortIndex = parseInt(oldPortId.split('-')[1]);
      
      const { inputs: oldIn, outputs: oldOut } = ConnectionManager.getDynamicIO(oldNode, state.nodes);
      const oldPorts = isSource ? oldOut : oldIn;
      const portType = oldPorts[oldPortIndex];

      const { inputs: newIn, outputs: newOut } = ConnectionManager.getDynamicIO(newNode, state.nodes);
      const newPorts = isSource ? newOut : newIn;
      const newPortIndex = (newPorts || []).findIndex(t => t === portType);

      if (newPortIndex !== -1) {
        return {
          ...w,
          [isSource ? 'sourceId' : 'targetId']: newNode.id,
          [isSource ? 'sourcePortId' : 'targetPortId']: `${isSource ? 'out' : 'in'}-${newPortIndex}`
        };
      }
      return null;
    }).filter(Boolean);

    set({
      nodes: state.nodes.map(n => n.id === oldNodeId ? newNode : n),
      wires: newWires,
      replacingNodeId: null
    });
  },
  
  createGroup: (nodeIds, name) => {
    if (!nodeIds || nodeIds.length === 0) return;
    get().pushSnapshot();
    const state = get();
    const groupId = `group-${Date.now()}`;
    const groupName = name || `Group ${state.groups.length + 1}`;
    
    const newGroup = { id: groupId, name: groupName, parentId: state.parentId };

    set((s) => ({
        groups: [...s.groups, newGroup],
        nodes: s.nodes.map(n => nodeIds.includes(n.id) ? { ...n, groupId } : n),
        wires: s.wires.map(w => (nodeIds.includes(w.sourceId) && nodeIds.includes(w.targetId)) ? { ...w, groupId } : w)
    }));
  },

  ungroup: (groupId) => {
    get().pushSnapshot();
    set((state) => ({
        groups: state.groups.filter(g => g.id !== groupId),
        nodes: state.nodes.map(n => n.groupId === groupId ? { ...n, groupId: undefined } : n),
        wires: state.wires.map(w => w.groupId === groupId ? { ...w, groupId: undefined } : w)
    }));
  },

  renameGroup: (groupId, name) => {
    get().pushSnapshot();
    set((state) => ({
        groups: state.groups.map(g => g.id === groupId ? { ...g, name } : g)
    }));
  },

  updateNode: (id, data) => set((state) => ({
    nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...data } : n)),
  })),

  updateGraph: ({ nodes, wires, groups }) => set((state) => ({
    nodes: nodes || state.nodes,
    wires: wires || state.wires,
    groups: groups || state.groups
  })),
  
  addNodeRaw: (node) => set((state) => ({ nodes: [...state.nodes, node] }))
});