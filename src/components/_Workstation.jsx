import { useState, useEffect, useRef } from 'react';

import { tracks } from '../data/audio';
import { synths } from '../data/synths';

import * as Tone from "tone";

import { TrackProvider } from './TrackContext';
import AudioTrack from './AudioTrack';
import SynthTrack from './SynthTrack';

function Workstation({addTab}){

	const globalBeat = useRef(0);

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
		setSynthTracks([...synths[0]]);

		Tone.getTransport().scheduleRepeat(time => {
			globalBeat.current = globalBeat.current + 0.5
		}, "8n", "0:0:0");
	}, [])

	const newSynthTrack = () => {
		const newTrack = {...synths[1] }
		setSynthTracks(prev => [...prev, newTrack]);
	}

	return(
	<div className="sequencer">
	
		{audioTracks ? audioTracks.map(track => (
			<AudioTrack key={track.id} id={track.id} source={track.source} title={track.title} addTab={addTab}/>
			))
		: "Loading..."}

		
		<button onClick={newSynthTrack}>+ Add Synth</button>
		
		{synthTracks ? synthTracks.map((track, i) => (
			<TrackProvider key={`provider${track.id}`}>
				<SynthTrack key={track.id} id={track.id} noteProperties={track.notes} num={i} globalBeat={globalBeat} addTab={addTab}/>
			</TrackProvider>
			))
		: "Loading"}

	</div>
	)
}

export default Workstation