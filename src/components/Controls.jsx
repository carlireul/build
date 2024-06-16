import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";

const Controls = () => {

	const [bpm, setBpm] = useState(120)

	Tone.getTransport().bpm.value = bpm;

	const handleChange = (event) => {
		setBpm(event.target.value)

	}

	return (
		<>
		<div>

		BPM: {bpm} <input type="range" id="bpm" name="bpm" min="40" max="200" value={bpm} onChange={handleChange}></input>
		</div>
		</>
	)
}

export default Controls