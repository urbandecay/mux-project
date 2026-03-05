import { serialize, deserialize } from '../../utils/PresetManager';
import { moduleRegistry } from '../../utils/moduleRegistry';

export const createPresetSlice = (set, get) => ({
  projectName: 'Untitled',
  
  setProjectName: (name) => set({ projectName: name }),

  savePreset: (nameOverride = null) => {
    const state = get();
    const data = serialize(state, state.parentId);
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    
    let filename = nameOverride || state.projectName || 'Untitled';
    if (!filename.endsWith('.json')) filename += '.json';
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  loadPreset: (data, fileName = null) => {
    get().pushSnapshot();
    const state = get();
    
    if (state.parentId === null) {
       const imported = deserialize(data, null);
       
       let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
       if (imported.nodes.length > 0) {
           imported.nodes.forEach(n => {
                const mod = moduleRegistry[n.label];
                const w = mod?.isAnchor ? 20 : (mod?.width || 99);
                const h = mod?.realHeight || 38;
                if (n.x < minX) minX = n.x;
                if (n.x + w > maxX) maxX = n.x + w;
                if (n.y < minY) minY = n.y;
                if (n.y + h > maxY) maxY = n.y + h;
           });
       } else {
           minX = 0; maxX = 0; minY = 0; maxY = 0;
       }

       const contentCenterX = (minX + maxX) / 2;
       const contentCenterY = (minY + maxY) / 2;
       const newCamX = (window.innerWidth / 2) - contentCenterX;
       const newCamY = (window.innerHeight / 2) - contentCenterY;
       const newProjectName = fileName ? fileName.replace('.json', '') : state.projectName;

       set({ 
         nodes: imported.nodes, 
         wires: imported.wires, 
         groups: imported.groups || [],
         projectName: newProjectName,
         camera: { x: newCamX, y: newCamY, zoom: 1 }, 
         selectedNodeIds: [], selectedWireIds: []
       });
    } else {
       const wrapperId = `MUX Modular-${Date.now()}`;
       const zoom = state.camera.zoom || 1;
       const centerX = (-state.camera.x + window.innerWidth / 2) / zoom;
       const centerY = (-state.camera.y + window.innerHeight / 2) / zoom;
       
       const wrapperNode = {
           id: wrapperId,
           label: 'MUX Modular',
           x: centerX - 50,
           y: centerY - 19,
           displayName: fileName ? fileName.replace('.json', '') : 'Loaded Preset',
           parentId: state.parentId
       };
       
       const imported = deserialize(data, wrapperId);
       
       set({
           nodes: [...state.nodes, wrapperNode, ...imported.nodes],
           wires: [...state.wires, ...imported.wires],
           groups: [...state.groups, ...(imported.groups || [])]
       });
    }
  }
});