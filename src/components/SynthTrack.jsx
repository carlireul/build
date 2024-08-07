import { useState, useEffect, useRef } from 'react';
import { getBeat, createEffect } from '../services/helpers'

import * as Tone from "tone";

import TrackControls from './TrackControls';
import SynthTab from './SynthTab';
import Renamable from './Renamable';

import useTrack from './useTrack'

const SynthTrack = ({id, addTab, deleteTrack}) => {
	
	const trackContext = useTrack(id, "synth");

	const [loaded, setLoaded] = useState(false)

	const [activeEffects, setActiveEffects] = useState({
		chorus: trackContext.effects.chorus.enabled,
		distortion: trackContext.effects.distortion.enabled,
		delay: trackContext.effects.delay.enabled,
		phaser: trackContext.effects.phaser.enabled,
		reverb: trackContext.effects.reverb.enabled,
	})


	const synth = useRef();
	const filter = useRef();
	const controls = useRef();
	const effectNodes = useRef({
		chorus: null,
		distortion: null,
		delay: null,
		phaser: null,
		reverb: null,
	})
	// const clipPlayer = useRef()
	const notesArray = useRef(new Array(trackContext.subdivision).fill(null).map(() => []))
	const playSchedule = useRef(0)


	useEffect(() => { // set up: controls, effects, filter, polysynth, clip player, transport schedule

		controls.current = new Tone.Channel(trackContext.vol, trackContext.pan);
		filter.current = new Tone.AutoFilter({wet: trackContext.filter.wet});

		for(const [effect, enabled] of Object.entries(activeEffects)){
			if(enabled){
				// console.log(effect, enabled)
				effectNodes.current[effect] = createEffect(effect, trackContext.effects[effect].options)
			}
		}

		synth.current = new Tone.PolySynth().chain(...Object.values(effectNodes.current).filter(e => e !== null) , filter.current, controls.current, Tone.getDestination());

		synth.current.set({
			envelope: {
				attack: trackContext.envelope.attack,
				decay: trackContext.envelope.decay,
				sustain: trackContext.envelope.sustain,
				release: trackContext.envelope.release,
			},
			oscillator: {
				type: trackContext.oscillator.type
			},
		})

		// clipPlayer.current = new Tone.Players(trackContext.getClipSources("all"), () => {
		// 	clipPlayer.current.chain(...Object.values(effectNodes.current).filter(e => e !== null), filter.current, controls.current, Tone.getDestination());
		// })
		// clipPlayer.current.debug = true;	
		// console.log(clipPlayer.current)
		setLoaded(true)

		return () => { // cleanup
			controls.current.disconnect()
			filter.current.disconnect()
			Object.values(effectNodes.current).forEach(effect => {if(effect) {effect.disconnect()}})
			synth.current.disconnect()
			controls.current.dispose()
			filter.current.dispose()
			Object.values(effectNodes.current).forEach(effect => { if (effect) { effect.dispose() } })
			synth.current.dispose()
			// clipPlayer.current.disconnect()
			// clipPlayer.current.dispose()
			console.log("disposed everything")
		}

		}, [])

	useEffect(() => {
		const schedule = (time) => { // useRef if need to edit (note length etc)

			console.log(time, Tone.getTransport().position, getBeat(Tone.getTransport().position, trackContext.subdivision), notesArray.current[getBeat(Tone.getTransport().position, trackContext.subdivision)])
			
			synth.current.triggerAttackRelease(
				notesArray.current[getBeat(Tone.getTransport().position, trackContext.subdivision)], // plays notes in notesArray at the current beat index
				`${trackContext.subdivision}n`, // duration of note
				time) // callback function keeps time
		}

		playSchedule.current = Tone.getTransport().scheduleRepeat(schedule,
			`${trackContext.subdivision}n`, // repetition interval
			"0:0:0") // start time

		return () => {
			Tone.getTransport().clear(playSchedule.current)
		}

	}, [trackContext.subdivision])

	useEffect(() => { // update the array of notes to play when octave or active pads are changed

		notesArray.current = new Array(trackContext.subdivision).fill(null).map(() => []) // reset the notes array

		trackContext.steps.forEach((line, i) => {
			line.forEach((pad, j) => {
				if(pad){
					notesArray.current[j].push(trackContext.notes[i])
				}
			})
		})
		
	}, [trackContext.steps, trackContext.octave, trackContext.notes, trackContext.subdivision])

	// useEffect(() => {

	// 	for(id of trackContext.clipIDs){

	// 		if(!clipPlayer.current.has(id)){
	// 			console.log("new clip")
	// 			const source = trackContext.getClipSources(id)
	// 			clipPlayer.current.add(id, source)
	// 			console.log(clipPlayer.current)
	// 		}
	// 	}

	// }, [trackContext.clipIDs])

	
	useEffect(() => {
		controls.current.solo = trackContext.solod;
		controls.current.volume.value = trackContext.vol;
		controls.current.pan.value = trackContext.pan;
		controls.current.mute = trackContext.muted;

	}, [trackContext.solod, trackContext.vol, trackContext.pan, trackContext.muted])

	// update the synth's properties when changed in UI
	const updateSynth = () => {
		// console.log(trackContext.envelope, trackContext.oscillator, trackContext.filter)
		if(synth.current){
			synth.current.set({
				envelope: {
					attack: trackContext.envelope.attack,
					decay: trackContext.envelope.decay,
					sustain: trackContext.envelope.sustain,
					release: trackContext.envelope.release,
				},
				oscillator: {
					type: trackContext.oscillator.type
				},
			})

			filter.current.set({
				wet: trackContext.filter.wet,
				baseFrequency: trackContext.filter.cutoff,
				filter: {
					type: trackContext.filter.type,
				},
			})
		}
	}
	useEffect(updateSynth, [trackContext.envelope, trackContext.filter, trackContext.oscillator])

	const updateEffect = (effect) => {
		// console.log("update effect")
		if(effectNodes.current[effect]){
			effectNodes.current[effect].set(trackContext.effects[effect].options)
		} 
		
		const newActiveEffects = {...activeEffects}
		newActiveEffects[effect] = trackContext.effects[effect].enabled
		setActiveEffects(newActiveEffects)


	}
	useEffect(() => { updateEffect("chorus") }, [trackContext.effects.chorus])
	useEffect(() => { updateEffect("distortion") }, [trackContext.effects.distortion])
	useEffect(() => { updateEffect("phaser") }, [trackContext.effects.phaser])
	useEffect(() => { updateEffect("delay") }, [trackContext.effects.delay])
	useEffect(() => { updateEffect("reverb") }, [trackContext.effects.reverb])
	// other effects

	useEffect(() => {

		for (const [effect, enabled] of Object.entries(activeEffects)) {
			if (enabled && !effectNodes.current[effect]) {
				// console.log("created", effect)
				effectNodes.current[effect] = createEffect(effect, trackContext.effects[effect].options)
			} if (!enabled && effectNodes.current[effect]){
					effectNodes.current[effect].disconnect()
					effectNodes.current[effect].dispose()
					effectNodes.current[effect] = null;
				// console.log("disposed", effect)
			}
		}
		// console.log(effectNodes.current)

		synth.current.disconnect()
		synth.current.chain(...Object.values(effectNodes.current).filter(e => e !== null), filter.current, controls.current, Tone.getDestination());

	}, [activeEffects])

	// const recordClip = () => {
	// 	Tone.Offline(({ transport }) => {
	// 		const controls = new Tone.Channel(trackContext.vol, trackContext.pan).toDestination();
	// 		const filter = new Tone.AutoFilter({ wet: trackContext.filter.wet });

	// 		const effectNodes = {}

	// 		for (const [effect, enabled] of Object.entries(activeEffects)) {
	// 			if (enabled) {
	// 				// console.log(effect, enabled)
	// 				effectNodes[effect] = createEffect(effect, trackContext.effects[effect].options)
	// 			}
	// 		}

	// 		const synth = new Tone.PolySynth().chain(...Object.values(effectNodes).filter(e => e !== null), filter, controls);

	// 		synth.set({
	// 			envelope: {
	// 				attack: trackContext.envelope.attack,
	// 				decay: trackContext.envelope.decay,
	// 				sustain: trackContext.envelope.sustain,
	// 				release: trackContext.envelope.release,
	// 			},
	// 			oscillator: {
	// 				type: trackContext.oscillator.type
	// 			},
	// 		})

	// 		const schedule = (time) => {

	// 			// console.log(getBeat(Tone.transport.position, trackContext.subdivision), notesArray.current[getBeat(transport.position, trackContext.subdivision)])

	// 			synth.triggerAttackRelease(
	// 				notesArray.current[getBeat(transport.position, trackContext.subdivision)], // plays notes in notesArray at the current beat index
	// 				`${trackContext.subdivision}n`, // duration of note
	// 				time) // callback function keeps time
	// 		}

	// 	transport.scheduleRepeat(schedule,
	// 			`${trackContext.subdivision}n`, // repetition interval
	// 			"0:0:0") // start time

	// 	transport.start(0)
			
	// 	}, 2) // ! variable length
	// 	.then((buffer) => {
	// 		// do something with the output buffer
	// 		console.log(buffer._buffer)
	// 		trackContext.addClip(buffer._buffer)
	// 	});

	// }

	return(
		<div className="track-container pb-2"> 
			<div className="track-timeline-synth">
				{/* <div className="clip-container">
					{trackContext.clipIDs.map((key) => {
						return <div key={key}>
							<button className="btn btn-secondary"  onClick={() => trackContext.toggleClip(key)}>{trackContext.clips[key].enabled ? "Disable" : "Enable"}</button> <button onClick={() => trackContext.changeClipPosition(key, "2:0:0")}>Change to 2:0:0</button>
						</div>
					})}
				</div> */}
			</div>
			<div className="container track-controls">
				<div className="row row-cols-lg-auto g-1 align-items-center">
					<button className="track-button" onClick={() => addTab({
						id: id,
						title: trackContext.name,
						content: <SynthTab id={id} />
					})
					}>
						<i className="fa-solid fa-wave-square"></i>
					</button>

					<Renamable name={trackContext.name ? trackContext.name : "Untitled"} handler={trackContext.rename}>
						<button className="track-button" onClick={() => deleteTrack(id)}> <i className="fa-solid fa-xmark"></i></button>
					</Renamable>
						
				</div>
				{loaded ? <TrackControls id={id} /> : null}
			</div>
		</div>
	)

}

export default SynthTrack