import { moduleRegistry } from '../../utils/moduleRegistry';

export const createUISlice = (set, get) => ({
  camera: { 
    x: (typeof window !== 'undefined' ? window.innerWidth : 800) / 2 - 203.5, 
    y: (typeof window !== 'undefined' ? window.innerHeight : 600) / 2 - 171, 
    zoom: 1 
  },
  wireRadius: 25,
  wireWidth: 3,
  
  navigationStack: [], 
  parentId: null,
  cameraStack: [],

  isPanning: false,
  panStart: { x: 0, y: 0, camX: 0, camY: 0 },
  selectionBox: null,
  drawing: null,
  dragState: null,
  
  selectedNodeIds: [],
  selectedWireIds: [],
  
  focusMode: false,
  focusDimLevel: 0.2,
  highlightByIndicators: false,
  editingGroupId: null,
  replacingNodeId: null,

  patchPointSize: 5,
  patchPointColorMode: 'light',
  patchPointHitboxRadius: 5,

  setCamera: (camera) => set({ camera: typeof camera === 'function' ? camera(get().camera) : camera }),
  setWireRadius: (radius) => set({ wireRadius: typeof radius === 'function' ? radius(get().wireRadius) : radius }),
  setWireWidth: (width) => set({ wireWidth: typeof width === 'function' ? width(get().wireWidth) : width }),
  
  setPatchPointSize: (size) => set({ patchPointSize: size }),
  setPatchPointColorMode: (mode) => set({ patchPointColorMode: mode }),
  setPatchPointHitboxRadius: (radius) => set({ patchPointHitboxRadius: typeof radius === 'function' ? radius(get().patchPointHitboxRadius) : radius }),

  setFocusMode: (focusMode) => set({ focusMode: typeof focusMode === 'function' ? focusMode(get().focusMode) : focusMode }),
  setFocusDimLevel: (level) => set({ focusDimLevel: level }),
  setHighlightByIndicators: (isActive) => set({ highlightByIndicators: isActive }),
  setEditingGroupId: (id) => set({ editingGroupId: id }),
  setReplacingNodeId: (id) => set({ replacingNodeId: id }),

  setIsPanning: (isPanning) => set({ isPanning: typeof isPanning === 'function' ? isPanning(get().isPanning) : isPanning }),
  setPanStart: (panStart) => set({ panStart: typeof panStart === 'function' ? panStart(get().panStart) : panStart }),
  setSelectionBox: (box) => set({ selectionBox: typeof box === 'function' ? box(get().selectionBox) : box }),
  setDrawing: (drawing) => set({ drawing: typeof drawing === 'function' ? drawing(get().drawing) : drawing }),
  setDragState: (dragState) => set({ dragState: typeof dragState === 'function' ? dragState(get().dragState) : dragState }),
  
  setSelectedNodeIds: (ids) => set({ selectedNodeIds: typeof ids === 'function' ? ids(get().selectedNodeIds) : ids }),
  setSelectedWireIds: (ids) => set({ selectedWireIds: typeof ids === 'function' ? ids(get().selectedWireIds) : ids }),

  enterGroupEdit: (groupId) => set({ editingGroupId: groupId, selectedNodeIds: [], selectedWireIds: [] }),
  exitGroupEdit: () => set({ editingGroupId: null }),

  navigateIn: (nodeId) => {
    const state = get();
    const node = state.nodes.find(n => n.id === nodeId);
    if (!node || node.label !== 'MUX Modular') return;

    const subNodes = state.nodes.filter(n => n.parentId === nodeId);
    let newCamera = { x: 0, y: 0 };
    if (subNodes.length > 0) {
        const minX = Math.min(...subNodes.map(n => n.x));
        const maxX = Math.max(...subNodes.map(n => {
            const mod = moduleRegistry[n.label];
            return n.x + (mod?.isAnchor ? 20 : (mod?.width || 99));
        }));
        const minY = Math.min(...subNodes.map(n => n.y));
        const maxY = Math.max(...subNodes.map(n => n.y + 38));
        newCamera = { x: (window.innerWidth / 2) - ((minX + maxX) / 2), y: (window.innerHeight / 2) - ((minY + maxY) / 2), zoom: 1 };
    }

    set({
        navigationStack: [...state.navigationStack, state.parentId],
        cameraStack: [...state.cameraStack, state.camera],
        parentId: nodeId,
        camera: newCamera,
        selectedNodeIds: [], selectedWireIds: [], editingGroupId: null,
        dragState: null, drawing: null, selectionBox: null
    });
  },

  zoomExtents: () => {
    const state = get();
    const visibleNodes = state.nodes.filter(n => n.parentId === state.parentId);
    if (visibleNodes.length === 0) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    visibleNodes.forEach(n => {
        const mod = moduleRegistry[n.label];
        const w = mod?.isAnchor ? 20 : (mod?.width || 99);
        const h = mod?.realHeight || 38;
        if (n.x < minX) minX = n.x;
        if (n.x + w > maxX) maxX = n.x + w;
        if (n.y < minY) minY = n.y;
        if (n.y + h > maxY) maxY = n.y + h;
    });
    
    if (minX === Infinity) return;
    const contentW = maxX - minX, contentH = maxY - minY, centerX = (minX + maxX) / 2, centerY = (minY + maxY) / 2;
    const padding = 50, leftPanelWidth = 150;
    const availableW = window.innerWidth - leftPanelWidth - (padding * 2), availableH = window.innerHeight - (padding * 2);
    const scaleX = availableW / contentW, scaleY = availableH / contentH;
    let newZoom = Math.min(scaleX, scaleY);
    if (newZoom > 2) newZoom = 2; if (newZoom < 0.1) newZoom = 0.1;
    
    const visualCenterX = leftPanelWidth + (window.innerWidth - leftPanelWidth) / 2;
    const visualCenterY = window.innerHeight / 2;
    set({ camera: { x: visualCenterX - centerX * newZoom, y: visualCenterY - centerY * newZoom, zoom: newZoom } });
  },

  zoomReset: () => {
    const state = get();
    const currentCamera = state.camera;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const leftPanelWidth = 150; // Matching the padding logic in zoomExtents

    // Calculate current viewport center in screen coordinates
    const viewCenterX = leftPanelWidth + (viewportWidth - leftPanelWidth) / 2;
    const viewCenterY = viewportHeight / 2;

    // Convert screen center to world coordinates using current camera
    const worldCenterX = (viewCenterX - currentCamera.x) / currentCamera.zoom;
    const worldCenterY = (viewCenterY - currentCamera.y) / currentCamera.zoom;

    // Set new zoom to 1, and adjust x/y so the same world point stays at screen center
    const newZoom = 1;
    const newX = viewCenterX - worldCenterX * newZoom;
    const newY = viewCenterY - worldCenterY * newZoom;

    set({ camera: { x: newX, y: newY, zoom: newZoom } });
  },

  navigateOut: () => {
    const state = get();
    if (state.navigationStack.length === 0) return;
    set({
        parentId: state.navigationStack[state.navigationStack.length - 1],
        navigationStack: state.navigationStack.slice(0, -1),
        cameraStack: state.cameraStack.slice(0, -1),
        camera: state.cameraStack[state.cameraStack.length - 1] || { x: 0, y: 0 },
        selectedNodeIds: [], selectedWireIds: [], editingGroupId: null,
        dragState: null, drawing: null, selectionBox: null
    });
  }
});