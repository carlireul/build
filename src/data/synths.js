import uniqid from "uniqid";


export const synths = [
  {
    name: "Basic Sine Wave",
    id: uniqid(),
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
      },
      notes: {
        scale: "C major",
        count: 8,
        octave: 4,
      },
    },
  },
];