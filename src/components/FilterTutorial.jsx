import { useState, useRef, useEffect } from 'react'
import useTrack from './useTrack';

import { toTitleCase } from '../services/helpers';
import { SineWaveGenerator } from '../services/sine-wave-generator';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import * as Tone from "tone"

const FilterTutorial = ({id}) => {

	const trackContext = useTrack(id, "filterTutorial")

	const [show, setShow] = useState(false)
	const [showText, setShowText] = useState(true)
	const [oldFilter, setOldFilter] = useState(trackContext.filter)

	const canvasRef1 = useRef(null)
	const canvasRef2 = useRef()
	const sineWavesGenerator = useRef()

	const handleShow = () => {
		setOldFilter(trackContext.filter)
		setShow(true)

	};

	const setup = () => {
		const canvas = canvasRef2.current;
		sineWavesGenerator.current = new SineWaveGenerator({ el: canvas });

		sineWavesGenerator.current.addWave({
			amplitude: 33,
			wavelength: (1 / parseInt(Tone.Frequency(trackContext.filter.rate).toFrequency())),
			strokeStyle: "rgba(255,255,255,0.2)",
			speed: 0.5,
		});
		sineWavesGenerator.current.start()
	}

	const cleanup = () => {
		sineWavesGenerator.current.stop();
		sineWavesGenerator.current.removeWave(0);
		setShow(false)
	}

	const reset = () => {
		trackContext.changeFilter(oldFilter)
	}

	useEffect(() => {

		if (canvasRef1.current) {
			const canvas = canvasRef1.current
			const context = canvas.getContext('2d')


			const draw = (ctx) => {
				let cutoffPoint = trackContext.filter.cutoff / 10
				let angle = trackContext.filter.rolloff == - 24 ? 10 : 50
				const height = canvas.height / 2

				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
				ctx.beginPath()

				if(trackContext.filter.type == "highpass"){

					ctx.moveTo(cutoffPoint - angle, canvas.height)
					ctx.arcTo(cutoffPoint, height, ctx.canvas.width, height + 10, 30)
					ctx.lineTo(ctx.canvas.width, height)
				} else if (trackContext.filter.type == "lowpass"){
					ctx.moveTo(cutoffPoint + angle, canvas.height)
					
					ctx.arcTo(cutoffPoint > 50 ? cutoffPoint : 0 + cutoffPoint, height, 0, height, 30)

					
					ctx.lineTo(0, height)
				}

				ctx.stroke()
				
			} 

			draw(context)
		}

	}, [show, trackContext.filter])

	

	useEffect(() => {
		if (sineWavesGenerator.current) {
			sineWavesGenerator.current.waves[0].wavelength = (1 / parseInt(Tone.Frequency(trackContext.filter.rate).toFrequency()))
		}

	}, [trackContext.filter.rate])

	return <div>
		<Button variant="info" onClick={handleShow}>
			<i className="fa-solid fa-magnifying-glass"></i>
		</Button>

		<Modal scrollable={true} size="lg" show={show} onShow={setup} onHide={cleanup}>
			<Modal.Header>
				<div className="container">
					<div className="row row-cols-auto justify-content-between">
						<div className="col">

							<h2>Autofilter</h2>
						</div>
						<div className="col">
							<div className="row row-cols-auto">
								<button className="track-button" onClick={trackContext.toggleSolo}>{trackContext.solod ? <i className="fa-solid fa-headphones" style={{ color: "#74C0FC" }}></i> : <i className="fa-solid fa-headphones"></i>}</button>
								<button className="btn btn-secondary" onClick={() => setShowText(prev => !prev)}>{showText ? "Hide" : "Show"} Text</button>
								<Button variant="secondary" onClick={reset}>Reset</Button>
								<Button variant="secondary" onClick={cleanup}>X</Button>
							</div>

						</div>
					</div>
				</div>
			</Modal.Header>

			<Modal.Body>
				<canvas height="200" width="300" ref={canvasRef1} />
				<canvas ref={canvasRef2}/>
				<div className="row justify-content-md-left g-3">
					
					<div className="col col-auto">
						Cutoff
					</div>
					<div className="col col-4">
						<input className="form-range" type="range" id="cutoff" name="cutoff" min="0" max="2000" step="1" value={trackContext.filter.cutoff} onChange={(e) => trackContext.changeCutoff(e.target.value)}></input>
					</div>


				</div>
				<div className="row">
					<div className="col col-auto">
						<button className="btn btn-primary" onClick={trackContext.toggleFilter}>{trackContext.filter.wet == 1 ? "Disable" : "Enable"} Filter</button>
					</div>
					<div className="col-auto">
						<div className="dropdown">
							<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
								Filter Type: {toTitleCase(trackContext.filter.type)}
							</button>
							<ul className="dropdown-menu">
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterType("highpass")}>Highpass</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterType("lowpass")}>Lowpass</a></li>
							</ul>
						</div>
					</div>
					<div className="col-auto">
						<div className="dropdown">
							<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
								Rolloff: {trackContext.filter.rolloff}
							</button>
							<ul className="dropdown-menu">
								<li><a className="dropdown-item" onClick={() => trackContext.changeRollOff(-12)}>-12</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.changeRollOff(-24)}>-24</a></li>
							</ul>
						</div>

					</div>
					<div className="col-auto">
						<div className="dropdown">
							<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
								LFO Rate: {trackContext.filter.rate == 0 ? "Off" : `1/${trackContext.filter.rate.split("n")[0]}`}
							</button>
							<ul className="dropdown-menu">
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterRate(0)}>Off</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterRate("2n")}>2</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterRate("4n")}>4</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterRate("8n")}>8</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterRate("16n")}>16</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterRate("32n")}>32</a></li>
							</ul>
						</div>
					</div>
					
				</div>

				{ showText ? 
					<div>
						<p>Filters are used to cut out certain frequencies of a sound.</p>
						<p>A <b>highpass</b> filter only lets through frequencies <b>above</b> the cutoff. A <b>lowpass</b> filter only lets through frequencies <b>below</b> the cutoff. The graph above shows what frequencies are let through the filter. Frequencies outside the curve are filtered out.</p>
						<p>You can change the <b>rolloff</b> (measured in dB) to control how quickly the sound tapers off at the cutoff point.</p>
						<p>An Autofilter is a filter hooked up to an LFO (<b>low-frequency oscillator</b>). The LFO modulates frequencies around the cutoff point to create a wobbly effect. The rate of this filter's LFO is synced to the beat of the track. The animation shows the rate of the LFO sine wave.</p>
						<p><b>Tips:</b>
							<ul>
								<li>You can use the filter on all wave types, but it will have a less pronounced effect on sine waves.</li>
								<li>Play around with extreme cutoff values and different LFO rates and see how it affects the sound.</li>
								<li>You can use a filter on drums and audio files too, but the LFO has no effect.</li>
							</ul>
						</p>
					</div>
					:
					null }

			</Modal.Body>

		</Modal>
	</div>
}

export default FilterTutorial