import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";
import SynthLine from './SynthLine';
import SynthTrackControls from './SynthTrackControls';

function SynthTrack(){

	const notes = ["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"];
	const count = 8;

	
	const controls = useRef();

	useEffect(() => {
		controls.current = new Tone.Channel(-8, 0).toDestination();
	}, [])

	return(
		<>
			{controls.current ?
			
				<div><SynthTrackControls controls={controls.current} />
					{notes.map((note, i) => { return <SynthLine key={i} note={note} count={count} controls={controls.current} /> })}</div>  : null}
		</>
	)

}

export default SynthTrack