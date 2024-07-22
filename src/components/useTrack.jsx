import { useContext, useEffect } from 'react';
import { TrackContext } from "./TrackContext";
import { Scale } from "tonal"; 
import { synths } from '../data/synths';
import { audio } from '../data/audio';

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
		setState(newState);
	}

	const centrePan = () => {
		const newState = { ...state, [id]: { ...state[id], controls: { ...state[id].controls, pan: 0 } } }
		setState(newState);
	}

	const toggleSolo = () => {
		const newState = { ...state, [id]: { ...state[id], controls: { ...state[id].controls, solod: !state[id].controls.solod } } }
		setState(newState);
	}

	const increaseOctave = () => {
		if (state[id].notes.octave < 7) {
			const newState = { ...state, [id]: { ...state[id], notes: { ...state[id].notes, octave: state[id].notes.octave + 1 } } }
			setState(newState)
		}
	}

	const decreaseOctave = () => {
		if (state[id].notes.octave > 1) {
			const newState = { ...state, [id]: { ...state[id], notes: { ...state[id].notes, octave: state[id].notes.octave - 1 } } }
			setState(newState)
		}
	}

	const changeScale = (value) => {
		const newState = { ...state, [id]: { ...state[id], notes: { ...state[id].notes, scale: value } } }
		setState(newState);
	}

	const getNotes = () => {
		const notes = Scale.get(state[id].notes.scale).notes
		return notes.map(note => `${note}${state[id].notes.octave}`)
		
	}

	const changeAttack = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, envelope: { ...state[id].synth.envelope, attack: parseFloat(value) } } } }
		setState(newState)
	}

	const changeDecay = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, envelope: { ...state[id].synth.envelope, decay: parseFloat(value) } } } }
		setState(newState)
	}

	const changeSustain = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, envelope: { ...state[id].synth.envelope, sustain: parseFloat(value) } } } }
		setState(newState)
	}

	const changeRelease = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, envelope: { ...state[id].synth.envelope, release: parseFloat(value) } } } }
		setState(newState)
	}

	const toggleFilter = () => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, filter: { ...state[id].synth.filter, wet: state[id].synth.filter.wet == 0 ? 1 : 0 } } } }
		setState(newState)

	}

	const changeFilterType = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, filter: { ...state[id].synth.filter, type: value } } } }
		setState(newState)
	}

	const changeCutoff = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, filter: { ...state[id].synth.filter, cutoff: parseFloat(value) } } } }
		setState(newState)
	}

	const changeWaveType = (value) => {
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, oscillator: { ...state[id].synth.oscillator, type: value } } } }
		setState(newState)

	}

	if (!([id] in state) && type == "synth") {
		const placeholder = {
			id: 0,
			name: "New Synth",
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
		}
		
		const newSynth = synths.find(obj => obj.id == id)
		const newState = {
			...state, [id]: {
				...newSynth, controls: {
					muted: false,
					vol: -8,
					solod: false,
					pan: 0,
				}
			}
		}

		setState(newState)

		return {
			mute,
			changeVol,
			changePan,
			centrePan,
			toggleSolo,
			increaseOctave,
			decreaseOctave,
			changeScale,
			changeAttack,
			changeDecay,
			changeSustain,
			changeRelease,
			toggleFilter,
			changeFilterType,
			changeCutoff,
			changeWaveType,
			name: placeholder.name,
			muted: placeholder.controls.muted,
			vol: placeholder.controls.vol,
			pan: placeholder.controls.pan,
			solod: placeholder.controls.solod,
			octave: placeholder.notes.octave,
			scale: placeholder.notes.scale,
			notes: Scale.get("C major").notes.map(note => `${note}${placeholder.notes.octave}`),
			subdivision: placeholder.notes.subdivision,
			envelope: placeholder.synth.envelope,
			oscillator: placeholder.synth.oscillator,
			filter: placeholder.synth.filter,
		}
	}
	

	// console.log(state)

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
			changeAttack,
			changeDecay,
			changeSustain,
			changeRelease,
			toggleFilter,
			changeFilterType,
			changeCutoff,
			changeWaveType,
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
		}
	} else if (type === "audio") {
		return {
			mute,
			changeVol,
			changePan,
			centrePan,
			toggleSolo,
			name: state[id].name,
			source: state[id].source,
			muted: state[id].controls.muted,
			vol: state[id].controls.vol,
			pan: state[id].controls.pan,
			solod: state[id].controls.solod,
		}
	}

	

	

};

export default useTrack;