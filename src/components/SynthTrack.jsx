import { useState, useEffect, useRef } from 'react';
import uniqid from 'uniqid';
import * as Tone from "tone";
import SynthTrackControls from './SynthTrackControls';
import SynthEditor from './SynthEditor';
import { Scale } from "tonal"; 
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'

function SynthTrack({id, noteProperties, synthProperties, num, globalBeat}){
	
	const [visible, setVisible] = useState(false);

	const [notes, setNotes] = useState(Scale.get(noteProperties.scale).notes)
	const [octave, setOctave] = useState(noteProperties.octave)
	
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

			synth.current.triggerAttackRelease(
				notesArray.current[globalBeat.current % noteProperties.count], // plays notes in notesArray at the current beat index
				`${noteProperties.count}n`, // duration of note
				time) // callback function keeps time

			// console.log(num, globalBeat.current % noteProperties.count, notesArray.current[globalBeat.current % noteProperties.count], time, Tone.getTransport().position)

		}

		Tone.getTransport().scheduleRepeat(schedule,
			`${noteProperties.count}n`, // repetition interval
			"0:0:0") // start time

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
		
	}, [steps, octave])

	
	const handleClick = () => {
		setVisible(!visible)
	}

	const toggleNote = (noteIndex, stepIndex) => { // update steps 2d array when toggling buttons
		const newSteps = steps.slice()
		newSteps[noteIndex][stepIndex] = !newSteps[noteIndex][stepIndex]
		setSteps(newSteps)
	}


	return(
		<> 
		<h3>Loop {num+1}</h3>
		{controls.current ? <SynthTrackControls controls={controls.current} setOctave={setOctave} /> : null}
		<Tabs>
			<TabList>
				<Tab>Sequencer</Tab>
				<Tab>Editor</Tab>
			</TabList>

			<TabPanel forceRender={true}>
				<button onClick={handleClick}>Expand</button>
				{visible ? notes.map((note, noteIndex) => {
					return <div key={uniqid()}> <span>{`${note}${octave}`}</span>
						{steps[noteIndex].map((step, stepIndex) => {
							return <button style={step ? { color: "blue" } : null} key={uniqid()} onClick={() => toggleNote(noteIndex, stepIndex)}>{step ? "on" : "off"}</button>
							
						})}
					</div>
				}) : null}		
			</TabPanel>

			<TabPanel>
				<SynthEditor synth={synth.current} filter={filter.current} />
			</TabPanel>
		</Tabs>
		</>
	)

}

export default SynthTrack