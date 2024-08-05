import useTrack from './useTrack';
import { toTitleCase } from '../services/helpers';

function SynthEditor({id}){

	const trackContext = useTrack(id, "synth")

	return(
		<div className="container pb-3">
			<div className="dropdown pb-2">
				<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
					{toTitleCase(trackContext.oscillator.type)}
				</button>
				<ul className="dropdown-menu">
					<li><a className="dropdown-item" onClick={() => trackContext.changeWaveType("sine")}>Sine</a></li>
					<li><a className="dropdown-item" onClick={() => trackContext.changeWaveType("square")}>Square</a></li>
					<li><a className="dropdown-item" onClick={() => trackContext.changeWaveType("sawtooth")}>Sawtooth</a></li>
					<li><a className="dropdown-item" onClick={() => trackContext.changeWaveType("triangle")}>Triangle</a></li>
				</ul>
			</div>

			<div>Attack <input className="form-range" type="range" id="attack" name="attack" min="0" max="1" step="0.05" value={trackContext.envelope.attack} onChange={(e) => trackContext.changeAttack(e.target.value)}></input></div>
			<div>Decay <input className="form-range" type="range" id="decay" name="decay" min="0" max="1" step="0.05" value={trackContext.envelope.decay} onChange={(e) => trackContext.changeDecay(e.target.value)}></input></div>
			<div>Sustain <input className="form-range" type="range" id="sustain" name="sustain" min="0" max="1" step="0.05" value={trackContext.envelope.sustain} onChange={(e) => trackContext.changeSustain(e.target.value)}></input></div>
			<div>Release<input className="form-range" type="range" id="release" name="release" min="0" max="1" step="0.05" value={trackContext.envelope.release} onChange={(e) => trackContext.changeRelease(e.target.value)}></input></div>

			
			<div className="row row-cols-lg-auto g-2 align-items-center pt-3">

			<button className="btn btn-primary" onClick={trackContext.toggleFilter}>{trackContext.filter.wet == 1 ? "Disable" : "Enable"} Filter</button>
			<div className="dropdown">
				<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
					{toTitleCase(trackContext.filter.type)}
				</button>
				<ul className="dropdown-menu">
					<li><a className="dropdown-item" onClick={() => trackContext.changeFilterType("highpass")}>Highpass</a></li>
					<li><a className="dropdown-item" onClick={() => trackContext.changeFilterType("lowpass")}>Lowpass</a></li>
				</ul>
			</div>
			Filter Cutoff <input className="form-range" type="range" id="cutoff" name="cutoff" min="0" max="20000" value={trackContext.filter.cutoff} onChange={(e) => trackContext.changeCutoff(e.target.value)}></input>
			</div>
			
			<div className="row">
				

			</div>


			

		</div>
	)

}

export default SynthEditor