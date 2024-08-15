import * as Tone from "tone";
import coreURL from "@ffmpeg/core?url"
import wasmURL from "@ffmpeg/core/wasm?url"
import { FFmpeg } from '@ffmpeg/ffmpeg' 

// file helpers

async function blobToUint8Array(blob) {
  const arrayBuffer = await new Response(blob).arrayBuffer();
  var uint8View = new Uint8Array(arrayBuffer);
  return uint8View;
}

async function convertWebmToMp3(webmBlob) {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load({ coreURL, wasmURL });

  const inputName = "input.webm";
  const outputName = "output.mp3";

  await ffmpeg.writeFile(
    inputName,
   await blobToUint8Array(webmBlob)
  );

  await ffmpeg.exec(["-i", inputName, outputName]);

  const outputData = await ffmpeg.readFile(outputName);
  const outputBlob = new Blob([outputData.buffer], { type: "audio/mp3" });

  return outputBlob;
}

// tone helpers

const togglePlay = () => {
  if (Tone.getContext().state === "suspended") {
    Tone.start();
  }

  if (
    Tone.getTransport().state === "stopped" ||
    Tone.getTransport().state === "paused"
  ) {
    Tone.getTransport().start();
  } else if (Tone.getTransport().state === "started") {
    Tone.getTransport().pause();
  }
};

const playbackStop = () => {
  Tone.getTransport().stop();
  Tone.getTransport().position = "0:0:0";
};

const createEffect = (type, options) => {
  let effect;

  switch (type) {
    case "distortion":
      effect = new Tone.Distortion();
      break;
    case "delay":
      effect = new Tone.FeedbackDelay();
      break;
    case "reverb":
      effect = new Tone.Reverb();
      break;
    case "eq":
      effect = new Tone.EQ3();
      break;
  }

  effect.set(options);
  // console.log(effect);

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

// music theory helpers

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

// misc helpers

const toTitleCase = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export {
  togglePlay,
  playbackStop,
  convertWebmToMp3,
  toTitleCase,
  getBeat,
  createEffect,
  notes,
};
