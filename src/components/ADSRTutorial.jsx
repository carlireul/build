import { useState, useRef, useEffect } from 'react'
import useTrack from './useTrack';
import Renamable from './Renamable';
import Visualizer from './Visualizer';

import attackImgFile from '../data/img/attack.png'
import decayImgFile from '../data/img/decay.png'
import sustainImgFile from '../data/img/sustain.png'
import releaseImgFile from '../data/img/release.png'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ADSRTutorial = ({id, meter}) => {

	const trackContext = useTrack(id, "synth")
	const [oldEnvelope, setOldEnvelope] = useState(trackContext.envelope)

	const [show, setShow] = useState(false)
	const [showText, setShowText] = useState(true)

	const canvasRef = useRef(null)

	const handleShow = () =>{
		setOldEnvelope(trackContext.envelope)
		setShow(true)

	};

	const attackImg = new Image();
	attackImg.src = attackImgFile;
	const decayImg = new Image();
	decayImg.src = decayImgFile;
	const sustainImg = new Image();
	sustainImg.src = sustainImgFile;
	const releaseImg = new Image();
	releaseImg.src = releaseImgFile;

	useEffect(() => {

		if(canvasRef.current){
			const canvas = canvasRef.current
			const context = canvas.getContext('2d')

			const width = {
				attack: (canvas.width / 4) * (trackContext.envelope.attack / 2),
				decay: (canvas.width / 4) * (trackContext.envelope.decay /2),
				sustain: (canvas.width / 4),
				release: (canvas.width / 4) * (trackContext.envelope.release / 5),
			}

			const draw = (ctx) => {
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
				ctx.fillStyle = '#dddddd'
				ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
				ctx.drawImage(attackImg, 0, 0, width.attack, ctx.canvas.height)
				ctx.drawImage(decayImg,
					0, 0,
					decayImg.width, 320,
					width.attack, 0,
					width.decay, ctx.canvas.height - (ctx.canvas.height / 2) * trackContext.envelope.sustain)
				ctx.drawImage(sustainImg,
					0, 272,
					width.sustain, 55,
					width.attack + width.decay, (ctx.canvas.height - (ctx.canvas.height / 2) * trackContext.envelope.sustain) - 25,
					width.sustain, 25)
				ctx.drawImage(releaseImg,
					0, 265,
					releaseImg.width, 213,
					width.attack + width.decay + width.sustain, (ctx.canvas.height - (ctx.canvas.height / 2) * trackContext.envelope.sustain) - 25,
					width.release, ctx.canvas.height - ((ctx.canvas.height - (ctx.canvas.height / 2) * trackContext.envelope.sustain) - 25))
			} // 272 * 327

			draw(context)
		}

	}, [show, trackContext.envelope])


	const reset = () => {
		trackContext.changeEnvelope(oldEnvelope)
	}

	return <div>

	<Button variant="info" onClick={handleShow}>
			<i className="fa-solid fa-magnifying-glass"></i>
      </Button>
	
		<Modal scrollable={true}  size="lg" show={show} onHide={() => {setShow(false)}}>
			<Modal.Header>
				<div className="container">
					<div className="row row-cols-auto justify-content-between">
						<div className="col">

					<h2>ADSR Envelope</h2>
						</div>
						<div className="col">
							<div className="row row-cols-auto">
								<button className="track-button" onClick={trackContext.toggleSolo}>{trackContext.solod ? <i className="fa-solid fa-headphones" style={{ color: "#74C0FC" }}></i> : <i className="fa-solid fa-headphones"></i>}</button>
								<button className="btn btn-secondary" onClick={() => setShowText(prev => !prev)}>{showText ? "Hide" : "Show"} Text</button>
								<Button variant="secondary" onClick={reset}>Reset</Button>
								<Button variant="secondary" onClick={() => setShow(prev => !prev)}>X</Button>
						</div>
						
						</div>
					</div>
				</div>
			</Modal.Header>

        <Modal.Body>
		<canvas height="200" width="600" ref={canvasRef} />
		<Visualizer meter={meter} />
          
		<div className="container">
		<div className="row">
						<div className="col">Attack 
							<Renamable number={true} range={[0, 2]} step={0.05} name={trackContext.envelope.attack} handler={trackContext.changeAttack} />
							<input className="form-range" type="range" id="attack" name="attack" min="0" max="2" step="0.05" value={trackContext.envelope.attack} onChange={(e) => trackContext.changeAttack(e.target.value)}></input></div>

						<div className="col">Decay 
							<Renamable number={true} range={[0.1, 2]} step={0.05} name={trackContext.envelope.decay} handler={trackContext.changeDecay} />
							<input className="form-range" type="range" id="decay" name="decay" min="0.1" max="2" step="0.05" value={trackContext.envelope.decay} onChange={(e) => trackContext.changeDecay(e.target.value)}></input></div>
 
						<div className="col">Sustain 
							<Renamable number={true} range={[0, 1]} step={0.05} name={trackContext.envelope.sustain} handler={trackContext.changeSustain} />
							<input className="form-range" type="range" id="sustain" name="sustain" min="0" max="1" step="0.05" value={trackContext.envelope.sustain} onChange={(e) => trackContext.changeSustain(e.target.value)}></input></div>

						<div className="col">Release 
							<Renamable number={true} range={[0, 5]} step={0.05} name={trackContext.envelope.release} handler={trackContext.changeRelease} />
							<input className="form-range" type="range" id="release" name="release" min="0" max="5" step="0.05" value={trackContext.envelope.release} onChange={(e) => trackContext.changeRelease(e.target.value)}></input></div>
		</div>
		
		

		
		{showText ?
			<>
				<p><b>Envelopes</b> control how a sound changes over time. ADSR is one kind of envelope that changes the volume (amplitude) of the synth when a key is pressed. The graph above shows the volume (Y axis) of the sound over time (X axis).</p>
				<p><b>Attack</b> controls how quickly a sound goes from silence to its loudest peak. A short Attack creates a quick, plucky sound. Longer Attacks create smooth, atmospheric sounds.</p>
				<p><b>Decay</b> and <b>Sustain</b> are closely linked. Sustain controls how loud a sound is after the initial peak, while the key is still held. Decay controls how quickly the sound reaches that Sustain volume. At max Sustain, there is no decrease after the Attack, so Decay does nothing. At a lower Sustain, the Decay can smoothen or sharpen the fall in amplitude.</p>
				<p><b>Release</b> controls how long a sound takes to fade to silence after the key is released. If the Sustain is very low, there may be no sound left by the time Release is triggered. But with a higher Sustain, Release can create sounds that vanish quickly or linger before they drift away.</p>
				<p><b>Tips:</b>
				<ul>
				<li>It's easier to hear the different ADSR stages when the note is held for longer. Try a quarter note.</li>
				<li>Play around with extreme values and see how it affects the sound.</li>
				<li>Notice how different envelopes affect the amplitude visualizer on the right.</li>	
				</ul>
				</p>
			</>
			: null}
		</div>
		
        </Modal.Body>

	</Modal>
    </div>
	

}

export default ADSRTutorial