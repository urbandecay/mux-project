export const handleSelectionOnDown = (currentIds, targetId, isShift) => {
    if (isShift) {
        if (currentIds.includes(targetId)) {
            return currentIds.filter(id => id !== targetId);
        } else {
            return [...currentIds, targetId];
        }
    } else {
        // If clicking a node that is ALREADY selected, keep the selection (allows group drag).
        // If clicking a new node, select only that node.
        if (currentIds.includes(targetId)) {
            return currentIds; 
        }
        return [targetId];
    }
};

export const handleWireSelectionOnDown = (currentWireIds, targetWireId, isShift) => {
    return handleSelectionOnDown(currentWireIds, targetWireId, isShift);
};
