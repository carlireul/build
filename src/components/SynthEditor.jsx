import useTrack from './useTrack';
import { toTitleCase, togglePlay } from '../services/helpers';
import Renamable from './Renamable';
import ADSRTutorial from './ADSRTutorial';
import { useState } from 'react';

function SynthEditor({id}){

	const trackContext = useTrack(id, "synth")

	return(
		<div className="container pb-3">
			<div className="row">
				<div className="dropdown pt-2 pb-2">
					
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
			<div className="row justify-content-md-left g-2">
				<div className="col col-auto">
					Attack
				</div>
				<div className="col col-4">
					<input className="form-range" type="range" min="0" max="1" step="0.05" value={trackContext.envelope.attack} onChange={(e) => trackContext.changeAttack(e.target.value)}></input></div>
				
					<Renamable number={true} range={[0, 1]} step={0.05} name={trackContext.envelope.attack} handler={trackContext.changeAttack} />
			<div className="col">
				<ADSRTutorial id={id} />
			</div>
				
			</div>
			<div className="row justify-content-md-left g-2">
				<div className="col col-auto">
					Decay
				</div>
				<div className="col col-4">
					<input className="form-range" type="range" min="0.1" max="1" step="0.05" value={trackContext.envelope.decay} onChange={(e) => trackContext.changeDecay(e.target.value)}></input></div>

				<Renamable number={true} range={[0.1, 1]} step={0.05} name={trackContext.envelope.decay} handler={trackContext.changeDecay} />

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
					<input className="form-range" type="range" min="0" max="1" step="0.05" value={trackContext.envelope.release} onChange={(e) => trackContext.changeRelease(e.target.value)}></input></div>

				<Renamable number={true} range={[0, 1]} step={0.05} name={trackContext.envelope.release} handler={trackContext.changeRelease} />

			</div>

			<div className="row pt-3">
			<div className="col-auto">

			<button className="btn btn-primary" onClick={trackContext.toggleFilter}>{trackContext.filter.wet == 1 ? "Disable" : "Enable"} Filter</button>
			</div>

			</div>
			
			
			<div className="row justify-content-md-left g-3">
				<div className="col col-auto">
					Cutoff
				</div>
				<div className="col col-4">
					<input className="form-range" type="range" id="cutoff" name="cutoff" min="0" max="2000" step="1" value={trackContext.filter.cutoff} onChange={(e) => trackContext.changeCutoff(e.target.value)}></input>
					</div>

				<Renamable number={true} range={[0, 2000]} step={1} name={trackContext.filter.cutoff} handler={trackContext.changeCutoff} />
			
	
			</div>
			<div className="row">

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

			
			</div>
			
		
	)

}

export default SynthEditor