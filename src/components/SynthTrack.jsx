import { useState, useEffect, useRef } from 'react';

import * as Tone from "tone";

import SynthTrackControls from './SynthTrackControls';
import SynthTab from './SynthTab';

import useTrack from './useTrack'

const SynthTrack = ({id, num, globalBeat, addTab}) => {
	
	const trackContext = useTrack(id, "synth");

	const [loaded, setLoaded] = useState(false)

	const beat = useRef(globalBeat)
	
	const [steps, setSteps] = useState(new Array(trackContext.notes.length).fill(null).map(() => new Array(trackContext.subdivision).fill(false)));

	const synth = useRef();
	const filter = useRef();
	const controls = useRef();
	const notesArray = useRef(new Array(trackContext.subdivision).fill(null).map(() => []))

	useEffect(() => { // set up: controls, filter, polysynth, transport schedule

		controls.current = new Tone.Channel(-8, 0).toDestination();
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

		Tone.getTransport().scheduleRepeat(time => {
			beat.current = beat.current + 0.5
		}, "8n", "0:0:0");

		const schedule = (time) => { // useRef if need to edit (note length etc)

			console.log(num, beat.current, beat.current % trackContext.subdivision, notesArray.current[beat.current % trackContext.subdivision], time, Tone.getTransport().position)

			synth.current.triggerAttackRelease(
				notesArray.current[beat.current % trackContext.subdivision], // plays notes in notesArray at the current beat index
				`${trackContext.subdivision}n`, // duration of note
				time) // callback function keeps time

		}

		Tone.getTransport().scheduleRepeat(schedule,
			`${trackContext.subdivision}n`, // repetition interval
			"0:0:0") // start time

		setLoaded(true)

		}, [])

	useEffect(() => {
		beat.current = globalBeat
		console.log("hiiiii")
	}, [globalBeat])


	useEffect(() => { // update the array of notes to play when octave or active pads are changed

		notesArray.current = new Array(trackContext.subdivision).fill(null).map(() => []) // reset the notes array

		steps.forEach((line, i) => {
			line.forEach((pad, j) => {
				if(pad){
					notesArray.current[j].push(trackContext.notes[i])
				}
			})
		})
		
	}, [steps, trackContext.octave, trackContext.notes])

	useEffect(() => {
		controls.current.solo = trackContext.solod;
		controls.current.volume.value = trackContext.vol;
		controls.current.pan.value = trackContext.pan;
		controls.current.mute = trackContext.muted;
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
			<span className="track-title" onClick={() => addTab({
				id: id,
				title: `Loop ${num+1}`,
				content: <SynthTab globalBeat={globalBeat} id={id} steps={steps} setSteps={setSteps}/>})
			}>
				Loop {num + 1}
			</span>
			{ loaded ? <SynthTrackControls id={id} /> : null }
		</div>
	)

}

export default SynthTrack