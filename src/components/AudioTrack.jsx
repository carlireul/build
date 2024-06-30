import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";
import AudioTrackControls from './AudioTrackControls';

function AudioTrack({id, source, title}){
	const [loaded, setLoaded] = useState(false);
	const player = useRef();
	const controls = useRef();


	useEffect(() => {
		controls.current = new Tone.Channel(-8, 0).toDestination();

		player.current = new Tone.Player(source, () => {
			player.current.sync().start(0); // puts in transport
			setLoaded(true)
		}).chain(controls.current);

	}, [])

	return (
    <>
	<div>{loaded ? title : "Loading Audio.."}</div>
	<AudioTrackControls controls={controls.current}/>
	</>
	)

}

export default AudioTrack