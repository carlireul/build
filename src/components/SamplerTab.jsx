import TrackControls from './TrackControls'
import Sequencer from './Sequencer'
import EffectEditor from './EffectEditor';
import { toTitleCase } from '../services/helpers';
import Renamable from './Renamable';
import FilterTutorial from './FilterTutorial';

import useTrack from './useTrack';
import DrumTutorial from './DrumTutorial';
import { Effect } from 'tone/build/esm/effect/Effect';

const SamplerTab = ({ id }) => {

	const trackContext = useTrack(id, "sampler")

	return <>
	<div className="container w-100">
		<div className="row g-5 justify-content-evenly">
				<div className="col-8">
					<div className="row-cols-1">
					<div className="row">
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
				<DrumTutorial id={id} />
				</TrackControls>
					</div>
					<div className="row pt-3">
					<Sequencer id={id} type="sampler"/>
					</div>

						</div>
				</div>
			<div className="col-4">
				<div className="row-cols-1">
						
				<EffectEditor id={id} />
				</div>
			</div>
		</div>
	</div>
	
	</>

	// <div id="synth-container">
		
	// 		<div id="sequencer-container">
				
				
				
				

	// 		</div>
	// 		<div id="editor-container">
				
	// 			<div className="container pb-3">
				
	// 			</div>
	// 		<EffectEditor id={id} />
	// 		</div>
	// </div>
}

export default SamplerTab