import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";
import SynthLine from './SynthLine';

function SynthTrack(){

	const notes = ["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"];
	const count = 8;

	return(
		<>
			{notes.map((note, i) => {return <SynthLine key={i} note={note} count={count}/>})}
		</>
	)

}

export default SynthTrack