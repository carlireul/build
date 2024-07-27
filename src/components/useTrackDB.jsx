import { useContext } from 'react';
import { TrackContext } from "./TrackContext";
import { presets } from '../data/synths';
import db from '../data/db';
import uniqid from "uniqid";

const useTrackDB = () => {
	const [state, setState] = useContext(TrackContext);

	// console.log("trackDB", state)

	const getSynthIDs = () => {
		return Object.keys(state).filter(key => state[key].type == "synth")
	}

	const getAudioIDs = () => {
		return Object.keys(state).filter(key => state[key].type == "audio")
	}

	const defaultControls = {
		muted: false,
		vol: -8,
		solod: false,
		pan: 0,
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
			steps: new Array(7).fill(null).map(() => new Array(8).fill(false))
		}

		const newState = {
			...state, [id]: {...newSynth,}
		}

		setState(newState)

		await db.transaction('rw', db.tracks, db.states, () => {
			db.tracks.add(newSynth)
			db.states.where("id").equals(stateID).modify(x => x.tracks.push(id))
		})
		console.log("success!")

	}

	const addNewAudio = async (file, stateID) => {
		// const blob = new Blob(file, { type: file.type });
		const id = uniqid()

		const newAudio = {
			id: id,
			type: "audio",
			name: file.name, // strip extension
			file: file,
			source: URL.createObjectURL(file),
			controls: {
				...defaultControls
			},
		}

		console.log(newAudio)


		const newState = {
			...state, [id]: { ...newAudio, }
		}

		setState(newState)

		await db.transaction('rw', db.tracks, db.states, () => {
			db.tracks.add(newAudio)
			db.states.where("id").equals(stateID).modify(x => x.tracks.push(id))
		})
		console.log("success!")
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

		console.log("delete success")
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
		console.log("saved")

	}

	return {
		synths: getSynthIDs(),
		audios: getAudioIDs(),
		addNewSynth,
		addNewAudio,
		deleteTrack,
		save,
	}

}

export default useTrackDB;