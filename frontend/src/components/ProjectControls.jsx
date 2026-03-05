import React, { useRef } from 'react';
import useStore from '../store/useStore';

const ProjectControls = () => {
  const { 
    savePreset, loadPreset, projectName, setProjectName, 
    focusMode, setFocusMode, focusDimLevel, setFocusDimLevel 
  } = useStore();
  const fileInputRef = useRef(null);

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        loadPreset(data, file.name);
      } catch (err) {
        console.error("Failed to parse preset file:", err);
        alert("Invalid preset file.");
      }
    };
    reader.readAsText(file);
    
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleSaveClick = () => {
      if (!projectName || projectName === 'Untitled') {
          handleSaveAsClick();
      } else {
          savePreset();
      }
  };

  const handleSaveAsClick = () => {
      const name = prompt("Enter project name:", projectName || '');
      if (name) {
          setProjectName(name);
          // Trigger save with new name immediately
          // We need to pass the name because state update might not be instant in this closure? 
          // Actually zustand updates are sync usually, but safe to pass override if we supported it.
          // Store's savePreset reads from get().projectName, which is updated.
          setTimeout(() => savePreset(), 0);
      }
  };

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
    padding: 0,
    fontSize: '10px',
    fontWeight: 'bold',
    flexDirection: 'column',
    lineHeight: '1.2'
  };

  return (
    <div style={{ position: 'fixed', top: 360, left: 10, zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
      <button onClick={handleSaveClick} style={buttonStyle} title="Save">
        Save
      </button>
      <button onClick={handleSaveAsClick} style={buttonStyle} title="Save As">
        Save As
      </button>
      <button onClick={handleLoadClick} style={buttonStyle} title="Load Preset">
        Load
      </button>
      <button 
        onClick={() => setFocusMode(!focusMode)} 
        style={{
          ...buttonStyle,
          background: focusMode ? '#0080ff' : '#333',
          borderColor: focusMode ? '#00aaff' : '#555',
          color: focusMode ? '#fff' : '#eee'
        }} 
        title="Toggle Focus Mode (Dim non-connected modules)"
      >
        Focus
      </button>
      {focusMode && (
        <div style={{ 
          width: '40px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          background: '#222', 
          padding: '4px 0', 
          borderRadius: '4px',
          border: '1px solid #444',
          marginBottom: '5px'
        }}>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={focusDimLevel}
            onChange={(e) => setFocusDimLevel(parseFloat(e.target.value))}
            style={{ 
              width: '32px', 
              height: '80px', 
              WebkitAppearance: 'slider-vertical',
              appearance: 'slider-vertical',
              cursor: 'pointer'
            }}
          />
          <div style={{ fontSize: '8px', color: '#888', marginTop: '2px' }}>
            {Math.round(focusDimLevel * 100)}%
          </div>
        </div>
      )}
      <div style={{ 
          marginTop: '5px', color: '#888', fontSize: '10px', 
          textAlign: 'center', width: '40px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' 
      }} title={projectName}>
          {projectName}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".json" 
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProjectControls;