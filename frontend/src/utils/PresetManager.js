export const serialize = (state, rootParentId = null) => {
    // 1. Identify all nodes to save
    const nodesToSave = [];
    const collectNodes = (pId) => {
        const directChildren = state.nodes.filter(n => n.parentId === pId);
        directChildren.forEach(child => {
            nodesToSave.push(child);
            collectNodes(child.id);
        });
    };
    collectNodes(rootParentId);

    const nodeIds = nodesToSave.map(n => n.id);

    // 2. Identify wires and groups
    const wiresToSave = state.wires.filter(w => 
        (w.parentId === rootParentId || nodeIds.includes(w.parentId)) && // Wires at this level OR inside saved children
        (nodeIds.includes(w.sourceId) && nodeIds.includes(w.targetId)) // Ensure both ends are valid
    );

    const groupsToSave = state.groups.filter(g => 
        g.parentId === rootParentId || nodeIds.includes(g.parentId)
    );

    // 3. Normalize Parent IDs
    const normalizedNodes = nodesToSave.map(n => ({
        ...n,
        parentId: n.parentId === rootParentId ? null : n.parentId
    }));

    const normalizedWires = wiresToSave.map(w => ({
        ...w,
        parentId: w.parentId === rootParentId ? null : w.parentId
    }));

    const normalizedGroups = groupsToSave.map(g => ({
        ...g,
        parentId: g.parentId === rootParentId ? null : g.parentId
    }));

    return {
        nodes: normalizedNodes,
        wires: normalizedWires,
        groups: normalizedGroups,
        version: 1
    };
};

export const deserialize = (data, targetParentId) => {
    if (!data || !data.nodes) return { nodes: [], wires: [], groups: [] };

    // 1. Generate ID Map for nodes
    const idMap = {};
    data.nodes.forEach(n => {
        idMap[n.id] = `${n.label}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    });

    // 2. Generate ID Map for groups
    const groupIdMap = {};
    if (data.groups) {
        data.groups.forEach(g => {
            groupIdMap[g.id] = `group-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        });
    }

    // 3. Remap Nodes
    const newNodes = data.nodes.map(n => ({
        ...n,
        id: idMap[n.id],
        parentId: n.parentId === null ? targetParentId : (idMap[n.parentId] || targetParentId),
        groupId: n.groupId ? groupIdMap[n.groupId] : undefined
    }));

    // 4. Remap Wires
    const newWires = data.wires.map(w => {
        const newSourceId = idMap[w.sourceId];
        const newTargetId = idMap[w.targetId];
        if (!newSourceId || !newTargetId) return null;

        return {
            ...w,
            id: `wire-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
            sourceId: newSourceId,
            targetId: newTargetId,
            parentId: w.parentId === null ? targetParentId : (idMap[w.parentId] || targetParentId)
        };
    }).filter(Boolean);

    // 5. Remap Groups
    const newGroups = (data.groups || []).map(g => ({
        ...g,
        id: groupIdMap[g.id],
        parentId: g.parentId === null ? targetParentId : (idMap[g.parentId] || targetParentId)
    }));

    return { nodes: newNodes, wires: newWires, groups: newGroups };
};
