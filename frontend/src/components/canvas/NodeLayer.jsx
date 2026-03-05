import React from 'react';
import MuxNode from '../MuxNode';

const NodeLayer = ({
  visibleNodes,
  dockingStateMap,
  selectedNodeIds,
  highlightedNodeIds,
  activeModules,
  toggleModuleActive,
  handleNodeDown,
  handleNodeDoubleClick,
  handlePortDown,
  handleUpdateNodeText
}) => {
  return (
    <>
      {visibleNodes.map(node => {
        const docking = dockingStateMap.get(node.id) || {};
        return (
          <div key={node.id} style={{ pointerEvents: 'auto' }}>
            <MuxNode 
              node={node} inputs={docking.inputs || []} outputs={docking.outputs || []} isSelected={selectedNodeIds.includes(node.id)} isHighlighted={highlightedNodeIds.has(node.id)} isActive={activeModules[node.id] !== false} 
              onIndicatorClick={toggleModuleActive} onNodeDown={handleNodeDown} onNodeDoubleClick={handleNodeDoubleClick} onPortDown={handlePortDown} onUpdateText={handleUpdateNodeText} 
              dockedTop={docking.dockedTop} dockedBottom={docking.dockedBottom} overlappingTop={docking.overlappingTop} overlappingBottom={docking.overlappingBottom} kissingTop={docking.kissingTop} kissingBottom={docking.kissingBottom}
            />
          </div>
        );
      })}
    </>
  );
};

export default React.memo(NodeLayer);