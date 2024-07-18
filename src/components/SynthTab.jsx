import SynthEditor from './SynthEditor'
import SynthTrackControls from './SynthTrackControls'
import Sequencer from './Sequencer'

import useTrack from './useTrack';

const SynthTab = ({id, synth, filter, steps, setSteps}) => {

	const trackContext = useTrack(id)

	return <>
		<div id="synth-container">
			<div id="editor-container">
				<SynthEditor id={id} synth={synth} filter={filter} />
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

				<Sequencer id={id} steps={steps} setSteps={setSteps} />

			</div>
		</div>
		<div id="synth-bottom-container">
			<div>effects</div>
			<div>clips</div>
		</div>
	</>
}

export default SynthTab