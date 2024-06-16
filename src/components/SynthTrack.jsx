import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";
import SynthLine from './SynthLine';
import SynthTrackControls from './SynthTrackControls';
import { Scale } from "tonal"; 

function SynthTrack({id, scale, count}){

	
	const [visible, setVisible] = useState(false);

	const [notes, setNotes] = useState(null)
	const [octave, setOctave] = useState(4)
	const controls = useRef();

	useEffect(() => {
		controls.current = new Tone.Channel(-8, 0).toDestination();
		setNotes(Scale.get(scale).notes);
		}, [])
		
	const handleClick = () => {
		setVisible(!visible)
	}

	return(
		<> <h3>Track {id}</h3>
		<button onClick={handleClick}>Expand</button>
			{controls.current ?
			
				<div><SynthTrackControls controls={controls.current} setOctave={setOctave}/>
					{visible ? notes.map((note, i) => { return <SynthLine key={i} note={`${note}${octave}`} count={count} controls={controls.current}/> }) : null}
					</div>  : "Loading..."}
		</>
	)

}

export default SynthTrack