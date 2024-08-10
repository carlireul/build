import { useContext } from 'react';
import { TrackContext } from "./TrackContext";
import { Note, Scale } from "tonal"; 


const useTrack = (id, type) => {
	const [state, setState] = useContext(TrackContext);

	const mute = () => {
		const newState = { ...state, [id]: { ...state[id], controls: { ...state[id].controls, muted: !state[id].controls.muted } } }
		setState(newState);
	}

	const changeVol = (value) => {
		const newState = { ...state, [id]: { ...state[id], controls: { ...state[id].controls, vol: value } } }
		setState(newState);
	}

	const changePan = (value) => {
		const newState = { ...state, [id]: { ...state[id], controls: { ...state[id].controls, pan: value } } }
		setState(newState);	}

	const centrePan = () => {
		const newState = { ...state, [id]: { ...state[id], controls: { ...state[id].controls, pan: 0 } } }
		setState(newState);	}

	const toggleSolo = () => {
		const newState = { ...state, [id]: { ...state[id], controls: { ...state[id].controls, solod: !state[id].controls.solod } } }
		setState(newState);	}

	const increaseOctave = () => {
		if (state[id].notes.octave < 7) {
			const newState = { ...state, [id]: { ...state[id], notes: { ...state[id].notes, octave: state[id].notes.octave + 1 } } }
			setState(newState);		}
	}

	const decreaseOctave = () => {
		if (state[id].notes.octave > 1) {
			const newState = { ...state, [id]: { ...state[id], notes: { ...state[id].notes, octave: state[id].notes.octave - 1 } } }
			setState(newState);		}
	}

	const changeScale = (value) => {
		const newState = { ...state, [id]: { ...state[id], notes: { ...state[id].notes, scale: value } } }
		setState(newState);	}

	const getNotes = () => {
		if(type == "synth"){
			const notes = Scale.get(state[id].notes.scale).notes.map(Note.simplify)
			return notes.map(note => `${note}${state[id].notes.octave}`)

		} else if (type == "sampler"){
			return Object.keys(state[id].instruments)

		}
	}

	const getSteps = (subdivision) => {
		return new Array(getNotes().length).fill(null).map(() => new Array(subdivision).fill(false))
	}

	const changeSubdivision = (value) => {
		let newState;
		if(type ==="synth"){

			newState = { ...state, [id]: { ...state[id], notes: { ...state[id].notes, subdivision: parseInt(value) }, steps: getSteps(parseInt(value)) } }

		} else if (type === "sampler"){
			newState = { ...state, [id]: { ...state[id], subdivision: parseInt(value), steps: getSteps(parseInt(value)) } }
		}
		setState(newState);
	}

	const changeEnvelope = (envelope) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, envelope: envelope } } }
		setState(newState);
	}

	const changeAttack = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, envelope: { ...state[id].synth.envelope, attack: parseFloat(value) } } } }
		setState(newState);	}

	const changeDecay = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, envelope: { ...state[id].synth.envelope, decay: parseFloat(value) } } } }
		setState(newState);	}

	const changeSustain = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, envelope: { ...state[id].synth.envelope, sustain: parseFloat(value) } } } }
		setState(newState);	}

	const changeRelease = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, envelope: { ...state[id].synth.envelope, release: parseFloat(value) } } } }
		setState(newState);	}

	const toggleFilter = () => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, filter: { ...state[id].synth.filter, wet: state[id].synth.filter.wet == 0 ? 1 : 0 } } } }
		setState(newState);
	}

	const changeFilterType = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, filter: { ...state[id].synth.filter, type: value } } } }
		setState(newState);	}

	const changeFilterRate = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, filter: { ...state[id].synth.filter, rate: value } } } }
		setState(newState);
	}

	const changeCutoff = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, filter: { ...state[id].synth.filter, cutoff: parseFloat(value) } } } }
		setState(newState);	}

	const changeWaveType = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, oscillator: { ...state[id].synth.oscillator, type: value } } } }
		setState(newState);
	}

	const toggleNote = (noteIndex, stepIndex) => {
		const newSteps = state[id].steps.slice()
		newSteps[noteIndex][stepIndex] = !newSteps[noteIndex][stepIndex]
		setState({...state, [id]: {...state[id], steps: newSteps}})
	}

	// const getClipIDs = () => {
	// 	return Object.keys(state[id].clips)
	// }

	// const getClipSources = (clipID) => {
	// 	if(clipID === "all"){

	// 		const sources = {}
	// 		for (let [key, value] of Object.entries(state[id].clips)){
	// 			sources[key] = value.source
	// 		}
	// 		return sources
	// 	} else {
	// 		return state[id].clips[clipID].source
	// 	}
		

	// }

	// const addClip = (clip) => {
	// 	const file = audioBufferToBlob(clip)

	// 	const newClip = {
	// 		file: file,
	// 		source: URL.createObjectURL(file),
	// 		enabled: false,
	// 		position: "0:0:0"
	// 	}

	// 	const newClips = { ...state[id].clips, [uniqid()]: {...newClip}}
	// 	const newState = {... state, [id]: {...state[id], clips: newClips}}
	// 	setState(newState)
	// }

	// const toggleClip = (clipID) => {
	// 	const newClips = { ...state[id].clips, [clipID]: { ...state[id].clips[clipID], enabled: !state[id].clips[clipID].enabled } }
	// 	const newState = { ...state, [id]: { ...state[id], clips: newClips } }
	// 	setState(newState)
	// }

	// const changeClipPosition = (clipID, newPosition) => {
	// 	const newClips = { ...state[id].clips, [clipID]: { ...state[id].clips[clipID], position: newPosition } }
	// 	const newState = { ...state, [id]: { ...state[id], clips: newClips } }
	// 	setState(newState)
	// }

	// const deleteClip = (clipID) => {
	// 	const newClips = state[id].clips
	// 	delete newClips[clipID]

	// 	const newState = { ...state, [id]: { ...state[id], clips: newClips } }
	// 	setState(newState)

	// }
	
	const rename = (value) => {
		const newState = {... state, [id]: {...state[id], name: value}}
		setState(newState)
	}

	const getEffectNames = () => {
		return Object.keys(state[id].effects)
	}


	const toggleEffect = (effect) => {
		const newState = { ...state, [id]: { ...state[id], effects: { ...state[id].effects, [effect]: { ...state[id].effects[effect], enabled: !state[id].effects[effect].enabled }}}}
		// console.log("toggled effect", newState[id].effects)
		setState(newState)

	}

	const modifyEffect = (name, value) => {
		const effect = name.split("-")[0]
		const option = name.split("-")[1]

		const newState = { ...state, [id]: { ...state[id], effects: { ...state[id].effects, [effect]: { ...state[id].effects[effect], options: {...state[id].effects[effect].options, [option]: parseFloat(value) } } } } }
		// console.log(newState[id].effects[effect].options)
		setState(newState)
	}
	
	// console.log("track", state)

	if (type === "synth") {
		return {
			mute,
			changeVol,
			changePan,
			centrePan,
			toggleSolo,
			increaseOctave,
			decreaseOctave,
			changeScale,
			changeEnvelope,
			changeAttack,
			changeDecay,
			changeSustain,
			changeRelease,
			toggleFilter,
			changeFilterType,
			changeCutoff,
			changeFilterRate,
			changeWaveType,
			toggleNote,
			changeSubdivision,
			rename,
			// addClip,
			// deleteClip,
			// getClipSources,
			// toggleClip,
			// changeClipPosition,
			name: state[id].name,
			muted: state[id].controls.muted,
			vol: state[id].controls.vol,
			pan: state[id].controls.pan,
			solod: state[id].controls.solod,
			octave: state[id].notes.octave,
			scale: state[id].notes.scale,
			notes: getNotes(),
			subdivision: state[id].notes.subdivision,
			envelope: state[id].synth.envelope,
			oscillator: state[id].synth.oscillator,
			filter: state[id].synth.filter,
			steps: state[id].steps,
			effects: state[id].effects,
			// clips: state[id].clips,
			// clipIDs: getClipIDs(),
		}
	} else if (type === "audio") {
		return {
			mute,
			changeVol,
			changePan,
			centrePan,
			toggleSolo,
			rename,
			name: state[id].name,
			source: state[id].source,
			muted: state[id].controls.muted,
			vol: state[id].controls.vol,
			pan: state[id].controls.pan,
			solod: state[id].controls.solod,
			effects: state[id].effects,
		}
	} else if (type === "sampler"){
		return {
			mute,
			changeVol,
			changePan,
			centrePan,
			toggleSolo,
			changeSubdivision,
			rename,
			toggleNote,
			// addClip,
			// deleteClip,
			// getClipSources,
			// toggleClip,
			// changeClipPosition,
			name: state[id].name,
			muted: state[id].controls.muted,
			vol: state[id].controls.vol,
			pan: state[id].controls.pan,
			solod: state[id].controls.solod,
			subdivision: state[id].subdivision,
			steps: state[id].steps,
			instruments: state[id].instruments,
			notes: getNotes(),
			effects: state[id].effects,
			filter: state[id].filter,
			// clips: state[id].clips,
			// clipIDs: getClipIDs(),
			}
		} else if (type == "controls"){
			return {
			mute,
			changeVol,
			changePan,
			centrePan,
			toggleSolo,
			muted: state[id].controls.muted,
			vol: state[id].controls.vol,
			pan: state[id].controls.pan,
			solod: state[id].controls.solod,
			}
		} else if (type === "effects"){
			return {
				chorus: state[id].effects.chorus,
				distortion: state[id].effects.distortion,
				phaser: state[id].effects.phaser,
				reverb: state[id].effects.reverb,
				delay: state[id].effects.delay,
				effects: getEffectNames(),
				toggleEffect: toggleEffect,
				modifyEffect: modifyEffect
			}
		}
	

};

export default useTrack;