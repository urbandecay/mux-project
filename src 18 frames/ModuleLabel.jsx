import React, { useState, useRef } from 'react';

const ModuleLabel = ({ label, displayName, isAnchor, hasOutputs, width, isGreenYellow, marginTop, realH }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimer = useRef(null);

  const handleMouseEnter = (e) => {
    const el = e.currentTarget;
    const isCustom = displayName && displayName !== label;
    if (el.scrollWidth > el.clientWidth || isCustom) {
      hoverTimer.current = setTimeout(() => {
        setIsHovered(true);
      }, 500);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setIsHovered(false);
  };

  const visualTextBottom = hasOutputs ? 15 : 6;
  const labelStyle = isAnchor ? {
    position: 'absolute',
    bottom: visualTextBottom,
    left: 0,
    width: width - 5,
    height: 10,
    fontSize: '10px',
    lineHeight: '10px',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    pointerEvents: 'auto',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textShadow: '1px 1px 0px #000',
    cursor: 'inherit'
  } : {
    position: 'absolute',
    top: marginTop + realH - visualTextBottom - 10,
    left: isGreenYellow ? 40 : 20,
    width: isGreenYellow ? (width - 40 - 5) : (width - 20 - 5),
    height: 10,
    fontSize: '10px',
    lineHeight: '10px',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    pointerEvents: 'auto',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textShadow: '1px 1px 0px #000',
    zIndex: 5,
    cursor: 'inherit'
  };

  return (
    <>
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={labelStyle}
      >
        {displayName || label}
      </div>
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: displayName && displayName !== label ? -44 : -32,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.85)',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '3px',
          fontSize: '10px',
          zIndex: 1000,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          border: '1px solid #555',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {displayName && displayName !== label ? (
            <>
              <div style={{ borderBottom: '1px solid #555', paddingBottom: '2px', marginBottom: '2px', width: '100%', textAlign: 'center' }}>{label}</div>
              <div>{displayName}</div>
            </>
          ) : (
            label
          )}
        </div>
      )}
    </>
  );
};

export default ModuleLabel;
