import SynthEditor from './SynthEditor'
import TrackControls from './TrackControls'
import Sequencer from './Sequencer'
import EffectEditor from './EffectEditor';
import Visualizer from './Visualizer';

import { notes } from '../services/helpers';

import useTrack from './useTrack';

const SynthTab = ({id, meter}) => {

	const trackContext = useTrack(id, "synth")
	const scales = notes.flatMap(note => [`${note} major`, `${note} minor`])
	const scaleSelects = scales.map(scale => {
			return <li key={scale}><a className="dropdown-item" onClick={() => trackContext.changeScale(scale)}>{scale}</a></li>
		})

		// console.log(scaleSelects)
	

	return <>
		<div id="synth-container">
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
					
					<div className="dropdown">
						<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							{trackContext.scale}
						</button>
						<ul className="dropdown-menu scroll-menu">
							{scaleSelects}
						</ul>
					</div>

					<button className="track-button" onClick={trackContext.increaseOctave}>+</button>
					<a
						data-tooltip-id="tooltip"
						data-tooltip-content="Change Octave"
					>
						<i className="fa-solid fa-music"></i>

					</a>
					<button className="track-button" onClick={trackContext.decreaseOctave}>-</button>


				</TrackControls>


				<Sequencer id={id} type="synth" />

			</div>
			<div id="editor-container">
				<SynthEditor id={id} />
				<EffectEditor id={id} />
			
			</div>
			<div><Visualizer meter={meter} /></div>
		</div>
		
	</>
}

export default SynthTab