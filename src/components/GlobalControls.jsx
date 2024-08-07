import { useEffect, useState, useRef } from 'react';
import Renamable from './Renamable';
import * as Tone from "tone";
import { convertWebmToMp3 } from '../services/helpers';

const GlobalControls = ({savedState}) => {
	
	const [playing, setPlaying] = useState(false);
	const [bpm, setBpm] = useState(savedState.bpm)
	const [vol, setVol] = useState(savedState.vol)
	const [volStyle, setVolStyle] = useState("fa-solid fa-volume-low")

	const [isRecording, setIsRecording] = useState(false)

	Tone.getTransport().bpm.value = bpm;
	Tone.getDestination().volume.value = vol;

	const changeBpm = (value) => {
		setBpm(value)
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

	const record = () => {
		if(playing){
			console.log("Cannot record while playing")
		} else {
			
			const recorder = new Tone.Recorder()
			Tone.getDestination().connect(recorder)
			
			const seconds = (Tone.Time(savedState.trackEnd).toSeconds() * 1000) * 4

			Tone.getTransport().position = "0:0:0"
			Tone.getTransport().loop = false;

			recorder.start()
			handlePlay()
			setIsRecording(true)

			setTimeout(async () => {
				const recording = await recorder.stop();
				setIsRecording(false)
				Tone.getTransport().loop = true;
				const mp3 = await convertWebmToMp3(recording)
				const url = URL.createObjectURL(mp3);
				const anchor = document.createElement("a");
				anchor.download = `${savedState.name}.mp3`;
				anchor.href = url;
				anchor.click();
				recorder.dispose()
				handlePlay()
			}, seconds);

		}
		
	}

	return (
		<div id="global-controls" className="row row-cols-lg-auto g-2 align-items-center">
			<div className="col-12">
				<button className="track-button" onClick={() => { handlePlay() }}>
					{playing ?
						<i className="fa-solid fa-pause"></i>
						: <i className="fa-solid fa-play"></i>
					}
				</button>
			</div>
			<div className="col-12">
				<button className="track-button" onClick={handleStop}><i className="fa-solid fa-stop"></i></button>
			</div>
			<div className="col-12">
				<div className="row row-cols-lg-auto g-2 align-items-center">
					<div className="col-12">
						<i className={volStyle}></i>
					</div>
					<div className="col-12">
						<input type="range" id="vol" className="form-range" name="vol" min="-20" max="20" value={vol} onChange={changeVol}></input>
					</div>
				</div>
			</div>
			<div className="col-12">
				<div className="row row-cols-lg-auto g-2 align-items-center">
					<div className="col-12">
						<Renamable name={bpm} handler={changeBpm} number={true} range={[40, 200]} />
						<a
							data-tooltip-id="tooltip"
							data-tooltip-content="Beats Per Minute"
						>&nbsp;BPM</a>
					</div>
					<div className="col-12">
						<input type="range" id="bpm" className="form-range" name="bpm" min="40" max="200" value={bpm} onChange={(e) => changeBpm(e.target.value)}></input> 
					</div>
				</div>
			</div>
			<div className="col-12">
				<button className="btn btn-secondary" onClick={record}>{isRecording ? "Recording..." : "Record"}</button>
			</div>

			

			

			
		</div>

	)
}

export default GlobalControls