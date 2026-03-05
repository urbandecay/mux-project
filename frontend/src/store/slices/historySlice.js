export const createHistorySlice = (set, get) => ({
  past: [],
  future: [],

  pushSnapshot: () => {
    const state = get();
    const snapshot = {
      nodes: state.nodes,
      wires: state.wires,
      groups: state.groups
    };
    set({
      past: [...state.past.slice(-49), snapshot],
      future: []
    });
  },

  pushHistory: (snapshot) => {
    const state = get();
    set({
      past: [...state.past.slice(-49), snapshot],
      future: []
    });
  },

  undo: () => {
    const state = get();
    if (state.past.length === 0) return;
    const previous = state.past[state.past.length - 1];
    const current = { nodes: state.nodes, wires: state.wires, groups: state.groups };
    
    set({
      past: state.past.slice(0, -1),
      future: [current, ...state.future],
      nodes: previous.nodes,
      wires: previous.wires,
      groups: previous.groups
    });
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return;
    const next = state.future[0];
    const current = { nodes: state.nodes, wires: state.wires, groups: state.groups };

    set({
      past: [...state.past, current],
      future: state.future.slice(1),
      nodes: next.nodes,
      wires: next.wires,
      groups: next.groups
    });
  }
});