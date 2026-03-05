import { moduleRegistry } from './moduleRegistry';

export const getNextAvailableName = (label, currentNodes) => {
  const module = moduleRegistry[label];
  const isIO = module?.category === "Inputs Outputs";
  const sameTypeNodes = currentNodes.filter(n => n.label === label);
  const count = sameTypeNodes.length;

  if (isIO) {
    // IO modules: Always numbered sequence (Audio Output 1, 2, 3...)
    const numbers = sameTypeNodes.map(n => {
      const match = n.displayName?.match(/\d+$/);
      return match ? parseInt(match[0]) : 0;
    });
    const maxNum = Math.max(0, ...numbers);
    return `${label} ${maxNum + 1}`;
  } else {
    // Standard modules: No suffix initially, then (1), (2), (3)...
    if (count === 0) {
      return label;
    } else if (count === 1) {
      // Logic to update the first one happens in the state setter, 
      // here we just return the name for the second one.
      return `${label} (2)`;
    } else {
      const suffixes = sameTypeNodes.map(n => {
        const match = n.displayName?.match(/\((\d+)\)$/);
        return match ? parseInt(match[1]) : 0;
      });
      const maxNum = Math.max(0, ...suffixes);
      return `${label} (${maxNum + 1})`;
    }
  }
};

/**
 * Updates existing nodes to include suffixes if necessary when a new module is added.
 * Returns a new array of nodes.
 */
export const syncExistingSuffixes = (label, currentNodes) => {
  const module = moduleRegistry[label];
  const isIO = module?.category === "Inputs Outputs";
  const sameTypeNodes = currentNodes.filter(n => n.label === label);

  if (!isIO && sameTypeNodes.length === 1) {
    // We are adding the second standard module. Suffix the first one with (1).
    return currentNodes.map(n => {
      if (n.label === label && (!n.displayName || n.displayName === label)) {
        return { ...n, displayName: `${label} (1)` };
      }
      return n;
    });
  }
  return currentNodes;
};
