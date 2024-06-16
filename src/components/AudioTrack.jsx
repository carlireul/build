import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";

function AudioTrack(id, audio){
	const player = useRef(null);

	useEffect(() => {
		player.current = new Tone.Player(audio.source, () => {
			console.log("loaded");
		}).toDestination();
		player.current.sync().start(0); // plays in transport
	}, [])

	return (
    <>
	<div>hi</div>
	</>
	)

}

export default AudioTrack