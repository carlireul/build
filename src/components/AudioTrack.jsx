import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";
import AudioTrackControls from './AudioTrackControls';
import Waveform from './Waveform';

function AudioTrack({id, source, title}){
	const [loaded, setLoaded] = useState(false);
	const player = useRef();
	const controls = useRef();


	useEffect(() => {
		controls.current = new Tone.Channel(-8, 0).toDestination();

		player.current = new Tone.Player(source, () => {
			player.current.sync().start(0); // puts in transport
			setLoaded(true)
		}).connect(controls.current);

	}, [])

	return (
    <>
	<AudioTrackControls controls={controls.current}/>
	<div>{loaded ? title: "Loading Audio.."}</div>
	</>
	)

}

export default AudioTrack