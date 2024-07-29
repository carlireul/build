import { useEffect, useState, useRef } from 'react';
import * as Tone from "tone";

const GlobalControls = ({savedState}) => {
	
	const [playing, setPlaying] = useState(false);
	const [bpm, setBpm] = useState(savedState.bpm)
	const [vol, setVol] = useState(savedState.vol)
	const [volStyle, setVolStyle] = useState("fa-solid fa-volume-low")

	Tone.getTransport().bpm.value = bpm;
	Tone.getDestination().volume.value = vol;

	const changeBpm = (event) => {
		setBpm(event.target.value)
	}

	const changeVol = (event) => {
		setVol(event.target.value)
		if(event.target.value == -20){
			setVolStyle("fa-solid fa-volume-off")
		} else if(event.target.value <= 7){
			setVolStyle("fa-solid fa-volume-low")
		} else if(event.target.value >= 8){
			setVolStyle("fa-solid fa-volume-high")
		}
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
		Tone.getTransport().position = "0:0:0"
		setPlaying(false);
	}

	return (
		<>
		<div className="playhead">

		</div>
		<div className="global-controls">
				<button onClick={() => { handlePlay() }}>{playing ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}</button> <button onClick={handleStop}><i className="fa-solid fa-stop"></i></button>
				<i className={volStyle}></i> <input type="range" id="vol" name="vol" min="-20" max="20" value={vol} onChange={changeVol}></input>
		BPM: {bpm} <input type="range" id="bpm" name="bpm" min="40" max="200" value={bpm} onChange={changeBpm}></input>
		</div>
		</>
	)
}

export default GlobalControls