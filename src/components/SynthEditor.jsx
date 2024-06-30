import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";

function SynthEditor({synth, filter}){

	const [attack, setAttack] = useState(synth.get().envelope.attack);
	const [decay, setDecay] = useState(synth.get().envelope.decay);
	const [sustain, setSustain] = useState(synth.get().envelope.sustain);
	const [release, setRelease] = useState(synth.get().envelope.release);
	const [waveType, setWaveType] = useState(synth.get().oscillator.type);
	const [cutoff, setCutoff] = useState(filter.get().frequency);
	const [filterType, setFilterType] = useState(filter.get().type);

	const updateSynth = () => {
		synth.set({
			envelope: {
				attack: attack,
				decay: decay,
				sustain: sustain,
				release: release,
			},
			oscillator: {
				type: waveType
			},
		})

		filter.set({
			frequency: cutoff,
			type: filterType,
		})

		console.log(synth.get())
		console.log(filter.get())
	}

	useEffect(updateSynth, [attack, decay, sustain, release, waveType, cutoff, filterType])

	const changeAttack = (value) => {
		setAttack(parseFloat(value))
	}

	const changeDecay = (value) => {
		setDecay(parseFloat(value))
	}

	const changeSustain = (value) => {
		setSustain(parseFloat(value))
	}

	const changeRelease = (value) => {
		setRelease(parseFloat(value))
	}

	const changeCutoff = (value) => {
		setCutoff(parseInt(value))
	}

	const play = () => {
		synth.triggerAttackRelease(["C4", "C5"], 1);
	}

	const save = () => {
		const params = {
			synth: {
				envelope: {
					attack: attack,
					decay: decay,
					sustain: sustain,
					release: release,
				},
				oscillator: {
					type: waveType
				},
			},
			filter: {
				frequency: cutoff,
				type: filterType,
			}
		}

		// save logic. hook up to controls

	}
	


	return(
		<>
			<p>Attack <input type="range" id="attack" name="attack" min="0" max="2" step="0.1" value={attack} onChange={(e) => changeAttack(e.target.value)}></input></p>
			<p>Decay <input type="range" id="decay" name="decay" min="0" max="2" step="0.1" value={decay} onChange={(e) => changeDecay(e.target.value)}></input></p>
			<p>Sustain <input type="range" id="sustain" name="sustain" min="0" max="2" step="0.1" value={sustain} onChange={(e) => changeSustain(e.target.value)}></input></p>
			<p>Release<input type="range" id="release" name="release" min="0" max="2" step="0.1" value={release} onChange={(e) => changeRelease(e.target.value)}></input></p>

			<p><select value={waveType} onChange={(e) => setWaveType(e.target.value)}>
				<option value="sine">Sine</option>
				<option value="square">Square</option>
				<option value="sawtooth">Sawtooth</option>
				<option value="triangle">Triangle</option>
			</select>
			</p>

			<select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
				<option value="highpass">Highpass</option>
				<option value="lowpass">Lowpass</option>
			</select>

			Filter Cutoff <input type="range" id="cutoff" name="cutoff" min="0" max="20000" value={cutoff} onChange={(e) => changeCutoff(e.target.value)}></input>

		</>
	)

}

export default SynthEditor