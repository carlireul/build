import { useState, useEffect, useRef } from 'react';

import uniqid from 'uniqid';
import * as Tone from "tone";
import { Scale } from "tonal"; 

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'

import SynthTrackControls from './SynthTrackControls';
import SynthEditor from './SynthEditor';
import Sequencer from './Sequencer';

function SynthTrack({id, noteProperties, synthProperties, num, globalBeat, addTab}){

	const [scale, setScale] = useState(noteProperties.scale)
	const [notes, setNotes] = useState(Scale.get(scale).notes)
	const [octave, setOctave] = useState(noteProperties.octave)
	const [loaded, setLoaded] = useState(false)
	
	const [steps, setSteps] = useState(new Array(notes.length).fill(null).map(() => new Array(noteProperties.count).fill(false)));

	const synth = useRef();
	const filter = useRef();
	const controls = useRef();
	const notesArray = useRef(new Array(noteProperties.count).fill(null).map(() => []))

	useEffect(() => { // set up: controls, filter, polysynth, transport schedule

		controls.current = new Tone.Channel(-8, 0).toDestination();
		filter.current = new Tone.AutoFilter({wet: 0}).connect(controls.current)
		synth.current = new Tone.PolySynth().connect(filter.current);

		synth.current.set({
			envelope: {
				attack: synthProperties.envelope.attack,
				decay: synthProperties.envelope.decay,
				sustain: synthProperties.envelope.sustain,
				release: synthProperties.envelope.release,
			},
			oscillator: {
				type: synthProperties.oscillator.type
			},
		})

		const schedule = (time) => { // useRef if need to edit (note length etc)

			console.log(num, globalBeat.current, globalBeat.current % noteProperties.count, notesArray.current[globalBeat.current % noteProperties.count], time, Tone.getTransport().position)

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
					notesArray.current[j].push(`${notes[i]}${octave}`)
				}
			})
		})
		
	}, [steps, octave, notes])

	const tabContent = (
		<>
			<div id="synth-container">
				<div id="editor-container">
					<SynthEditor synth={synth.current} filter={filter.current} />
				</div>
				<div id="sequencer-container">
					<SynthTrackControls controls={controls.current} setOctave={setOctave} />
					<span>
						<select value={scale} onChange={(e) => {
							setScale(e.target.value)
							setNotes(Scale.get(e.target.value).notes)
						}}>
							<option value="C major">C Major</option>
							<option value="D major">D Major</option>
							<option value="E minor">E Minor</option>
							<option value="F# minor">F# Minor</option>
						</select>

					</span>

					<Sequencer notes={notes} steps={steps} octave={octave} setSteps={setSteps} />
					
				</div>
			</div>
			<div id="synth-bottom-container">
				<div>effects</div>
				<div>clips</div>
			</div>
				
		</>
	)


	return(
		<> 
			<h3><span className="track-title" onClick={() => addTab({id: id, title: `Loop ${num + 1}`, content:  tabContent})}>Loop {num + 1}</span></h3>
			
		</>
	)

}

export default SynthTrack