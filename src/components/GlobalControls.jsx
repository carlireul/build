import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";

const GlobalControls = () => {

	const [playing, setPlaying] = useState(false);
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

	const handlePlay = () => {
		if (Tone.getContext().state === "suspended") {
			Tone.start()
		}

		if (!playing) {
			Tone.getTransport().start();
			setPlaying(true);
		} else {
			Tone.getTransport().pause();
			setPlaying(false);
		}
	}

	const handleStop = () => {
		Tone.getTransport().stop();
		setPlaying(false);
	}

	return (
		<>
		<div>
		<button onClick={() => { handlePlay() }}>{playing ? "Pause" : "Play"}</button> <button onClick={handleStop}>Stop</button>
		Vol: <input type="range" id="vol" name="vol" min="-20" max="20" value={vol} onChange={changeVol}></input>
		BPM: {bpm} <input type="range" id="bpm" name="bpm" min="40" max="200" value={bpm} onChange={changeBpm}></input>
		</div>
		</>
	)
}

export default GlobalControls