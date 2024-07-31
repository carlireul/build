import TrackControls from './TrackControls'
import Sequencer from './Sequencer'

import useTrack from './useTrack';

const SamplerTab = ({ id }) => {

	const trackContext = useTrack(id, "sampler")

	return <>
			<div id="sequencer-container">
				<TrackControls id={id} />
				<span>
					<select value={trackContext.subdivision} onChange={(e) => trackContext.changeSubdivision(e.target.value)}>
						<option value="4">4</option>
						<option value="8">8</option>
						<option value="16">16</option>
					</select>
				</span>

				<Sequencer id={id} type="sampler"/>

			</div>
		<div id="sampler-bottom-container">
			<div>effects</div>
			<div>clips</div>
		</div>
	</>
}

export default SamplerTab