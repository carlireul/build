import { useState, useEffect, useRef } from 'react';

import * as Tone from "tone";

import AudioTrackControls from './AudioTrackControls';

import useTrack from './useTrack';

function AudioTrack({id, addTab, deleteTrack}){
	const trackContext = useTrack(id, "audio")

	const [loaded, setLoaded] = useState(false);
	const [title, setTitle] = useState(trackContext.name)

	const player = useRef();
	const controls = useRef();

	useEffect(() => { // setup: load controls and player
		controls.current = new Tone.Channel(-8, 0).toDestination();

		trackContext.mute()

		player.current = new Tone.Player(trackContext.source, () => {
			player.current.sync().start(0); // puts in transport
			setLoaded(true)
		}).chain(controls.current);

		return () => { //cleanup
			controls.current.disconnect()
			player.current.disconnect()
			controls.current.dispose()
			player.current.dispose()

		}

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
					<button className="track-title" onClick={() => addTab({ id: id, title: title, content: tabContent})}>
						<i className="fa-solid fa-file-audio"></i>
					</button> <input type="text" value={title} onChange={(e) => {
						trackContext.rename(e.target.value)
						setTitle(e.target.value)
					}} /> <button className="close-track-button" onClick={() => deleteTrack(id)}> <i className="fa-solid fa-xmark"></i></button>

					<AudioTrackControls id={id} />
				</>
				: "Loading Audio.." }
			</div>
	
	</>
	)
}

export default AudioTrack