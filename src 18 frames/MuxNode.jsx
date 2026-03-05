import React, { memo } from 'react';
import { moduleRegistry, DISPLAY_NAMES } from './moduleRegistry';
import * as ConnectionManager from './ConnectionManager';
import ModuleLabel from './ModuleLabel';

const GREEN_YELLOW_MODULES = [
  "1P Lowpass Filter", "2P MultiMode Filter", "4P Lowpass Filter", "ADSR Envelope",
  "Aftertouch To Modulation Converter", "Allpass Filter", "Amp Distortion", "Amplifier",
  "Audio Balancer 1-2", "Audio Balancer 2-1", "Audio Dispatcher", "Audio Envelope Follower",
  "Audio File Recorder", "Audio Inverter", "Audio Level Meter",
  "Audio Limiter", "Audio Pos-Neg Splitter", "Audio To Modulation Converter",
  "Bit Reducer", "Chebyshev II Filter", "Composer", "Constant Modulator",
  "Controller To Modulation Converter", "Drum Note Processor", "EQ - FilterBank",
  "Event Delay", "Event Monitor", "Event Recorder",
  "Frequency Spectrum Analyser", "Grain Player", "Initial Event Generator",
  "Latency Generator", "Level Compressor", "LFO", "MIDI Channel Remapper",
  "MIDI Channel Splitter", "MIDI Controller Event Pad", "MIDI Controller Filter",
  "MIDI Controller Generator", "Modulation Mapper", "Modulation Monitor",
  "Modulation Sample & Hold", "Modulation To Audio Converter",
  "Module Slot", "Monophonic Note Tracker", "Multi-Form Oscillator", "Multi-Point Envelope",
  "Multi-Sample Player", "MUX Modular", "Noise Generator", "Note Dispatcher",
  "Note Event Pad", "Note Key Mapper", "Note Key Ranger", "Note Key Splitter",
  "Note Key-Vel Filter", "Note Length Modifier", "Note Modifier",
  "Note On Upon Note Off Generator", "Note Stutterer", "Note To Modulation Converter",
  "Note Zone Mapper", "Oscillator", "Parameter Event Generator", "Parameter Value Randomizer",
  "Patch Point", "Piano Keyboard", "Pitch Bend Generator", "Pitchbend To Modulation Converter",
  "Poly Synth", "Pure Delay", "Rack", "Rack Slot", "Resonator", "Ring Modulator",
  "Sample Player", "Samplerate Reducer", "Send", "Sequence Player",
  "Step Sequencer", "Stereo Combinor", "Stereo Splitter", "Test Sine Generator",
  "Unipolarizer", "Wobble Generator", "XY MIDI Controller Pad", "XY Modulation Pad",
  "XY Parameter Pad"
];

