import React, { memo } from 'react';

const Frame = ({ 
  frame, 
  isSelected, 
  isDimmed,
  onFrameDown,
  onRename
}) => {
  return (
    <div 
      style={{ 
        position: 'absolute', 
        left: frame.x, 
        top: frame.y, 
        width: frame.width, 
        height: frame.height, 
        border: isSelected ? '2px solid #0080ff' : '1px solid #555',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '4px',
        zIndex: -1, // Stay behind nodes
        opacity: isDimmed ? 0.4 : 1,
        pointerEvents: 'auto',
        boxSizing: 'border-box'
      }}
      onMouseDown={(e) => {
        onFrameDown(e, frame);
        e.stopPropagation();
      }}
    >
      {/* Frame Label/Handle */}
      <div 
        style={{
          position: 'absolute',
          top: -20,
          left: 0,
          background: isSelected ? '#0080ff' : '#333',
          color: '#fff',
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: '4px 4px 0 0',
          cursor: 'grab',
          whiteSpace: 'nowrap',
          border: isSelected ? 'none' : '1px solid #555',
          borderBottom: 'none'
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          const newTitle = prompt('Enter frame title:', frame.title || '');
          if (newTitle !== null) onRename(frame.id, newTitle);
        }}
      >
        {frame.title || 'Group Frame'}
      </div>
    </div>
  );
};

export default memo(Frame);
