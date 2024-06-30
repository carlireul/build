import { useState, useEffect, useRef } from 'react';
import uniqid from 'uniqid';
import * as Tone from "tone";
import { tracks } from '../data/tracks';
import { synths } from '../data/synths'
import AudioTrack from './AudioTrack';
import SynthTrack from './SynthTrack';
import GlobalControls from './GlobalControls';

function Sequencer(){

	const [playing, setPlaying] = useState(false);
	const [audioTracks, setAudioTracks] = useState(null);
	const [synthTracks, setSynthTracks] = useState(null);

	const [selectedCount, setSelectedCount] = useState(8);
	const [selectedScale, setSelectedScale] = useState("C major")

	useEffect(() => {
		const defaultAudioTracks = [
			{
				id: tracks[0].id,
				source: tracks[0].src,
				title: tracks[0].title
			},
			{
				id: tracks[1].id,
				source: tracks[1].src,
				title: tracks[1].title
			}
		]
		setAudioTracks(defaultAudioTracks)

		// const defaultSynthTracks = [{ id: uniqid(), scale: "C major", count: 8, octave: 4}];
		setSynthTracks(synths);
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

	const handleStop = () => {
		Tone.getTransport().stop();
		setPlaying(false);
	}

	const newSynthTrack = () => {
		const newTrack = { id: uniqid(), scale: "D minor", count: selectedCount, octave: 4 }
		setSynthTracks(prev => [...prev, newTrack]);
	}

	return(
		<>
		<GlobalControls />
			<button onClick={() => {handlePlay()}}>{playing ? "Pause" : "Play"}</button> <button onClick={handleStop}>Stop</button>
		{audioTracks ? audioTracks.map(track => (
				<AudioTrack key={track.id} id={track.id} source={track.source} title={track.title}/>
		)): "Loading..."}
		
		<select value={selectedCount} onChange={(e) => setSelectedCount(parseInt(e.target.value))}>
			<option value={2}>2</option>
			<option value={4}>4</option>
			<option value={8}>8</option>
			<option value={16}>16</option>
		</select>

		
		<button onClick={newSynthTrack}>+</button>
		{synthTracks ? synthTracks.map((track, i) => (
				<SynthTrack key={track.id} id={track.id} noteProperties={track.properties.notes} synthProperties={track.properties.synth} num={i}/>
		)) : "Loading..."}
		</>

	)
}

export default Sequencer