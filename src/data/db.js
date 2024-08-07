import Dexie from "dexie";
import uniqid from "uniqid";
import * as sample_files from './samples/samples.js'

const db = new Dexie("database");
db.version(13).stores({
  tracks: "id, name",
  states: "id",
  samples: "++id, pack, sample_type",
});

db.on("populate", (transaction) => {

  const synthID = uniqid()
  
	transaction.tracks.add({
    id: synthID,
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
    effects: {
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
          delayTime: 0.1,
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
    },
    steps: new Array(7).fill(null).map(() => new Array(8).fill(false)),
    clips: {}
  });

  transaction.states.add({
    id: uniqid(),
    bpm: 120,
    vol: -8,
    trackEnd: "1:0:0",
    name: "New Project",
    tracks: [synthID],
  });

  const s = []

  for(const [key, value] of Object.entries(sample_files)){

    console.log(value)

    const newSample = {
      sample_type: key.split("_")[0],
      pack: key.split("_")[1],
      name: key, // strip extension
      source: value,
    };

    s.push(newSample)
    console.log(newSample)
  }

  transaction.samples.bulkAdd(s)
  console.log(s)

})

db.open()
  .then(function (db) {
    console.log("Opened database successfully")
    console.log(db.states.toArray())
	console.log(db.tracks.toArray())
  console.log(db.samples.toArray()) 
  })
  .catch(function (err) {
    console.log("Error", err)
  });

export default db