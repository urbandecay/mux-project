import { moduleRegistry } from './moduleRegistry';

export const generateDisplayName = (nodes, currentParentId, label) => {
    const sameTypeNodes = nodes.filter(n => n.label === label && n.parentId === currentParentId);
    const count = sameTypeNodes.length;
    const module = moduleRegistry[label];
    const isIO = module?.category === "Inputs Outputs";

    if (isIO) {
      return `${label} ${count + 1}`;
    } else {
      if (count === 0) {
        return label;
      } else if (count === 1) {
        return `${label} (2)`;
      } else {
        return `${label} (${count + 1})`;
      }
    }
};

export const updateInitialNodeNameIfNecessary = (nodes, currentParentId, label) => {
    const sameTypeNodes = nodes.filter(n => n.label === label && n.parentId === currentParentId);
    const count = sameTypeNodes.length;
    const module = moduleRegistry[label];
    const isIO = module?.category === "Inputs Outputs";

    if (!isIO && count === 1) {
        // Find the existing one and return a new nodes array with it renamed
        return nodes.map(n => {
            if (n.parentId === currentParentId && n.label === label && (!n.displayName || n.displayName === label)) {
                return { ...n, displayName: `${label} (1)` };
            }
            return n;
        });
    }
    return nodes; // No update necessary
};