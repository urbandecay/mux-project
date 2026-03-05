import React from 'react';
import useStore from '../store/useStore';

const ZoomControls = () => {
  const { zoomExtents, zoomReset } = useStore();

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: '#333',
    border: '1px solid #555',
    borderRadius: '4px',
    color: '#eee',
    cursor: 'pointer',
    marginBottom: '5px',
    padding: 0
  };

  return (
    <div style={{ position: 'fixed', top: 260, left: 10, zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
      <button onClick={zoomExtents} style={buttonStyle} title="Zoom Extents">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
      <button onClick={zoomReset} style={buttonStyle} title="Zoom 1:1">
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>1:1</span>
      </button>
    </div>
  );
};

export default ZoomControls;