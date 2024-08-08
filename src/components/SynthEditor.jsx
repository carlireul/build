import useTrack from './useTrack';
import { toTitleCase } from '../services/helpers';
import Renamable from './Renamable';

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

			<div>Attack
				<Renamable number={true} range={[0, 1]} step={0.05} name={trackContext.envelope.attack} handler={trackContext.changeAttack} />
			<input className="form-range" type="range" id="attack" name="attack" min="0" max="1" step="0.05" value={trackContext.envelope.attack} onChange={(e) => trackContext.changeAttack(e.target.value)}></input></div>

			<div>Decay 
				<Renamable number={true} range={[0, 1]} step={0.05} name={trackContext.envelope.decay} handler={trackContext.changeDecay} />
				<input className="form-range" type="range" id="decay" name="decay" min="0" max="1" step="0.05" value={trackContext.envelope.decay} onChange={(e) => trackContext.changeDecay(e.target.value)}></input></div>

			<div>Sustain 
				<Renamable number={true} range={[0, 1]} step={0.05} name={trackContext.envelope.sustain} handler={trackContext.changeSustain} />
				<input className="form-range" type="range" id="sustain" name="sustain" min="0" max="1" step="0.05" value={trackContext.envelope.sustain} onChange={(e) => trackContext.changeSustain(e.target.value)}></input></div>

			<div>Release
				<Renamable number={true} range={[0, 1]} step={0.05} name={trackContext.envelope.release} handler={trackContext.changeRelease} />
				<input className="form-range" type="range" id="release" name="release" min="0" max="1" step="0.05" value={trackContext.envelope.release} onChange={(e) => trackContext.changeRelease(e.target.value)}></input></div>

			
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
			<div className="dropdown">
				<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
						{trackContext.filter.rate == 0 ? "Rate: Off" : `Rate: 1/${trackContext.filter.rate.split("n")[0]}`}
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
			<div>
				Cutoff
				<Renamable number={true} range={[0, 200]} step={1} name={trackContext.filter.cutoff} handler={trackContext.changeCutoff} />
				<input className="form-range" type="range" id="cutoff" name="cutoff" min="0" max="200" step="1" value={trackContext.filter.cutoff} onChange={(e) => trackContext.changeCutoff(e.target.value)}></input>
			</div>
			
			</div>
			
			<div className="row">
				

			</div>


			

		</div>
	)

}

export default SynthEditor