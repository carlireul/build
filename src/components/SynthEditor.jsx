import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";

function SynthEditor(){

	const [attack, setAttack] = useState(0.1);
	const [decay, setDecay] = useState(0.2);
	const [sustain, setSustain] = useState(1.0);
	const [release, setRelease] = useState(0.8);
	const [waveType, setWaveType] = useState("sine");
	const [cutoff, setCutoff] = useState(500);
	const [filterType, setFilterType] = useState("highpass");
	const synth = useRef();
	const filter = useRef();

	const updateSynth = () => {
		synth.current.set({
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

		filter.current.set({
			frequency: cutoff,
			type: filterType,
		})

		console.log(synth.current.get())
		console.log(filter.current.get())
	}

	useEffect(() => {

		filter.current = new Tone.Filter(cutoff, filterType).toDestination()

		synth.current = new Tone.PolySynth().connect(filter.current);

		updateSynth()

	}, [])

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
		synth.current.triggerAttackRelease(["C4", "C5"], 1);
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
			<input type="range" id="attack" name="attack" min="0" max="2" step="0.1" value={attack} onChange={(e) => changeAttack(e.target.value)}></input>
			<input type="range" id="decay" name="decay" min="0" max="2" step="0.1" value={decay} onChange={(e) => changeDecay(e.target.value)}></input>
			<input type="range" id="sustain" name="sustain" min="0" max="2" step="0.1" value={sustain} onChange={(e) => changeSustain(e.target.value)}></input>
			<input type="range" id="release" name="release" min="0" max="2" step="0.1" value={release} onChange={(e) => changeRelease(e.target.value)}></input>

			<input type="range" id="cutoff" name="cutoff" min="100" max="20000" value={cutoff} onChange={(e) => changeCutoff(e.target.value)}></input>

			<select value={waveType} onChange={(e) => setWaveType(e.target.value)}>
				<option value="sine">Sine</option>
				<option value="square">Square</option>
				<option value="sawtooth">Sawtooth</option>
				<option value="triangle">Triangle</option>
			</select>

			<select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
				<option value="highpass">Highpass</option>
				<option value="lowpass">Lowpass</option>
			</select>

			<button onClick={play}>test</button>
		</>
	)

}

export default SynthEditor