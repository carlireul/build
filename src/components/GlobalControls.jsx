import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";

const GlobalControls = () => {

	const [bpm, setBpm] = useState(120)
	const [vol, setVol] = useState(-8)

	Tone.getTransport().bpm.value = bpm;
	Tone.getDestination().volume.value = vol;


	const changeBpm = (event) => {
		setBpm(event.target.value)
	}

	const changeVol = (event) => {
		setVol(event.target.value)
	}

	return (
		<>
		<div>
		Vol: <input type="range" id="vol" name="vol" min="-20" max="20" value={vol} onChange={changeVol}></input>
		BPM: {bpm} <input type="range" id="bpm" name="bpm" min="40" max="200" value={bpm} onChange={changeBpm}></input>
		</div>
		</>
	)
}

export default GlobalControls