const MuxNode = ({ 
  node, 
  isSelected, 
  isDimmed, 
  dockedTop, 
  dockedBottom, 
  onNodeDown, 
  onPortDown,
  onUpdateText
}) => {
  const module = moduleRegistry[node.label];
  
  if (!module && !module?.isAnchor) return null;

  // Standard Module Rendering
  const height = 38; // Grid height
  const width = module.isAnchor ? 20 : (module.width || 99);

  const hasOutputs = module.outputs && module.outputs.length > 0;
  const hasInputs = module.inputs && module.inputs.length > 0;
  
  // Render Note Module
  if (module.isNote) {
    const noteH = 20;
    return (
      <div 
        style={{ 
          position: 'absolute', 
          left: node.x, 
          top: node.y + (38 - noteH) / 2, // Center it within the 38px grid row
          width: 38, 
          height: noteH, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDimmed ? 0.6 : 1,
          zIndex: isSelected ? 100 : 1,
          cursor: 'pointer',
          filter: isSelected ? 'drop-shadow(0 0 4px #0080ff)' : 'none'
        }}
        onMouseDown={(e) => {
          onNodeDown(e, node);
          e.stopPropagation();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onUpdateText(node.id, node.text || '', true); 
        }}
      >
        <img 
          src={`/Assets/${module.image}`} 
          draggable={false} 
          onDragStart={e => e.preventDefault()} 
          style={{ 
            height: noteH, 
            display: 'block', 
            imageRendering: 'pixelated'
          }} 
        />
        {node.displayName && (
          <div style={{ 
            position: 'absolute', 
            bottom: -15, 
            width: '80px', 
            textAlign: 'center', 
            fontSize: '9px', 
            color: '#fff',
            textShadow: '1px 1px 1px #000',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {node.displayName}
          </div>
        )}
      </div>
    );
  }

  // Render Anchor (Tiny white dot)
  if (module.isAnchor) {
    return (
      <div 
        style={{ 
          position: 'absolute', 
          left: node.x, 
          top: node.y, 
          width, 
          height: 20, 
          opacity: isDimmed ? 0.5 : 1 
        }}
        onMouseDown={(e) => {
          onNodeDown(e, node);
          e.stopPropagation();
        }}
      >
        <div style={{ 
          width: 6, 
          height: 6, 
          margin: '7px', 
          background: '#fff', 
          pointerEvents: 'auto', 
          boxShadow: isSelected ? '0 0 0 2px #0080ff' : 'none' 
        }} />
        <ModuleLabel 
          label={node.label}
          displayName={node.displayName || DISPLAY_NAMES[node.label]}
          isAnchor={true}
          hasOutputs={hasOutputs}
          width={width}
        />
      </div>
    );
  }

  const realH = module.realHeight || 38;
  const isSource = realH < 38 && !hasInputs;
  const isSink = realH < 38 && !hasOutputs;
  
  let marginTop = 0;
  if (isSource) marginTop = 38 - realH;
  else if (realH < 38 && !isSink) marginTop = (38 - realH) / 2;

  // Clip away the nubs if docked
  const clipTop = dockedTop ? 9 : 0;
  const clipBottom = dockedBottom ? 9 : 0;
  const clipPath = `inset(${clipTop}px 0px ${clipBottom}px 0px)`;

  const isGreenYellow = GREEN_YELLOW_MODULES.includes(node.label);
  
  return (
    <div 
      style={{ 
        position: 'absolute', 
        left: node.x, 
        top: node.y, 
        width, 
        height: 38, 
        opacity: isDimmed ? 0.6 : 1,
        zIndex: isSelected ? 100 : 1,
        cursor: 'grab'
      }}
      onMouseDown={(e) => {
        onNodeDown(e, node);
        e.stopPropagation();
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <img 
          src={`/Assets/${module.image}`} 
          draggable={false} 
          onDragStart={e => e.preventDefault()} 
          style={{ 
            width: '100%', 
            height: realH, 
            marginTop: marginTop,
            display: 'block', 
            imageRendering: 'pixelated',
            filter: isSelected ? 'drop-shadow(0 0 4px #0080ff)' : 'none',
            clipPath: (dockedTop || dockedBottom) ? clipPath : 'none'
          }} 
        />
      </div>

      <ModuleLabel 
        label={node.label}
        displayName={node.displayName || DISPLAY_NAMES[node.label]}
        isAnchor={false}
        hasOutputs={hasOutputs}
        width={width}
        isGreenYellow={isGreenYellow}
        marginTop={marginTop}
        realH={realH}
      />
      
      {/* Render Ports */}
      {ConnectionManager.getHandles(node).map(h => {
        const isDockedHandle = (h.direction === 'input' && dockedTop) || (h.direction === 'output' && dockedBottom);
        if (isDockedHandle) return null;

        return (
          <div 
            key={h.id} 
            onMouseDown={(e) => {
              onPortDown(e, node, h);
              e.stopPropagation();
            }}
            style={{ 
              position: 'absolute', 
              left: h.x - node.x - 7, 
              top: h.y - node.y - 7, 
              width: 14, 
              height: 14, 
              cursor: 'crosshair', 
              pointerEvents: 'auto',
              zIndex: 10
            }} 
          />
        );
      })}
    </div>
  );
};

export default memo(MuxNode);
