import { useState, useEffect, useRef } from 'react';

import * as Tone from "tone";

import SynthTrackControls from './SynthTrackControls';
import SynthTab from './SynthTab';

import useTrack from './useTrack'

function SynthTrack({id, noteProperties, num, globalBeat, addTab}){
	
	const trackContext = useTrack(id);

	const [loaded, setLoaded] = useState(false)
	
	const [steps, setSteps] = useState(new Array(trackContext.notes.length).fill(null).map(() => new Array(noteProperties.count).fill(false)));

	const synth = useRef();
	const filter = useRef();
	const controls = useRef();
	const notesArray = useRef(new Array(noteProperties.count).fill(null).map(() => []))


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

		const schedule = (time) => { // useRef if need to edit (note length etc)

			// console.log(num, globalBeat.current, globalBeat.current % noteProperties.count, notesArray.current[globalBeat.current % noteProperties.count], time, Tone.getTransport().position)

			synth.current.triggerAttackRelease(
				notesArray.current[globalBeat.current % noteProperties.count], // plays notes in notesArray at the current beat index
				`${noteProperties.count}n`, // duration of note
				time) // callback function keeps time

		}

		Tone.getTransport().scheduleRepeat(schedule,
			`${noteProperties.count}n`, // repetition interval
			"0:0:0") // start time

		setLoaded(true)

		}, [])


	useEffect(() => { // update the array of notes to play when octave or active pads are changed

		notesArray.current = new Array(noteProperties.count).fill(null).map(() => []) // reset the notes array

		steps.forEach((line, i) => {
			line.forEach((pad, j) => {
				if(pad){
					notesArray.current[j].push(trackContext.notes[i])
				}
			})
		})
		
	}, [steps, trackContext.octave, trackContext.notes])

	if (controls.current) {
		controls.current.solo = trackContext.solod;
		controls.current.volume.value = trackContext.vol;
		controls.current.pan.value = trackContext.pan;
		controls.current.mute = trackContext.muted;
	}



	return(
		<div className="track"> 
			<span className="track-title" onClick={() => addTab({
				id: id,
				title: `Loop ${num + 1}`,
				content:
					<SynthTab id={id} synth={synth.current} filter={filter.current} steps={steps} setSteps={setSteps}/>
					
			})}>Loop {num + 1}</span>
			{loaded ? <SynthTrackControls id={id} /> : null}
		</div>
	)

}

export default SynthTrack