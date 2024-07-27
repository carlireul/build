import { useState, useEffect, useRef } from 'react';
import { getBeat } from '../services/helpers'

import * as Tone from "tone";

import SynthTrackControls from './SynthTrackControls';
import SynthTab from './SynthTab';

import useTrack from './useTrack'
const SynthTrack = ({id, addTab, deleteTrack}) => {
	
	const trackContext = useTrack(id, "synth");

	const [loaded, setLoaded] = useState(false)
	const [title, setTitle] = useState(trackContext.name ? trackContext.name : "Untitled")

	const synth = useRef();
	const filter = useRef();
	const controls = useRef();
	const notesArray = useRef(new Array(trackContext.subdivision).fill(null).map(() => []))
	const playSchedule = useRef(0)

	useEffect(() => { // set up: controls, filter, polysynth, transport schedule

		controls.current = new Tone.Channel(trackContext.vol, trackContext.pan).toDestination();
		filter.current = new Tone.AutoFilter({wet: trackContext.filter.wet}).connect(controls.current)
		synth.current = new Tone.PolySynth().connect(filter.current);

		synth.current.set({
			envelope: {
				attack: trackContext.envelope.attack,
				decay: trackContext.envelope.decay,
				sustain: trackContext.envelope.sustain,
				release: trackContext.envelope.release,
			},
			oscillator: {
				type: trackContext.oscillator.type
			},
		})
	
		setLoaded(true)

		return () => { // cleanup
			controls.current.disconnect()
			filter.current.disconnect()
			synth.current.disconnect()
			controls.current.dispose()
			filter.current.dispose()
			synth.current.dispose()
		}

		}, [])

	useEffect(() => {
		const schedule = (time) => { // useRef if need to edit (note length etc)

			console.log(getBeat(Tone.getTransport().position, trackContext.subdivision), notesArray.current[getBeat(Tone.getTransport().position, trackContext.subdivision)])

			synth.current.triggerAttackRelease(
				notesArray.current[getBeat(Tone.getTransport().position, trackContext.subdivision)], // plays notes in notesArray at the current beat index
				`${trackContext.subdivision}n`, // duration of note
				time) // callback function keeps time
		}

		playSchedule.current = Tone.getTransport().scheduleRepeat(schedule,
			`${trackContext.subdivision}n`, // repetition interval
			"0:0:0") // start time

		return () => {
			Tone.getTransport().clear(playSchedule.current)
		}

	}, [trackContext.subdivision])

	useEffect(() => { // update the array of notes to play when octave or active pads are changed

		notesArray.current = new Array(trackContext.subdivision).fill(null).map(() => []) // reset the notes array

		trackContext.steps.forEach((line, i) => {
			line.forEach((pad, j) => {
				if(pad){
					notesArray.current[j].push(trackContext.notes[i])
				}
			})
		})
		
	}, [trackContext.steps, trackContext.octave, trackContext.notes, trackContext.subdivision])

	useEffect(() => {
		controls.current.solo = trackContext.solod;
		controls.current.volume.value = trackContext.vol;
		controls.current.pan.value = trackContext.pan;
		controls.current.mute = trackContext.muted;

		return () => {
			if(controls.current){
				controls.current.disconnect()
				controls.current.dispose()
			}
		}
	}, [trackContext.solod, trackContext.vol, trackContext.pan, trackContext.muted])

	// update the synth's properties when changed in UI
	const updateSynth = () => {
		// console.log(trackContext.envelope, trackContext.oscillator, trackContext.filter)
		if(synth.current){
			synth.current.set({
				envelope: {
					attack: trackContext.envelope.attack,
					decay: trackContext.envelope.decay,
					sustain: trackContext.envelope.sustain,
					release: trackContext.envelope.release,
				},
				oscillator: {
					type: trackContext.oscillator.type
				},
			})

			filter.current.set({
				wet: trackContext.filter.wet,
				baseFrequency: trackContext.filter.cutoff,
				filter: {
					type: trackContext.filter.type,
				},
			})
		}
	}
	useEffect(updateSynth, [trackContext.envelope, trackContext.filter, trackContext.oscillator])

	return(
		<div className="track"> 
			<button className="track-tab-button" onClick={() => addTab({
				id: id,
				title: title,
				content: <SynthTab id={id} />})
			}>
			<i className="fa-solid fa-wave-square"></i>
			</button> <input type="text" value={title} onChange={(e) => {
				trackContext.rename(e.target.value)
				setTitle(e.target.value)
			}} />
			<button className="close-track-button" onClick={() => deleteTrack(id)}> <i className="fa-solid fa-xmark"></i></button>
			{ loaded ? <SynthTrackControls id={id} /> : null }
		</div>
	)

}

export default SynthTrack