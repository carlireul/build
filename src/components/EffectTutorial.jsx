import { useState, useRef } from 'react';
import Modal from 'react-bootstrap/Modal'
import reverbFile from '../data/audio/reverb.mp3'
import delayFile from '../data/audio/delay.mp3'
import eqFile from '../data/audio/eq.mp3'
import noeqFile from '../data/audio/no_eq.mp3'
import distortionFile from '../data/audio/distortion.mp3'

import * as Tone from "tone";

const EffectTutorial = () => {

	const [showTutorial, setShowTutorial] = useState(false)
	const [playing, setPlaying] = useState({
		reverb: false,
		delay: false,
		eq: false,
		noeq: false,
		distortion: false,
	})
	const player = useRef()
	const solo = useRef()

	const setup = () => {
		setShowTutorial(true)
		solo.current = new Tone.Solo().toDestination()
		player.current = new Tone.Players({
			reverb: reverbFile,
			delay: delayFile,
			eq: eqFile,
			noeq: noeqFile,
			distortion: distortionFile,

		}, () => {
			player.current.connect(solo.current)
		})
	}

	const cleanup = () => {
		solo.current.solo = false
		player.current.stopAll()
		player.current.disconnect()
		solo.current.disconnect()
		player.current.dispose()
		solo.current.dispose()

		setShowTutorial(false)

		const newPlaying = { ...playing }
		Object.keys(newPlaying).forEach(v => newPlaying[v] = false)
		setPlaying(newPlaying)

		console.log("disposed")
	}

	const togglePlay = (name) => {
		solo.current.solo = true
		const audio = player.current.player(name);

		if (playing[name]) {
			console.log("hi")
			audio.stop()
		} else {

			player.current.stopAll()

			setPlaying(prev => {
				const newPlaying = { ...prev }
				newPlaying[name] = true
				return newPlaying
			})

			audio.onstop = () => {
				setPlaying(prev => {
					const newPlaying = { ...prev }
					newPlaying[name] = false
					return newPlaying
				})
			}

			audio.start();
		}

	}

	return (
		<>
			<button className="btn btn-info" onClick={setup}><i className="fa-solid fa-magnifying-glass" ></i></button>
			<Modal scrollable={true} size="lg" show={showTutorial} onHide={cleanup}>
				<Modal.Header>
					<h3>EQ + Effects</h3>
				</Modal.Header>
				<Modal.Body>

					<p>
						Various effects are using by electronic music producers to alter the sound of synths and drums. It's common to separate an audio source into two channels: the <b>dry</b> channel has no effect applied, while the <b>wet</b> channel does, and these two are combined in different proportions. At 0% wet, the effect is ignored, and at 100% wet, only the channel with the effect applied is heard. Click the play buttons below to listen to a short clip, followed by the same clip with the effect applied.
					</p>

					<p>
						<button className="btn btn-primary" onClick={() => togglePlay("reverb")}>
							{playing.reverb ?
								<i className="fa-solid fa-pause"></i>
								: <i className="fa-solid fa-play"></i>
							}
						</button> <b>Reverb</b> simulates a sound reflecting off a surface and slowly decaying, like in a large hall or church.
					</p>
					
					<p>
						<button className="btn btn-primary" onClick={() => togglePlay("delay")}>
							{playing.delay ?
								<i className="fa-solid fa-pause"></i>
								: <i className="fa-solid fa-play"></i>
							}
						</button> <b>Delay</b> records an input and plays it back after a short period of time (usually synced to the beat). When mixed with the original signal it creates an echo effect, and when the delayed output is fed back in, it creates a repeated, decaying echo.
					</p>

					<p>
						<button className="btn btn-primary" onClick={() => togglePlay("distortion")}>
							{playing.distortion ?
								<i className="fa-solid fa-pause"></i>
								: <i className="fa-solid fa-play"></i>
							}
						</button> 
						<b> Distortion</b> modifies the waveform of an incoming signal to create an aggressive distorted effect, also commonly used on guitars in rock music.</p>

					<p><button className="btn btn-primary" onClick={() => togglePlay("noeq")}>
						{playing.noeq ?
							<i className="fa-solid fa-pause"></i>
							: <i className="fa-solid fa-play"></i>
						}<b> No EQ</b>
					</button>  
						<button className="btn btn-primary mx-1" onClick={() => togglePlay("eq")}>
							{playing.eq ?
								<i className="fa-solid fa-pause"></i>
								: <i className="fa-solid fa-play"></i>
							} <b> EQ</b>
						</button> 
						<b>EQ</b> lets you alter the gain (volume increase) of different frequency bands. This EQ uses 3 bands: low frequencies, mid frequencies and high frequencies. You can reduce or increase the volume of the individual channels to affect the overall sound of the track.</p>
					
				</Modal.Body>

				<Modal.Footer>
					<button className="btn btn-secondary" onClick={cleanup}>X</button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default EffectTutorial