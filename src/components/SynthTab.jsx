import SynthEditor from './SynthEditor'
import SynthTrackControls from './SynthTrackControls'
import Sequencer from './Sequencer'

import useTrack from './useTrack';

const SynthTab = ({id, steps, setSteps, globalBeat}) => {

	const trackContext = useTrack(id, "synth")

	return <>
		<div id="synth-container">
			<div id="editor-container">
				<SynthEditor id={id} />
			</div>
			<div id="sequencer-container">
				<SynthTrackControls id={id} />
				<span>
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

				<Sequencer id={id} steps={steps} setSteps={setSteps} globalBeat={globalBeat} />

			</div>
		</div>
		<div id="synth-bottom-container">
			<div>effects</div>
			<div>clips</div>
		</div>
	</>
}

export default SynthTab