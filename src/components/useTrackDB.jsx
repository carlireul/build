import { useContext } from 'react';
import { TrackContext } from "./TrackContext";
import { presets, defaultSteps, defaultControls, defaultEffects } from '../data/synths';
import db from '../data/db';
import uniqid from "uniqid";
import { toTitleCase } from '../services/helpers';

const useTrackDB = () => {
	const [state, setState] = useContext(TrackContext);

	// console.log("trackDB", state)

	const getSynthIDs = () => {
		return Object.keys(state).filter(key => state[key].type == "synth")
	}

	const getAudioIDs = () => {
		return Object.keys(state).filter(key => state[key].type == "audio")
	}

	const getSamplerIDs = () => {
		return Object.keys(state).filter(key => state[key].type == "sampler")
	}

	const addNewSynth = async (stateID) => {
		const id = uniqid()

		const newSynth = {
			...presets[0],
			name: "Untitled",
			id: id,
			controls: {
				...defaultControls
			},
			steps: defaultSteps,
			effects: {
				...defaultEffects

			},
			// clips: {}
		}

		const newState = {
			...state, [id]: {...newSynth,}
		}

		setState(newState)

		await db.transaction('rw', db.tracks, db.states, () => {
			db.tracks.add(newSynth)
			db.states.where("id").equals(stateID).modify(x => x.tracks.push(id))
		})

	}

	const addNewSampler = async (stateID, pack) => {
		const id = uniqid()
		const instruments = {}
		
		if(pack === "random"){
			const keys = ["kick", "clap", "hihat", "openhat", "snare", "tom", "crash"]
			const extras = ["perc", "ride", "shaker"]
			keys.push(extras[Math.floor(Math.random() * extras.length)])

			for(const key of keys){
				const i = await db.samples.where("sample_type").equals(key).toArray()
				instruments[key] = i[Math.floor(Math.random() * i.length)].source
			}

		} else {

			const sample_data = await db.samples.where("pack").startsWith(pack).toArray()
			let counter = 1;
			
			for (const sample of sample_data) {
				if ([sample.sample_type] in instruments){
					instruments[`${sample.sample_type}_${counter}`] = sample.source
					counter +=1;
				} else {

					instruments[sample.sample_type] = sample.source
				}
			}
		}
		
		const newSampler = {
			id: id,
			type: "sampler",
			name: toTitleCase(pack),
			controls: {
				...defaultControls
			},
			subdivision: 8,
			instruments: instruments,
			steps: new Array(Object.keys(instruments).length).fill(null).map(() => new Array(8).fill(false)),
			effects: {
				...defaultEffects
			},
			filter: {
				wet: 0,
				cutoff: 0,
				type: "highpass",
			},
			// clips: {}
		}

		const newState = {
			...state, [id]: { ...newSampler, }
		}

		setState(newState)

		await db.transaction('rw', db.tracks, db.states, () => {
			db.tracks.add(newSampler)
			db.states.where("id").equals(stateID).modify(x => x.tracks.push(id))
		}).catch(console.error)

	}

	const addNewAudio = async (file, stateID) => {
		// const blob = new Blob(file, { type: file.type });
		const id = uniqid()

		const newAudio = {
			id: id,
			type: "audio",
			name: file.name.split(".")[0],
			file: file,
			source: URL.createObjectURL(file),
			controls: {
				...defaultControls
			},
			effects: {
				...defaultEffects

			}
		}

		const newState = {
			...state, [id]: { ...newAudio, }
		}

		setState(newState)

		await db.transaction('rw', db.tracks, db.states, () => {
			db.tracks.add(newAudio)
			db.states.where("id").equals(stateID).modify(x => x.tracks.push(id))
		})
	}

	const deleteTrack = async (id, stateID) => {
		const newState = {...state}
		delete newState[id]
		setState(newState)

		await db.transaction('rw', db.tracks, db.states, async () => {
			db.tracks.where("id").equals(id).delete()

			const oldTracks = await db.states.where("id").equals(stateID).first()
			const newTracks = oldTracks.tracks.filter(item => item !== id)

			db.states.update(stateID, { tracks: newTracks })
		})

	}

	const save = async (newState) => {
		await db.transaction('rw', db.tracks, db.states, () => {
			db.states.update(newState.id, {
				bpm: newState.bpm,
				vol: newState.vol,
				name: newState.name,
			})
			db.tracks.bulkPut(Object.values(state))
		})

	}

	return {
		synths: getSynthIDs(),
		audios: getAudioIDs(),
		samplers: getSamplerIDs(),
		addNewSynth,
		addNewAudio,
		addNewSampler,
		deleteTrack,
		save,
	}

}

export default useTrackDB;