import uniqid from "uniqid";

const newSynth = () => {
  const newSynth = {
    id: uniqid(),
    name: "New Synth",
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

const synths = [
  {
    id: uniqid(),
    name: "Basic Sine Wave",
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
    id: uniqid(),
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
        type: "highpass",
      },
    },
    notes: {
      scale: "D major",
      subdivision: 8,
      octave: 4,
    },
  },
];

export {synths, newSynth}