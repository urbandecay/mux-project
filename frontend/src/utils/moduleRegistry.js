export const DISPLAY_NAMES = {
  "Note Event Pad": "C4 Pad",
  "MIDI Controller Event Pad": "CC 0 - Bank Select MSB Pad"
};

export const GREEN_YELLOW_MODULES = [
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
  "Mono Echo (Long)", "Mono Echo (Short)",
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

export const PROCEDURAL_MODULES = ["Oscillator", "4P Lowpass Filter"]; 

export const getModuleIcon = (moduleName, category) => {
  if (category === "Audio Generators") {
    if (moduleName === "Sample Player") return "instrument";
    return "waveform";
  }
  if (category === "Audio Processors") return "waveform";
  if (category === "Event Generators" || category === "Event Processors") return "music note";
  if (category === "Modulation Generators" || category === "Modulation Processors") return "envelope";
  if (category === "Converters") return "arrow";
  if (category === "Inputs Outputs") {
    if (moduleName.toLowerCase().includes("input")) return "input";
    if (moduleName.toLowerCase().includes("output")) return "output";
  }
  if (category === "Utilities") {
    if (moduleName === "Project Note") return "notepad";
    return "square";
  }
  if (category === "Others") {
    return `${moduleName.toLowerCase()}`;
  }
  return null;
};

export const moduleRegistry = {
"Grain Player": {       category: "Audio Generators", width: 106, height: 38, inputs: ["event", "modulation", "modulation", "modulation", "modulation", "modulation", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5, 80.5, 94.5], outputOffsets: [10.5] },
"Multi-Form Oscillator": {       category: "Audio Generators", width: 101, height: 38, inputs: ["event", "modulation", "modulation", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5, 52.5], outputOffsets: [10.5] },
"Multi-Sample Player": {       category: "Audio Generators", width: 101, height: 38, inputs: ["event", "modulation", "modulation"], outputs: ["audio", "audio", "audio", "audio"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5, 24.5, 38.5, 52.5] },
"Noise Generator": {       category: "Audio Generators", width: 101, height: 38, inputs: ["event", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5] },
"Oscillator": {       category: "Audio Generators", width: 101, height: 38, inputs: ["event", "modulation", "modulation", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5, 52.5], outputOffsets: [10.5] },
"Poly Synth": {       category: "Audio Generators", width: 101, height: 38, inputs: ["event"], outputs: ["audio"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Sample Player": {       category: "Audio Generators", width: 101, height: 38, inputs: ["event", "modulation", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5] },
"Test Sine Generator": {       category: "Audio Generators", width: 101, height: 38, realHeight: 29, inputs: [], outputs: ["audio"], inputOffsets: [], outputOffsets: [10.5] },
"1P Lowpass Filter": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5] },
"2P MultiMode Filter": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event", "modulation", "modulation", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5], outputOffsets: [10.5] },
"4P Lowpass Filter": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5] },
"Allpass Filter": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event"], outputs: ["audio"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5] },
"Amp Distortion": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event", "modulation", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5, 52.5], outputOffsets: [10.5] },
"Amplifier": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event", "modulation", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5, 52.5], outputOffsets: [10.5] },
"Audio Balancer 1-2": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event", "modulation", "modulation", "modulation"], outputs: ["audio", "audio"], inputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5], outputOffsets: [10.5, 24.5] },
"Audio Balancer 2-1": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "audio", "event", "modulation", "modulation", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5, 80.5], outputOffsets: [10.5] },
"Audio Dispatcher": {       category: "Audio Processors", width: 176, height: 38, inputs: ["audio", "event"], outputs: ["audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5, 80.5, 94.5, 108.5, 122.5, 136.5, 150.5, 164.5] },
"Audio File Recorder": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio"], outputs: ["audio"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Audio Inverter": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio"], outputs: ["audio"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Audio Level Meter": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio"], outputs: ["audio"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Audio Limiter": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event"], outputs: ["audio"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5] },
"Audio Pos-Neg Splitter": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio"], outputs: ["audio", "audio"], inputOffsets: [10.5], outputOffsets: [10.5, 24.5] },
"Bit Reducer": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5] },
"Chebyshev II Filter": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event", "modulation", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5, 52.5], outputOffsets: [10.5] },
"EQ - FilterBank": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event"], outputs: ["audio"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5] },
"Frequency Spectrum Analyser": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event"], outputs: ["audio"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5] },
"Level Compressor": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "audio", "event"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5] },
"Mixer Strip": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event", "modulation", "modulation", "modulation"], outputs: ["audio", "event"], inputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5], outputOffsets: [10.5, 24.5] },
"Modular Feedback Delay": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event"], outputs: ["audio"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5] },
"Mono Echo (Long)": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5] },
"Mono Echo (Short)": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5] },
"Oscilloscope": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event"], outputs: ["audio"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5] },
"Pure Delay": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio"], outputs: ["audio"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Resonator": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event", "modulation", "modulation", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5], outputOffsets: [10.5] },
"Ring Modulator": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "audio"], outputs: ["audio"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5] },
"Samplerate Reducer": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "event", "modulation"], outputs: ["audio"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5] },
"Stereo Combinor": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio", "audio"], outputs: ["audio"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5] },
"Stereo Splitter": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio"], outputs: ["audio", "audio"], inputOffsets: [10.5], outputOffsets: [10.5, 24.5] },
"Unipolarizer": {       category: "Audio Processors", width: 101, height: 38, inputs: ["audio"], outputs: ["audio"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Aftertouch To Modulation Converter": {       category: "Converters", width: 101, height: 38, inputs: ["event"], outputs: ["modulation"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Audio To Modulation Converter": {       category: "Converters", width: 101, height: 38, inputs: ["audio"], outputs: ["modulation"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Controller To Modulation Converter": {       category: "Converters", width: 101, height: 38, inputs: ["event"], outputs: ["modulation"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Modulation To Audio Converter": {       category: "Converters", width: 101, height: 38, inputs: ["modulation"], outputs: ["audio"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Note To Modulation Converter": {       category: "Converters", width: 101, height: 38, inputs: ["event"], outputs: ["modulation", "modulation", "modulation"], inputOffsets: [10.5], outputOffsets: [10.5, 24.5, 38.5] },
"Pitchbend To Modulation Converter": {       category: "Converters", width: 101, height: 38, inputs: ["event"], outputs: ["modulation"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Audio Envelope Follower": {       category: "Event Generators", width: 101, height: 38, inputs: ["audio", "event"], outputs: ["event", "modulation"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5, 24.5] },
"Initial Event Generator": {       category: "Event Generators", width: 101, height: 38, realHeight: 29, inputs: [], outputs: ["event"], inputOffsets: [], outputOffsets: [10.5] },
"MIDI Controller Event Pad": {       category: "Event Generators", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"MIDI Controller Generator": {       category: "Event Generators", width: 101, height: 38, inputs: ["event", "modulation"], outputs: ["event"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5] },
"Note Event Pad": {       category: "Event Generators", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Note On Upon Note Off Generator": {       category: "Event Generators", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Parameter Event Generator": {       category: "Event Generators", width: 101, height: 38, inputs: ["event", "modulation"], outputs: ["event"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5] },
"Parameter Value Randomizer": {       category: "Event Generators", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Piano Keyboard": {       category: "Event Generators", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Pitch Bend Generator": {       category: "Event Generators", width: 101, height: 38, inputs: ["event", "modulation"], outputs: ["event"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5] },
"Sequence Player": {       category: "Event Generators", width: 246, height: 38, inputs: ["event"], outputs: ["audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "event"], inputOffsets: [10.5], outputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5, 80.5, 94.5, 108.5, 122.5, 136.5, 150.5, 164.5, 178.5, 192.5, 206.5, 220.5, 234.5] },
"Step Sequencer": {       category: "Event Generators", width: 246, height: 38, inputs: ["event"], outputs: ["audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "audio", "event"], inputOffsets: [10.5], outputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5, 80.5, 94.5, 108.5, 122.5, 136.5, 150.5, 164.5, 178.5, 192.5, 206.5, 220.5, 234.5] },
"XY MIDI Controller Pad": {       category: "Event Generators", width: 101, height: 38, inputs: ["event"], outputs: ["event", "event"], inputOffsets: [10.5], outputOffsets: [10.5, 24.5] },
"XY Parameter Pad": {       category: "Event Generators", width: 101, height: 38, inputs: ["event"], outputs: ["event", "event"], inputOffsets: [10.5], outputOffsets: [10.5, 24.5] },
"Drum Note Processor": {       category: "Event Processors", width: 176, height: 38, inputs: ["event"], outputs: ["event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event"], inputOffsets: [10.5], outputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5, 80.5, 94.5, 108.5, 122.5, 136.5, 150.5, 164.5] },
"Event Delay": {       category: "Event Processors", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Event Monitor": {       category: "Event Processors", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Event Recorder": {       category: "Event Processors", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"MIDI Channel Remapper": {       category: "Event Processors", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"MIDI Channel Splitter": {       category: "Event Processors", width: 232, height: 38, inputs: ["event"], outputs: ["event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event"], inputOffsets: [10.5], outputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5, 80.5, 94.5, 108.5, 122.5, 136.5, 150.5, 164.5, 178.5, 192.5, 206.5, 220.5] },
"MIDI Controller Filter": {       category: "Event Processors", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Monophonic Note Tracker": {       category: "Event Processors", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Note Dispatcher": {       category: "Event Processors", width: 148, height: 38, inputs: ["event"], outputs: ["event", "event", "event", "event", "event", "event", "event", "event", "event", "event"], inputOffsets: [10.5], outputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5, 80.5, 94.5, 108.5, 122.5, 136.5] },
"Note Key Mapper": {       category: "Event Processors", width: 101, height: 38, realHeight: 36, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Note Key Ranger": {       category: "Event Processors", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Note Key Splitter": {       category: "Event Processors", width: 176, height: 38, inputs: ["event"], outputs: ["event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event"], inputOffsets: [10.5], outputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5, 80.5, 94.5, 108.5, 122.5, 136.5, 150.5, 164.5] },
"Note Key-Vel Filter": {       category: "Event Processors", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Note Length Modifier": {       category: "Event Processors", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Note Modifier": {       category: "Event Processors", width: 101, height: 38, inputs: ["event"], outputs: ["event"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Note Stutterer": {       category: "Event Processors", width: 101, height: 38, inputs: ["event", "modulation", "modulation"], outputs: ["event"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5] },
"Note Zone Mapper": {       category: "Event Processors", width: 246, height: 38, inputs: ["event"], outputs: ["event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event", "event"], inputOffsets: [10.5], outputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5, 80.5, 94.5, 108.5, 122.5, 136.5, 150.5, 164.5, 178.5, 192.5, 206.5, 220.5] },
"Audio Input": {       category: "Inputs Outputs", width: 101, height: 38, realHeight: 29, inputs: [], outputs: ["audio"], inputOffsets: [], outputOffsets: [10.5] },
"Audio Output": {       category: "Inputs Outputs", width: 101, height: 38, realHeight: 29, inputs: ["audio"], outputs: [], inputOffsets: [10.5], outputOffsets: [] },
"Event Input": {       category: "Inputs Outputs", width: 101, height: 38, realHeight: 29, inputs: [], outputs: ["event"], inputOffsets: [], outputOffsets: [10.5] },
"Event Output": {       category: "Inputs Outputs", width: 101, height: 38, realHeight: 29, inputs: ["event"], outputs: [], inputOffsets: [10.5], outputOffsets: [] },
"Modulation Input": {       category: "Inputs Outputs", width: 101, height: 38, realHeight: 29, inputs: [], outputs: ["modulation"], inputOffsets: [], outputOffsets: [10.5] },
"Modulation Output": {       category: "Inputs Outputs", width: 101, height: 38, realHeight: 29, inputs: ["modulation"], outputs: [], inputOffsets: [10.5], outputOffsets: [] },
"ADSR Envelope": {       category: "Modulation Generators", width: 101, height: 38, inputs: ["event", "modulation", "modulation"], outputs: ["modulation"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5] },
"Constant Modulator": {       category: "Modulation Generators", width: 101, height: 38, inputs: ["event"], outputs: ["modulation"], inputOffsets: [10.5], outputOffsets: [10.5] },
"LFO": {       category: "Modulation Generators", width: 101, height: 38, inputs: ["event", "modulation", "modulation"], outputs: ["modulation"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5] },
"Multi-Point Envelope": {       category: "Modulation Generators", width: 101, height: 38, inputs: ["event", "modulation", "modulation", "modulation", "modulation", "modulation"], outputs: ["modulation"], inputOffsets: [10.5, 24.5, 38.5, 52.5, 66.5, 80.5], outputOffsets: [10.5] },
"Wobble Generator": {       category: "Modulation Generators", width: 101, height: 38, inputs: ["event"], outputs: ["modulation"], inputOffsets: [10.5], outputOffsets: [10.5] },
"XY Modulation Pad": {       category: "Modulation Generators", width: 101, height: 38, inputs: ["event"], outputs: ["modulation", "modulation"], inputOffsets: [10.5], outputOffsets: [10.5, 24.5] },
"Modulation Mapper": {       category: "Modulation Processors", width: 101, height: 38, inputs: ["event", "modulation", "modulation", "modulation"], outputs: ["modulation"], inputOffsets: [10.5, 24.5, 38.5, 52.5], outputOffsets: [10.5] },
"Modulation Monitor": {       category: "Modulation Processors", width: 101, height: 38, inputs: ["modulation"], outputs: ["modulation"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Modulation Sample & Hold": {       category: "Modulation Processors", width: 101, height: 38, inputs: ["event", "modulation"], outputs: ["modulation"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5] },
"Composer": {       category: "Others", width: 99, height: 38, inputs: ["event"], outputs: ["audio", "event"], inputOffsets: [10.5], outputOffsets: [10.5, 24.5] },
"Module Slot": {       category: "Others", width: 101, height: 38, inputs: ["audio", "event", "modulation"], outputs: ["audio", "event", "modulation"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5, 24.5, 38.5] },
"MUX Modular": {       category: "Others", width: 99, height: 38, inputs: ["audio", "event"], outputs: ["audio", "event"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5, 24.5] },
"Rack Slot": {       category: "Others", width: 101, height: 38, inputs: ["audio", "event"], outputs: ["audio", "event"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5, 24.5] },
"Rack": {       category: "Others", width: 101, height: 38, inputs: ["audio", "event"], outputs: ["audio", "event"], inputOffsets: [11.5, 25.5], outputOffsets: [11.5, 25.5] },
"Send": {       category: "Others", width: 99, height: 38, inputs: ["audio", "event", "modulation"], outputs: ["audio", "audio", "event", "event"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5, 24.5, 38.5, 52.5] },
"Freeze Point": {       category: "Utilities", width: 101, height: 38, inputs: ["audio"], outputs: ["audio"], inputOffsets: [10.5], outputOffsets: [10.5] },
"Project Note": {       category: "Utilities", width: 38, height: 20, isNote: true },
"Latency Generator": {       category: "Utilities", width: 101, height: 38, inputs: ["audio", "event"], outputs: ["audio", "event"], inputOffsets: [10.5, 24.5], outputOffsets: [10.5, 24.5] },
"Patch Point": {       category: "Utilities", width: 101, height: 38, inputs: ["audio", "event", "modulation"], outputs: ["audio", "event", "modulation"], inputOffsets: [10.5, 24.5, 38.5], outputOffsets: [10.5, 24.5, 38.5] },
"Patch Point 2": { category: "Utilities", isPatchPoint2: true },
"Anchor": { category: "Utilities", inputs: ["universal"], outputs: ["universal"], isAnchor: true }
};