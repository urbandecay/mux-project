import React, { memo } from 'react';
import { moduleRegistry } from '../utils/moduleRegistry';
import NoteNode from './nodes/NoteNode';
import AnchorNode from './nodes/AnchorNode';
import PatchPointNode from './nodes/PatchPointNode';
import StandardNode from './nodes/StandardNode';

const MuxNode = (props) => {
  const { node } = props;
  const module = moduleRegistry[node.label];
  
  if (!module && !module?.isAnchor) return null;

  if (module.isNote) {
    return <NoteNode {...props} />;
  }

  if (module.isAnchor) {
    return <AnchorNode {...props} />;
  }

  if (module.isPatchPoint2) {
    return <PatchPointNode {...props} />;
  }

  return <StandardNode {...props} />;
};

const areEqual = (prev, next) => {
  return prev.node.id === next.node.id &&
         prev.node.x === next.node.x &&
         prev.node.y === next.node.y &&
         prev.node.color === next.node.color &&
         prev.node.displayName === next.node.displayName &&
         prev.node.text === next.node.text &&
         prev.isSelected === next.isSelected &&
         prev.isHighlighted === next.isHighlighted &&
         prev.isActive === next.isActive &&
         prev.dockedTop === next.dockedTop &&
         prev.dockedBottom === next.dockedBottom &&
         prev.overlappingTop === next.overlappingTop &&
         prev.overlappingBottom === next.overlappingBottom &&
         prev.kissingTop === next.kissingTop &&
         prev.kissingBottom === next.kissingBottom &&
         (prev.inputs || []).length === (next.inputs || []).length &&
         (prev.outputs || []).length === (next.outputs || []).length;
};

export default memo(MuxNode, areEqual);
