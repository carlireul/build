import { useState, useEffect, useRef } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'

import { tracks } from '../data/tracks';
import { synths } from '../data/synths';

import * as Tone from "tone";
import uniqid from 'uniqid';

import AudioTrack from './AudioTrack';
import SynthTrack from './SynthTrack';
import GlobalControls from './GlobalControls';

function Workstation({addTab}){

	const globalBeat = useRef(0);
	const [playing, setPlaying] = useState(false);

	const [audioTracks, setAudioTracks] = useState(null);
	const [synthTracks, setSynthTracks] = useState(null);

	useEffect(() => { // set up: create audio + synth tracks, start global beat
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

		const defaultSynth = {id: uniqid(), ...synths[0]}
		setSynthTracks([defaultSynth]);

		Tone.getTransport().scheduleRepeat(time => {
			globalBeat.current = globalBeat.current + 0.5
		}, "8n", "0:0:0");
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
		const newTrack = {...synths[1] }
		setSynthTracks(prev => [...prev, newTrack]);
	}

	return(
		<div className="#sequencer">
		<GlobalControls />
		<button onClick={() => {handlePlay()}}>{playing ? "Pause" : "Play"}</button> <button onClick={handleStop}>Stop</button>
		
		{audioTracks ? audioTracks.map(track => (
				<AudioTrack key={track.id} id={track.id} source={track.source} title={track.title} addTab={addTab}/>
		)): "Loading..."}

		
		<button onClick={newSynthTrack}>+ Add Synth</button>
		
		{synthTracks ? synthTracks.map((track, i) => { return <SynthTrack key={track.id} id={track.id} noteProperties={track.properties.notes} synthProperties={track.properties.synth} num={i} globalBeat={globalBeat} addTab={addTab}/> }) : "Loading"}
			

		</ div>

	)
}

export default Workstation