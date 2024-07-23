import SynthEditor from './SynthEditor'
import SynthTrackControls from './SynthTrackControls'
import Sequencer from './Sequencer'

import useTrack from './useTrack';

const SynthTab = ({id}) => {

	const trackContext = useTrack(id, "synth")

	return <>
		<div id="synth-container">
			<div id="editor-container">
				<SynthEditor id={id} />
			</div>
			<div id="sequencer-container">
				<SynthTrackControls id={id} />
				<span>
					<select value={trackContext.subdivision} onChange={(e) => trackContext.changeSubdivision(e.target.value)}>
						<option value="4">4</option>
						<option value="8">8</option>
						<option value="16">16</option>
					</select>
					<select value={trackContext.scale} onChange={(e) => {
						trackContext.changeScale(e.target.value)
					}}>
						<option value="C major">C Major</option>
						<option value="D major">D Major</option>
						<option value="E minor">E Minor</option>
						<option value="F# minor">F# Minor</option>
					</select>
				</span>
				Octave: <button className="octave-button" onClick={trackContext.increaseOctave}>+</button>
				<button className="octave-button" onClick={trackContext.decreaseOctave}>-</button>

				<Sequencer id={id}/>

			</div>
		</div>
		<div id="synth-bottom-container">
			<div>effects</div>
			<div>clips</div>
		</div>
	</>
}

export default SynthTab