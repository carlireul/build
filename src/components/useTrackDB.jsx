import { useContext } from 'react';
import { TrackContext } from "./TrackContext";
import { presets } from '../data/synths';
import db from '../data/db';
import uniqid from "uniqid";

const useTrackDB = () => {
	const [state, setState] = useContext(TrackContext);

	console.log("trackDB", state)

	const getSynthIDs = () => {
		return Object.keys(state).filter(key => state[key].type == "synth")
	}

	const getAudioIDs = () => {
		return Object.keys(state).filter(key => state[key].type == "audio")
	}

	const addNewSynth = async () => {
		const id = uniqid()

		const newSynth = {
			...presets[0],
			name: "Untitled",
			id: id,
			controls: {
				muted: false,
				vol: -8,
				solod: false,
				pan: 0,
			},
			steps: new Array(7).fill(null).map(() => new Array(8).fill(false))
		}

		const newState = {
			...state, [id]: {...newSynth,}
		}

		setState(newState)

		await db.tracks.add(newSynth)
		console.log("success!")

	}

	const deleteTrack = async (id) => {
		const newState = {...state}
		delete newState[id]
		setState(newState)

		await db.tracks.where("id").equals(id).delete()
	}

	const save = async () => {

		await db.tracks.bulkPut(Object.values(state))
		// console.log("saved")
		// console.log(db.tracks.toArray())

	}

	return {
		synths: getSynthIDs(),
		audios: getAudioIDs(),
		addNewSynth,
		deleteTrack,
		save,
	}

}

export default useTrackDB;