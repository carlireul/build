import uniqid from "uniqid";


export const synths = [
  {
    id: uniqid(),
    name: "Basic Sine Wave",
    properties: {
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
          cutoff: 0,
          type: "highpass",
        },
      },
      notes: {
        scale: "C major",
        count: 8,
        octave: 4,
      },
    },
  },
  {
    id: uniqid(),
    name: "16th Triangle Wave",
    properties: {
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
          cutoff: 0,
          type: "highpass",
        },
      },
      notes: {
        scale: "D major",
        count: 8,
        octave: 4,
      },
    },
  },
];