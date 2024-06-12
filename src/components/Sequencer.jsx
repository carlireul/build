import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";
import { tracks } from '../data/tracks';
import AudioTrack from './AudioTrack';
import SynthTrack from './SynthTrack';

function Sequencer(){

	const [playing, setPlaying] = useState(false);
	const [audioTracks, setAudioTracks] = useState([]);
	const [synthTracks, setSynthTracks] = useState([]);

	useEffect(() => {
		const defaultAudioTracks = [
			{
				id: 1,
				audio: tracks[0].src
			},
			{
				id: 2,
				audio: tracks[1].src
			}
		]
		setAudioTracks(defaultAudioTracks)
	}, [])

	const handlePlay = () =>{
		if (Tone.getContext().state === "suspended"){
			Tone.start()
		}

		if(!playing){
			Tone.getTransport().start();
			setPlaying(true);
		} else {
			Tone.getTransport().pause();
			setPlaying(false);
		}

	}
	
	console.log(audioTracks)
	return(
		<>
			<button onClick={() => {handlePlay()}}>{playing ? "Pause" : "Play"}</button>
		{audioTracks.map(track => (
				<AudioTrack key={track.id} source={track.audio}/>
		))}
		<SynthTrack />
		</>

	)
}

export default Sequencer