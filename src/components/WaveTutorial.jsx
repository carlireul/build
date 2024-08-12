import { useEffect, useState, useRef } from 'react';
import Modal from 'react-bootstrap/Modal'

import { SineWaveGenerator } from '../services/sine-wave-generator';
import SawImgFile from '../data/img/saw.jpg'
import TriangleImgFile from '../data/img/triangle.jpg'
import SquareImgFile from '../data/img/square.jpg'

import * as Tone from "tone"

const WaveTutorial = () => {

	const [showTutorial, setShowTutorial] = useState(false)
	const [playing, setPlaying] = useState(false)
	const [amplitude, setAmplitude] = useState(-2)
	const [frequency, setFrequency] = useState(440)
	const synth = useRef()
	const solo = useRef()
	const canvasRef = useRef()
	const sineWavesGenerator = useRef()


	const setup = () => {
		solo.current = new Tone.Solo().toDestination()
		synth.current = new Tone.Synth().connect(solo.current)

		synth.current.set({
			envelope: {
				attack: 0,
				decay: 1,
				sustain: 1,
				release: 0.1,
			},
			oscillator: {
				type: "sine",
				volume: -2,
			},
		})

		const canvas = canvasRef.current;
		sineWavesGenerator.current = new SineWaveGenerator({ el: canvas });

		sineWavesGenerator.current.addWave({
			amplitude: (parseInt(amplitude) + 13) * 3,
			wavelength: (1 / parseInt(frequency)) * 30,
			strokeStyle: "rgba(255,255,255,0.2)",
			speed: 0.5,
		});

	}

	useEffect(() => {
		if (sineWavesGenerator.current){
			sineWavesGenerator.current.waves[0].amplitude = (parseInt(amplitude) + 13) * 3
			console.log("frequency", 1 / parseInt(frequency) )
			sineWavesGenerator.current.waves[0].wavelength = (1 / parseInt(frequency)) * 30
			console.log(sineWavesGenerator.current.waves[0].wavelength)
		}

	}, [amplitude, frequency])


	const cleanup = () => {
		stopPlay()
		sineWavesGenerator.current.removeWave(0);
		sineWavesGenerator.current.stop();
		solo.current.disconnect()
		solo.current.dispose()
		synth.current.disconnect()
		synth.current.dispose()
		setShowTutorial(false)
	}

	const toggleSine = () => {

		if(!playing){
			playWave("sine")
			setPlaying(true)
			sineWavesGenerator.current.start()
			
		} else if (playing){
			stopPlay()
			
		}

	}

	const playWave = (type) => {
		solo.current.solo = true
		synth.current.set({
			oscillator: {
				type: type
			}
		})
		synth.current.triggerAttack("C4")

	}

	const stopPlay = () => {
		synth.current.triggerRelease()
		solo.current.solo = false
		setPlaying(false)
		sineWavesGenerator.current.stop()
		
	}

	const modifyWave = (option, value) => {
		if(option == "amplitude"){
			synth.current.set({
				oscillator: {
					volume: parseInt(value)
				}
			})
		} else if (option == "frequency"){
			synth.current.set({
				frequency: parseInt(value)
			})
		}
	}

	return (
		<>
		<button className="btn btn-info" onClick={() => setShowTutorial(true)}><i className="fa-solid fa-magnifying-glass" ></i></button>
		<Modal size="lg" show={showTutorial} onShow={setup} onHide={cleanup}>
			<Modal.Header>
					<h3>Waves</h3>
			</Modal.Header>
			<Modal.Body>
				<p>Synthesisers create sound using repeated, oscillating signal <b>waves</b>. The speed (<b>frequency</b>), volume (<b>amplitude</b>) and shape (<b>waveform</b>) of the signal determine how it sounds. A wave that repeats more quickly has a higher frequency and therefore a higher pitch. The graphs below represent amplitude over time.</p>

				<canvas height={150} ref={canvasRef}></canvas>
				
				<button className="btn btn-primary" onClick={toggleSine}>
					{playing ?
						<i className="fa-solid fa-pause"></i>
						: <i className="fa-solid fa-play"></i>
					}
				</button> Click to play a sine wave. Frequencies are not to scale.
					<div style={{textAlign: "right"}}>
				Frequency: <input className="form-range" type="range" value={frequency} min="100" max="1000" step="10" onChange={(e) => {
					setFrequency(e.target.value)
					modifyWave("frequency", e.target.value)
				}}></input>
				Amplitude: <input className="form-range" type="range" value={amplitude} min="-12" max="5" step="1" onChange={(e) => {
					setAmplitude(e.target.value)
					modifyWave("amplitude", e.target.value)
				}}></input>

					</div>

					<p>A <b>sine wave</b> is the most basic kind of wave. It sounds smooth and clean because it only consists of one frequency. It's like the sound of a single whistled note or a tuning fork, but pure sine waves are rare in real life. Instead, most sounds consist of many sine waves oscillating at different frequencies. The lowest frequency is the <b>fundamental frequency</b> and this is the pitch we perceive the sound to be. All the other frequencies, called <b>partials</b>, combine to create the unique waveform and sound of the instrument or synthesizer.</p>
				
					<div className="container">
						<div className="row row-cols-3">
						<img src={SquareImgFile} className="object-fit-contain" height={90}></img>	
							<img src={TriangleImgFile} className="object-fit-contain" height={90} ></img>		
							<img src={SawImgFile} className="object-fit-contain" height={90}></img>	

						</div>
						<div className="row row-cols-3 justify-content-center">
							<div className="col">
								<button className="btn btn-primary" onMouseDown={() => playWave("square")} onMouseUp={stopPlay}><i className="fa-solid fa-play"></i></button> Click and hold to play.

							</div>
							<div className="col">
								<button className="btn btn-primary" onMouseDown={() => playWave("triangle")} onMouseUp={stopPlay}><i className="fa-solid fa-play"></i></button>

							</div>
							<div className="col">
								<button className="btn btn-primary" onMouseDown={() => playWave("sawtooth")} onMouseUp={stopPlay}><i className="fa-solid fa-play"></i></button>

							</div>
						</div>
						<div className="row row-cols-3">
					<p> A square wave sounds rich and buzzy.  Square waves contain <b>harmonics</b>, a special kind of partial tone which is a whole multiple of the fundamental frequency.</p>
					<p> A triangle wave has the same harmonics as a square wave, but they taper off as they get further away from the fundamental. It sounds clear and bright, somewhere in between a square wave and a sine wave.</p>
					<p> A sawtooth wave is the buzziest of the 4 and has plenty of rich partial tones. An interesting technique to use with saw waves is subtractive synthesis: starting with a noisy saw wave and filtering out certain frequencies.</p>

						</div>
					</div>
					
				
				
				

			</Modal.Body>

			<Modal.Footer>
				<button className="btn btn-secondary" onClick={cleanup}>X</button>
			</Modal.Footer>
		</Modal>
		</>
	)

}

export default WaveTutorial