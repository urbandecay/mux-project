import { create } from 'zustand';
import { createGraphSlice } from './slices/graphSlice';
import { createUISlice } from './slices/uiSlice';
import { createHistorySlice } from './slices/historySlice';
import { createPresetSlice } from './slices/presetSlice';

const initialNodes = [
  { id: '1', label: 'Audio Input', x: 56, y: 57, displayName: 'Audio Input', parentId: null },
  { id: '2', label: 'Audio Output', x: 56, y: 247, displayName: 'Audio Output', parentId: null },
  { id: '3', label: 'Event Input', x: 252, y: 57, displayName: 'Event Input', parentId: null },
  { id: '4', label: 'Event Output', x: 252, y: 247, displayName: 'Event Output', parentId: null }
];

const initialWires = [
    { id: 'wire-init-a', sourceId: '1', sourcePortId: 'out-0', targetId: '2', targetPortId: 'in-0', type: 'audio', parentId: null },
    { id: 'wire-init-e', sourceId: '3', sourcePortId: 'out-0', targetId: '4', targetPortId: 'in-0', type: 'event', parentId: null }
];

const useStore = create((set, get) => ({
  ...createGraphSlice(set, get),
  ...createUISlice(set, get),
  ...createHistorySlice(set, get),
  ...createPresetSlice(set, get),

  // Override initial state here
  nodes: initialNodes,
  wires: initialWires
}));

export default useStore;