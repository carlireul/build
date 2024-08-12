import TrackControls from './TrackControls'
import Sequencer from './Sequencer'
import EffectEditor from './EffectEditor';
import { toTitleCase } from '../services/helpers';
import Renamable from './Renamable';
import FilterTutorial from './FilterTutorial';

import useTrack from './useTrack';

const SamplerTab = ({ id }) => {

	const trackContext = useTrack(id, "sampler")

	return <div id="synth-container">
		
			<div id="sequencer-container">
				<TrackControls id={id}>
				<div className="dropdown">
					<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
						{trackContext.subdivision}
					</button>
					<ul className="dropdown-menu">
						<li><a className="dropdown-item" onClick={() => trackContext.changeSubdivision(4)}>4</a></li>
						<li><a className="dropdown-item" onClick={() => trackContext.changeSubdivision(8)}>8</a></li>
						<li><a className="dropdown-item" onClick={() => trackContext.changeSubdivision(16)}>16</a></li>
						
					</ul>
				</div>
				</TrackControls>
				<Sequencer id={id} type="sampler"/>
				

			</div>
			<div id="editor-container">
				<EffectEditor id={id} />
				<div className="container">
				<div className="row pt-3">
					<div className="col-auto">

						<button className="btn btn-primary" onClick={trackContext.toggleFilter}>{trackContext.filter.wet == 1 ? "Disable" : "Enable"} Filter</button>
					</div>
					<div className="col-auto"><FilterTutorial id={id} /></div>


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
				</div>
			</div>
	</div>
}

export default SamplerTab