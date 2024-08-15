import useTrack from './useTrack';
import { toTitleCase, togglePlay } from '../services/helpers';
import Renamable from './Renamable';
import ADSRTutorial from './ADSRTutorial';
import WaveTutorial from './WaveTutorial';
import FilterTutorial from './FilterTutorial';

function SynthEditor({id, meter}){

	const trackContext = useTrack(id, "synth")
	

	return(
		<div className="col pb-3 mb-3 border-bottom border-secondary">
			<div className="row justify-content-md-left g-2 pb-3">
				<div className="col-auto">
					<div className="dropdown">
						<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							Wave Type: {toTitleCase(trackContext.oscillator.type)}
						</button>
						<ul className="dropdown-menu">
							<li><a className="dropdown-item" onClick={() => trackContext.changeWaveType("sine")}>Sine</a></li>
							<li><a className="dropdown-item" onClick={() => trackContext.changeWaveType("square")}>Square</a></li>
							<li><a className="dropdown-item" onClick={() => trackContext.changeWaveType("sawtooth")}>Sawtooth</a></li>
							<li><a className="dropdown-item" onClick={() => trackContext.changeWaveType("triangle")}>Triangle</a></li>
						</ul>
					</div>
				</div>
				<div className="col-2">
					<WaveTutorial />
				</div>
			</div>
			<div className="row g-3">
				<div className="col col-auto">
					Attack
				</div>
				
				<div className="col col-4">
					<input className="form-range" type="range" min="0" max="2" step="0.05" value={trackContext.envelope.attack} onChange={(e) => trackContext.changeAttack(e.target.value)}></input>
				</div>
				
				<Renamable number={true} range={[0, 2]} step={0.05} name={trackContext.envelope.attack} handler={trackContext.changeAttack} />
					
					
				<div className="col col-4 ms-auto">
					<ADSRTutorial id={id} meter={meter} />
				</div>
				
			</div>
			<div className="row justify-content-md-left g-2">
				<div className="col col-auto">
					Decay
				</div>
				<div className="col col-4">
					<input className="form-range" type="range" min="0.1" max="2" step="0.05" value={trackContext.envelope.decay} onChange={(e) => trackContext.changeDecay(e.target.value)}></input></div>

				<Renamable number={true} range={[0.1, 2]} step={0.05} name={trackContext.envelope.decay} handler={trackContext.changeDecay} />

			</div>

			<div className="row justify-content-md-left g-2">
				<div className="col col-auto">
					Sustain
				</div>
				<div className="col col-4">
					<input className="form-range" type="range" min="0" max="1" step="0.05" value={trackContext.envelope.sustain} onChange={(e) => trackContext.changeSustain(e.target.value)}></input></div>

				<Renamable number={true} range={[0, 1]} step={0.05} name={trackContext.envelope.sustain} handler={trackContext.changeSustain} />

			</div>

			<div className="row justify-content-md-left g-2">
				<div className="col col-auto">
					Release
				</div>
				<div className="col col-4">
					<input className="form-range" type="range" min="0" max="5" step="0.05" value={trackContext.envelope.release} onChange={(e) => trackContext.changeRelease(e.target.value)}></input></div>

				<Renamable number={true} range={[0, 5]} step={0.05} name={trackContext.envelope.release} handler={trackContext.changeRelease} />

			</div>

			
				
			</div>

			
		
	)

}

export default SynthEditor