import useTrack from './useTrack';

const SynthTrackControls = ({id}) => {

	const trackContext = useTrack(id);
	
	return <>
	<div>	
			<button onClick={trackContext.toggleSolo}>Solo</button>
			<button onClick={trackContext.mute}>{trackContext.muted ? "Unmute" : "Mute"}</button>
			Vol: <input type="range" id="vol" name="vol" min="-20" max="20" value={trackContext.vol} onChange={(e) => trackContext.changeVol(e.target.value)}></input>
			<button onClick={trackContext.increaseOctave}>+</button>
			<button onClick={trackContext.decreaseOctave}>-</button>
			<button onClick={trackContext.centrePan}>Pan</button> <input type="range" id="vol" name="vol" min="-1" max="1" step="0.1" value={trackContext.pan} onChange={(e) => trackContext.changePan(e.target.value)}></input>
	</div>
	</>
}

export default SynthTrackControls