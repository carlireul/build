import { useState, useEffect, useRef } from 'react';
import { getBeat, createEffect } from '../services/helpers'

import * as Tone from "tone";

import useTrack from './useTrack'
import TrackControls from './TrackControls';
import SamplerTab from './SamplerTab';
import Renamable from './Renamable'

const SamplerTrack = ({id, addTab, deleteTrack}) => {

	const trackContext = useTrack(id, "sampler")

	const [loaded, setLoaded] = useState(false)
	const [drawIndex, setDrawIndex] = useState(0)
	
	const [activeEffects, setActiveEffects] = useState({
		distortion: trackContext.effects.distortion.enabled,
		delay: trackContext.effects.delay.enabled,
		phaser: trackContext.effects.phaser.enabled,
		reverb: trackContext.effects.reverb.enabled,
	})

	const sampler = useRef();
	const filter = useRef();
	const controls = useRef();
	const effectNodes = useRef({
		distortion: null,
		delay: null,
		phaser: null,
		reverb: null,
	})
	const notesArray = useRef(new Array(trackContext.subdivision).fill(null).map(() => []))

	useEffect(() => { // set up: controls, transport schedule

		controls.current = new Tone.Channel(trackContext.vol, trackContext.pan);
		filter.current = new Tone.AutoFilter({ wet: trackContext.filter.wet });

		for (const [effect, enabled] of Object.entries(activeEffects)) {
			if (enabled) {
				// console.log(effect, enabled)
				effectNodes.current[effect] = createEffect(effect, trackContext.effects[effect].options)
			}
		}

		sampler.current = new Tone.Players(trackContext.instruments, () => {
			sampler.current.chain(...Object.values(effectNodes.current).filter(e => e !== null), filter.current, controls.current, Tone.getDestination());
			setLoaded(true)
			// console.log(sampler.current)
		})

		return () => {
			sampler.current.disconnect()
			sampler.current.dispose()
			Object.values(effectNodes.current).forEach(effect => { if (effect) { effect.disconnect() } })
			Object.values(effectNodes.current).forEach(effect => { if (effect) { effect.dispose() } })
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

			// console.log(getBeat(Tone.getTransport().position, trackContext.subdivision), notesArray.current[getBeat(Tone.getTransport().position, trackContext.subdivision)])
			setDrawIndex(getBeat(Tone.getTransport().position, trackContext.subdivision))
			triggerAttack(notesArray.current[getBeat(Tone.getTransport().position, trackContext.subdivision)], time)
		
		}

		const playSchedule = Tone.getTransport().scheduleRepeat(schedule,
			`${trackContext.subdivision}n`, // repetition interval
			"0:0:0") // start time

		const drawSchedule = Tone.getTransport().scheduleRepeat(() => {
			setDrawIndex(getBeat(Tone.getTransport().position, 16))
		}, "16n", "0:0:0")

		return () => {
			Tone.getTransport().clear(playSchedule)
			Tone.getTransport().clear(drawSchedule)
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

		// console.log(notesArray.current)

	}, [trackContext.steps, trackContext.subdivision])

	useEffect(() => {
		controls.current.solo = trackContext.solod;
		controls.current.volume.value = trackContext.vol;
		controls.current.pan.value = trackContext.pan;
		controls.current.mute = trackContext.muted;
	}, [trackContext.solod, trackContext.vol, trackContext.pan, trackContext.muted])

	const updateEffect = (effect) => {
		// console.log("update effect")
		if (effectNodes.current[effect]) {
			effectNodes.current[effect].set(trackContext.effects[effect].options)
		}

		const newActiveEffects = { ...activeEffects }
		newActiveEffects[effect] = trackContext.effects[effect].enabled
		setActiveEffects(newActiveEffects)


	}
	useEffect(() => { updateEffect("distortion") }, [trackContext.effects.distortion])
	useEffect(() => { updateEffect("phaser") }, [trackContext.effects.phaser])
	useEffect(() => { updateEffect("delay") }, [trackContext.effects.delay])
	useEffect(() => { updateEffect("reverb") }, [trackContext.effects.reverb])
	

	useEffect(() => {

		for (const [effect, enabled] of Object.entries(activeEffects)) {
			if (enabled && !effectNodes.current[effect]) {
				// console.log("created", effect)
				effectNodes.current[effect] = createEffect(effect, trackContext.effects[effect].options)
			} if (!enabled && effectNodes.current[effect]) {
				effectNodes.current[effect].disconnect()
				effectNodes.current[effect].dispose()
				effectNodes.current[effect] = null;
				// console.log("disposed", effect)
			}
		}
		// console.log(effectNodes.current)

		sampler.current.disconnect()
		sampler.current.chain(...Object.values(effectNodes.current).filter(e => e !== null), filter.current, controls.current, Tone.getDestination());

	}, [activeEffects])

	useEffect(() => {
		filter.current.set({
			wet: trackContext.filter.wet,
			baseFrequency: trackContext.filter.cutoff,
			frequency: trackContext.filter.rate,
		})
		console.log(trackContext.filter.rate)

		filter.current.filter.set({
			type: trackContext.filter.type,
			rolloff: trackContext.filter.rolloff,
		},
		)
	}, [trackContext.filter])

	const [buttons, setButtons] = useState()

	useEffect(() => {

		const arr = []

		for (let i = 0; i < 16; i++) {
			let buttonClass = "timeline-button"

			if (i % 4 == 0) {
				buttonClass += " sequencer-beat"
			}
			if (trackContext.subdivision == 16) {
				if (notesArray.current[i].length > 0) {
					buttonClass += " sequencer-active"
				}
			}
			else if (trackContext.subdivision == 8 && i % 2 == 0) {
				if (notesArray.current[i / 2].length > 0) {
					buttonClass += " sequencer-active"
				}
			} else if (trackContext.subdivision == 4 && i % 4 == 0) {
				if (notesArray.current[i / 4].length > 0) {
					buttonClass += " sequencer-active"
				}
			}

			arr.push(buttonClass)
		}

		setButtons(arr)

	}, [trackContext.subdivision, trackContext.steps])

	return (
		<div className="track-container">
			<div className="track-timeline-synth">
				<div className="container">
					<div className="d-flex flex-row  justify-content-evenly	">

						{buttons ? buttons.map((button, index) => {
							let buttonClass = button
							if (index == drawIndex) {
								buttonClass += " sequencer-playing"
							}
							return <div className="flex-fill" key={`${index}-visual`}>
								<button className={buttonClass} disabled></button>
							</div>

						}) : null}
					</div>
				</div>
			</div>

			<div className="container row-cols-lg-auto track-controls">
				<div className="row row-cols-lg-auto g-1 align-items-center">
					<a
						data-tooltip-id="tooltip"
						data-tooltip-content="Open Editor"
					>
					<button className="track-button" onClick={() => addTab({
						id: id,
						title: trackContext.name,
						content: <SamplerTab id={id} />
					})
					}>
							<i className="fa-solid fa-drum"></i>
					</button>
							</a>

					<Renamable name={trackContext.name ? trackContext.name : "Untitled"} handler={trackContext.rename}>
						<a
							data-tooltip-id="tooltip"
							data-tooltip-content="Delete Track"
						>
							<button className="track-button" onClick={() => deleteTrack(id)}> <i className="fa-solid fa-xmark"></i></button>
							</a>
					</Renamable>

				</div>
				{loaded ? <TrackControls id={id} /> : null}
			</div>
		</div>

	)

}

export default SamplerTrack