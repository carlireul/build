import useTrack from './useTrack'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { toTitleCase } from '../services/helpers'

const EffectEditor = ({id}) => {

	const trackContext = useTrack(id, "effects")
	// console.log(trackContext)

	const effectOptions = (effect) => {
		
		switch(effect) {
		case "chorus":
			return (
				<>
					<div className="row align-items-center">
					Frequency: <input className="form-range w-25" type="range" id="chorus-frequency" name="chorus-frequency" min="1" max="8" step="1" value={trackContext.chorus.frequency} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />
					</div>
					<div className="row align-items-center">

					Delay: <input className="form-range w-25" type="range" id="chorus-delayTime" name="chorus-delayTime" min="2" max="20" step="1" value={trackContext.chorus.delayTime} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />
				</div>
					<div className="row align-items-center">

					Depth: <input className="form-range w-25" type="range" id="chorus-depth" name="chorus-depth" min="0.1" max="1" step="0.1" value={trackContext.chorus.depth} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />
					</div>
					<div className="row align-items-center">
				

					Feedback: <input className="form-range w-25" type="range" id="chorus-feedback" name="chorus-feedback" min="0" max="1" step="0.1" value={trackContext.chorus.feedback} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />
				</div>
				</>
			)
		case "distortion":
			return (
				<>
					<div className="row align-items-center">
					Distortion: <input className="form-range w-25" type="range" id="distortion-distortion" name="distortion-distortion" min="0.1" max="1" step="0.1" value={trackContext.distortion.distortion} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />

				</div>
				</>
			)
		case "delay":
			return (
				<>
					<div className="row align-items-center">
					Feedback: <input className="form-range w-25" type="range" id="delay-feedback" name="delay-feedback" min="0" max="1" step="0.1" value={trackContext.delay.feedback} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />
					</div>
					<div className="row align-items-center">
					Delay: <input className="form-range w-25" type="range" id="delay-delayTime" name="delay-delayTime" min="0.1" max="1" step="0.1" value={trackContext.delay.delayTime} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />

				</div>
				</>
			)
		case "phaser":
			return (
				<>
					<div className="row align-items-center">
					Speed: <input className="form-range w-25" type="range" id="phaser-frequency" name="phaser-frequency" min="1" max="20" step="1" value={trackContext.phaser.frequency} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />
					</div>
					<div className="row align-items-center">
					Octaves: <input className="form-range w-25" type="range" id="phaser-octaves" name="phaser-octaves" min="1" max="8" step="1" value={trackContext.phaser.octaves} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />
					</div>
					<div className="row align-items-center">

					Base Frequency: <input className="form-range w-25" type="range" id="phaser-baseFrequency" name="phaser-baseFrequency" min="350" max="10000" step="200" value={trackContext.phaser.baseFrequency} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />
					</div>
				</>
			)
		case "reverb":
			return (
				<>
					<div className="row align-items-center">

					Decay: <input className="form-range w-25" type="range" id="reverb-decay" name="reverb-decay" min="0.5" max="8" step="0.5" value={trackContext.reverb.decay} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)}/>
				</div>
				</>
			)
	}

	}

	return(
		<div className="effect-editor">
			<Tabs onSelect={(index, lastIndex, event) => {
				if (event.target.className === "effect-checkbox") {
					console.log(index, lastIndex, event.target)
					return false
				}
			}}>
				<TabList>
					{trackContext.effects.map(effect => <Tab key={`tab${effect}`}><input type="checkbox" className="form-check-input effect-checkbox" name={effect} checked={trackContext[effect].enabled} onChange={(e) => trackContext.toggleEffect(e.target.name)} /> {toTitleCase(effect)}</Tab>)}
				</TabList>
				{trackContext.effects.map(effect => {
					return <TabPanel key={`panel${effect}`}>
						<div className="container">
							<div className="row align-items-center">
								Wet: <input className="form-range w-25" type="range" id={`${effect}-wet`} name={`${effect}-wet`} min="0" max="1" step="0.1" value={trackContext[effect].wet} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />
							</div>
							{effectOptions(effect)}
						</div>
					</TabPanel>
				})}
			</Tabs>

		</div>

	)
}

export default EffectEditor;