import * as Tone from "tone";

// tone helpers

const createEffect = (type, options) => {
  let effect;

  switch (type) {
    case "chorus":
      effect = new Tone.Chorus();
      break;
    case "distortion":
      effect = new Tone.Distortion();
      break;
    case "delay":
      effect = new Tone.FeedbackDelay();
      break;
    case "phaser":
      effect = new Tone.Phaser();
      break;
    case "reverb":
      effect = new Tone.Reverb();
      break;
  }

  effect.set(options);
  console.log(effect);

  return effect;
};

// beat helpers

const sliced = (position) => {
  return position.split(":").map((n) => parseInt(n));
};

const bars = (position) => {
  return sliced(position)[0];
};

const quarters = (position) => {
  return sliced(position)[1];
};

const sixteenths = (position) => {
  const q = quarters(position);
  const s = sliced(position)[2];

  return s + 4 * q;
};

const eighths = (position) => {
  return sixteenths(position) / 2;
};

const getBeat = (position, count) => {
  switch (count) {
    case 4:
      return quarters(position);
    case 8:
      return eighths(position);
    case 16:
      return sixteenths(position);
  }
};

export { getBeat, createEffect };
