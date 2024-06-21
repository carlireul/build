import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";

const AudioTrackControls = ({ controls }) => {
	const [muted, setMuted] = useState(true);
	const [vol, setVol] = useState(-8);
	const [pan, setPan] = useState(0);
	const [solod, setSolod] = useState(false);

	const mute = () => {
		setMuted(prev => !prev);
	}

	const changeVol = (value) => {
		setVol(value)
	}

	const changePan = (value) => {
		setPan(value)
	}

	const centrePan = () => {
		setPan(0)
	}

	const toggleSolo = () => {
		setSolod(prev => !prev);
	}

	if(controls){

		controls.solo = solod;
		controls.volume.value = vol;
		controls.pan.value = pan;
		controls.mute = muted;
	}

	return <>
		<div>
			<button onClick={toggleSolo}>Solo</button>
			<button onClick={mute}>{muted ? "Unmute" : "Mute"}</button>
			Vol: <input type="range" id="vol" name="vol" min="-20" max="20" value={vol} onChange={(e) => changeVol(e.target.value)}></input>
			<button onClick={() => centrePan()}>Pan</button> <input type="range" id="vol" name="vol" min="-1" max="1" step="0.1" value={pan} onChange={(e) => changePan(e.target.value)}></input>
		</div>
	</>
}

export default AudioTrackControls