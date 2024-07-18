import { useContext } from 'react';
import { TrackContext } from "./TrackContext";
import { Scale } from "tonal"; 

const useTrack = (id) => {
	const [state, setState] = useContext(TrackContext);
	console.log(id, state)

	function mute() {
		const newState = {...state, [id]: {...state[id], controls: {...state[id].controls, muted: !state[id].controls.muted}} }
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
		const newState = { ...state, [id]: { ...state[id], controls: { ...state[id].controls, vol: 0 } } }
		setState(newState);
	}

	const toggleSolo = () => {
		const newState = { ...state, [id]: { ...state[id], controls: { ...state[id].controls, solod: !state[id].controls.solod } } }
		setState(newState);
	}

	const increaseOctave = () => {
		if(state[id].notes.octave < 7){
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
		const newState = { ...state, [id]: { ...state[id], synth: { ...state[id].synth, envelope: {...state[id].synth.envelope, attack: parseFloat(value)} } } }
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

	// console.log(state)

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
		muted: state[id].controls.muted,
		vol: state[id].controls.vol,
		pan: state[id].controls.pan,
		solod: state[id].controls.solod,
		octave: state[id].notes.octave,
		scale: state[id].notes.scale,
		notes: getNotes(),
		envelope: state[id].synth.envelope,
		oscillator: state[id].synth.oscillator,
		filter: state[id].synth.filter,
	}

};

export default useTrack;