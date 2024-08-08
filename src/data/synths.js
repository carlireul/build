import uniqid from "uniqid";

const newSynth = () => {
  const newSynth = {
    id: uniqid(),
    name: "Untitled",
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
      rate: "8n",
      type: "highpass",
    },
    },
    notes: {
      scale: "C major",
      subdivision: 8,
      octave: 4,
    },
  }

  synths.push(newSynth)
  return newSynth
}

const defaultControls = { muted: false, vol: -8, solod: false, pan: 0 };

const defaultSteps = new Array(7)
  .fill(null)
  .map(() => new Array(8).fill(false));

const defaultEffects = {
    chorus: {
      enabled: false,
      options: {
        wet: 1,
        frequency: 4,
        delayTime: 2,
        depth: 0.5,
        feedback: 0,
      },
    },
    reverb: {
      enabled: false,
      options: {
        wet: 1,
        decay: 1,
      },
    },
    delay: {
      enabled: false,
      options: {
        wet: 1,
        delayTime: "8n",
        feedback: 0,
      },
    },
    phaser: {
      enabled: false,
      options: {
        wet: 1,
        frequency: 15,
        octaves: 5,
        baseFrequency: 1000,
      },
    },
    distortion: {
      enabled: false,
      options: {
        wet: 1,
        distortion: 0.2,
      },
    },
}

const presets = [
  {
    name: "Basic Sine",
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
        rate: "8n",
        type: "highpass",
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
        rate: "8n",
        type: "highpass",
      },
    },
    notes: {
      scale: "D major",
      subdivision: 16,
      octave: 4,
    },
  },
];

export {defaultControls, defaultEffects, defaultSteps, presets, newSynth}