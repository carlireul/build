import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";
import uniqid from "uniqid";
import AudioTrackControls from './AudioTrackControls';

function AudioTrack({id, source, title, addTab}){
	const [loaded, setLoaded] = useState(false);
	const player = useRef();
	const controls = useRef();

	useEffect(() => { // setup: load controls and player
		controls.current = new Tone.Channel(-8, 0).toDestination();

		controls.current.mute = true; // for testing

		player.current = new Tone.Player(source, () => {
			player.current.sync().start(0); // puts in transport
			setLoaded(true)
		}).chain(controls.current);

	}, [])

	return (
    <>
			<div>{loaded ? <span className="track-title" onClick={() => addTab({ id: id, title: title, content: <AudioTrackControls controls={controls.current} /> })}>{title}</span> : "Loading Audio.."}</div>
	
	</>
	)
}

export default AudioTrack