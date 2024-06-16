import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";

function SynthLine({note, count, controls}){
	const synth = new Tone.Synth().connect(controls);
	const [steps, setSteps] = useState(new Array(count).fill(false));

	const handleClick = (index) => {
		const newSteps = steps.slice()
		newSteps[index] = !newSteps[index]
		setSteps(newSteps)
	}
	const prevId = useRef();

	useEffect(() => {
		Tone.getTransport().clear(prevId.current);

		let beat = 0;

		const schedule = (time) => {

			let step = steps[beat];
			if (step) {
				synth.triggerAttackRelease(note, "8n", time);
			}

			beat = (beat + 1) % count;
		}
		
		prevId.current = Tone.getTransport().scheduleRepeat(schedule, "8n");
	}, [steps])


	return(
		<>
		<div>
			{steps.map((step, i) => {
				return <button key={i} onClick={() => {handleClick(i)}}>{step ? "on" : "off"}</button>
				})}
		</div>
		</>
	)

}

export default SynthLine;