import TrackControls from './TrackControls'
import Sequencer from './Sequencer'
import EffectEditor from './EffectEditor';

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
			</div>
	</div>
}

export default SamplerTab