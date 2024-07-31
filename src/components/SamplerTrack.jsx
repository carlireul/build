import { useState, useEffect, useRef } from 'react';
import { getBeat } from '../services/helpers'

import * as Tone from "tone";

import useTrack from './useTrack'
import TrackControls from './TrackControls';
import SamplerTab from './SamplerTab';

const SamplerTrack = ({id, addTab, deleteTrack}) => {

	const trackContext = useTrack(id, "sampler")

	const [loaded, setLoaded] = useState(false)
	const [title, setTitle] = useState(trackContext.name ? trackContext.name : "Untitled")

	const sampler = useRef();
	const controls = useRef();
	const notesArray = useRef(new Array(trackContext.subdivision).fill(null).map(() => []))
	const playSchedule = useRef(0)

	useEffect(() => { // set up: controls, transport schedule

		controls.current = new Tone.Channel(trackContext.vol, trackContext.pan).toDestination();

		sampler.current = new Tone.Players(trackContext.instruments, () => {
			sampler.current.connect(controls.current)
			setLoaded(true)
			// console.log(sampler.current)
		})

		return () => {
			sampler.current.disconnect()
			sampler.current.dispose()
			controls.current.disconnect()
			controls.current.dispose()
		}
	}, [])

	useEffect(() => {

		const triggerAttack = (keys, time) => {
			keys.forEach(key => {
				if (!sampler.current.has(key)) {
					console.warn(`key ${key} not found for playback`);
					return;
				}
				const player = sampler.current.player(key);
				player.start(time);
			})
		}


		const schedule = (time) => { // useRef if need to edit (note length etc)

			console.log(getBeat(Tone.getTransport().position, trackContext.subdivision), notesArray.current[getBeat(Tone.getTransport().position, trackContext.subdivision)])

			triggerAttack(notesArray.current[getBeat(Tone.getTransport().position, trackContext.subdivision)], time)
		
		}

		playSchedule.current = Tone.getTransport().scheduleRepeat(schedule,
			`${trackContext.subdivision}n`, // repetition interval
			"0:0:0") // start time

		return () => {
			Tone.getTransport().clear(playSchedule.current)
		}

	}, [trackContext.subdivision])

	useEffect(() => { // update the array of samples to play when active pads are changed

		notesArray.current = new Array(trackContext.subdivision).fill(null).map(() => []) // reset the notes array

		trackContext.steps.forEach((line, i) => {
			line.forEach((pad, j) => {
				if (pad) {
					notesArray.current[j].push(trackContext.notes[i])
				}
			})
		})

		console.log(notesArray.current)

	}, [trackContext.steps, trackContext.subdivision])

	useEffect(() => {
		controls.current.solo = trackContext.solod;
		controls.current.volume.value = trackContext.vol;
		controls.current.pan.value = trackContext.pan;
		controls.current.mute = trackContext.muted;
	}, [trackContext.solod, trackContext.vol, trackContext.pan, trackContext.muted])

	return (
		<div className="track-container">
			<div className="track-timeline-synth">
			</div>
			<div className="track-controls">
				<button className="track-tab-button" onClick={() => addTab({
					id: id,
					title: title,
					content: <SamplerTab id={id} />
				})
				}>
					<i className="fa-solid fa-wave-square"></i>
				</button> <input type="text" value={title} onChange={(e) => {
					trackContext.rename(e.target.value)
					setTitle(e.target.value)
				}} />
				<button className="close-track-button" onClick={() => deleteTrack(id)}> <i className="fa-solid fa-xmark"></i></button>
				{loaded ? <TrackControls id={id} /> : null}
			</div>
		</div>

	)

}

export default SamplerTrack