import { useState, useEffect, useRef } from 'react';

import * as Tone from "tone";

import AudioTrackControls from './AudioTrackControls';

import useTrack from './useTrack';

function AudioTrack({id, addTab}){
	const trackContext = useTrack(id, "audio")

	const [loaded, setLoaded] = useState(false);

	const player = useRef();
	const controls = useRef();

	useEffect(() => { // setup: load controls and player
		controls.current = new Tone.Channel(-8, 0).toDestination();

		trackContext.mute()

		player.current = new Tone.Player(trackContext.source, () => {
			player.current.sync().start(0); // puts in transport
			setLoaded(true)
		}).chain(controls.current);

	}, [])

	const tabContent = (
		<AudioTrackControls id={id} />
	)

	if (controls.current) {
		controls.current.solo = trackContext.solod;
		controls.current.volume.value = trackContext.vol;
		controls.current.pan.value = trackContext.pan;
		controls.current.mute = trackContext.muted;
	}

	return (
    <>
			<div className="track">
				{ loaded ? <>
					<span className="track-title" onClick={() => addTab({ id: id, title: trackContext.name, content: tabContent})}>
						{trackContext.name}
					</span>

					<AudioTrackControls id={id} />
				</>
				: "Loading Audio.." }
			</div>
	
	</>
	)
}

export default AudioTrack