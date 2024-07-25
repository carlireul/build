import Dexie from "dexie";
import uniqid from "uniqid";
import julia from "./julia.mp3";

const db = new Dexie("database");
db.version(8).stores({
  tracks: "id, name", 
})

db.on("populate", (transaction) => {
  
	transaction.tracks.add({
    id: uniqid(),
    type: "synth",
    name: "Basic Sine",
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
    controls: {
      muted: false,
      vol: -8,
      solod: false,
      pan: 0,
    },
    steps: new Array(7)
      .fill(null)
      .map(() => new Array(8).fill(false)),
  });

  transaction.tracks.add({
    id: uniqid(),
    type: "audio",
    name: "Test Audio 1",
    source: julia,
    controls: {
      muted: false,
      vol: -8,
      solod: false,
      pan: 0,
    },
  });
})

db.open()
  .then(function (db) {
    console.log("Opened database succesfully")
	console.log(db.tracks.toArray())
  })
  .catch(function (err) {
    console.log("Error", err)
  });

export default db