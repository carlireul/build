import useTrack from './useTrack';

function SynthEditor({id}){

	const trackContext = useTrack(id, "synth")

	return(
		<>
			<p>Attack <input type="range" id="attack" name="attack" min="0" max="1" step="0.05" value={trackContext.envelope.attack} onChange={(e) => trackContext.changeAttack(e.target.value)}></input></p>
			<p>Decay <input type="range" id="decay" name="decay" min="0" max="1" step="0.05" value={trackContext.envelope.decay} onChange={(e) => trackContext.changeDecay(e.target.value)}></input></p>
			<p>Sustain <input type="range" id="sustain" name="sustain" min="0" max="1" step="0.05" value={trackContext.envelope.sustain} onChange={(e) => trackContext.changeSustain(e.target.value)}></input></p>
			<p>Release<input type="range" id="release" name="release" min="0" max="1" step="0.05" value={trackContext.envelope.release} onChange={(e) => trackContext.changeRelease(e.target.value)}></input></p>

			<p><select value={trackContext.oscillator.type} onChange={(e) => trackContext.changeWaveType(e.target.value)}>
				<option value="sine">Sine</option>
				<option value="square">Square</option>
				<option value="sawtooth">Sawtooth</option>
				<option value="triangle">Triangle</option>
			</select>
			</p>

			<button onClick={trackContext.toggleFilter}>{trackContext.filter.wet == 1 ? "Disable" : "Enable"} Filter</button>
			<select value={trackContext.filter.type} onChange={(e) => trackContext.changeFilterType(e.target.value)}>
				<option value="highpass">Highpass</option>
				<option value="lowpass">Lowpass</option>
			</select>

			Filter Cutoff <input type="range" id="cutoff" name="cutoff" min="0" max="20000" value={trackContext.filter.cutoff} onChange={(e) => trackContext.changeCutoff(e.target.value)}></input>

		</>
	)

}

export default SynthEditor