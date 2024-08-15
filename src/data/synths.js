const defaultControls = { muted: false, vol: -8, solod: false, pan: 0 };

const defaultSteps = new Array(7)
  .fill(null)
  .map(() => new Array(8).fill(false));

const defaultEffects = {
  reverb: {
    enabled: false,
    options: {
      wet: 0.5,
      decay: 1,
    },
  },
  eq: {
    enabled: false,
    options: {
      high: 0,
      highFrequency: 2500,
      low: 0,
      lowFrequency: 400,
      mid: 0,
    }
  },
  delay: {
    enabled: false,
    options: {
      wet: 0.5,
      delayTime: "8n",
      feedback: 0,
    },
  },
  distortion: {
    enabled: false,
    options: {
      wet: 0.5,
      distortion: 0.2,
    },
  },
};

const presets = [
  {
    name: "Synth",
    type: "synth",
    synth: {
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 1.0,
        release: 0.8,
      },
      oscillator: {
        type: "sine",
      },
      filter: {
        wet: 0,
        cutoff: 0,
        rate: 0,
        type: "highpass",
        rolloff: -12,
      },
    },
    notes: {
      scale: "C major",
      subdivision: 8,
      octave: 4,
    },
  },
  {
    name: "16th Triangle Wave",
    synth: {
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 1.0,
        release: 0.8,
      },
      oscillator: {
        type: "sine",
      },
      filter: {
        wet: 0,
        cutoff: 0,
        rate: 0,
        type: "highpass",
        rolloff: -12,
      },
    },
    notes: {
      scale: "D major",
      subdivision: 16,
      octave: 4,
    },
  },
];

export {defaultControls, defaultEffects, defaultSteps, presets}