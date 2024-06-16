import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";

const SynthTrackControls = ({controls}) => {
	const [muted, setMuted] = useState(true);
	const [vol, setVol] = useState(-8);
	const [pan, setPan] = useState(0);

	const mute = () => {
		setMuted(!muted);
		controls.mute = muted;
	}

	const changeVol = (value) => {
		setVol(value)
		console.log(vol)
		controls.volume.value = vol;
	}

	const changePan = (value) => {
		setPan(value)
		console.log(pan)
		controls.pan.value = pan;
	}

	const centrePan = () => {
		setPan(0)
		console.log(pan)
		controls.pan.value = pan;
	}

	return <>
	<div>
			<button onClick={mute}>Mute</button>
			Vol: <input type="range" id="vol" name="vol" min="-20" max="20" value={vol} onChange={(e) => changeVol(e.target.value)}></input>
			<button onClick={() => centrePan()}>Pan</button> <input type="range" id="vol" name="vol" min="-1" max="1" step="0.1" value={pan} onChange={(e) => changePan(e.target.value)}></input>
	</div>
	</>
}

export default SynthTrackControls