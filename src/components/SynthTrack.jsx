import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";
import uniqid from 'uniqid';
import SynthTrackControls from './SynthTrackControls';
import SynthEditor from './SynthEditor';
import { Scale } from "tonal"; 
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'

function SynthTrack({id, noteProperties, synthProperties, num}){

	
	const [visible, setVisible] = useState(false);

	const [notes, setNotes] = useState(Scale.get(noteProperties.scale).notes)
	const [octave, setOctave] = useState(noteProperties.octave)
	
	const [steps, setSteps] = useState(new Array(notes.length).fill(null).map(() => new Array(noteProperties.count).fill(false)));

	const synth = useRef();
	const filter = useRef();
	const controls = useRef();

	useEffect(() => {
		controls.current = new Tone.Channel(-8, 0).toDestination();
		filter.current = new Tone.Filter(synthProperties.filter.cutoff, synthProperties.filter.type).connect(controls.current)
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

		}, [])

	const prevId = useRef();

	useEffect(() => {
		Tone.getTransport().clear(prevId.current);

		let beat = 0;

		const schedule = (time) => {

			const notesArray = []
			console.log(notesArray)

			steps.forEach((line, i) => {
				if(line[beat]){notesArray.push(`${notes[i]}${octave}`)}
			})

			console.log(notesArray)

			synth.current.triggerAttackRelease(notesArray, `${noteProperties.count}n`, time)

			beat = (beat + 1) % noteProperties.count;
		}

		prevId.current = Tone.getTransport().scheduleRepeat(schedule, `${noteProperties.count}n`);
	}, [steps, octave])
		
	const handleClick = () => {
		setVisible(!visible)
	}

	const toggleNote = (noteIndex, stepIndex) => {
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
					return <div key={uniqid()}>
						{steps[noteIndex].map((step, stepIndex) => {
							return <button key={uniqid()} onClick={() => toggleNote(noteIndex, stepIndex)}>{step ? "on" : "off"}</button>
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