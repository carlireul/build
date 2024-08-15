import useTrack from './useTrack'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { toTitleCase } from '../services/helpers'
import FilterTutorial from './FilterTutorial';
import Renamable from './Renamable';
import EffectTutorial from './EffectTutorial';

const EffectEditor = ({id}) => {

	const trackContext = useTrack(id, "effects")
	// console.log(trackContext)

	const effectOptions = (effect) => {
		
		switch(effect) {
		case "distortion":
			return (
				<>
					<div className="row justify-content-around">
					Distortion: <input className="form-range w-50" type="range" id="distortion-distortion" name="distortion-distortion" min="0.1" max="1" step="0.1" value={trackContext.distortion.options.distortion} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />

				</div>
				</>
			)
		case "delay":
			return (
				<>
					<div className="row justify-content-around">
					Feedback: <input className="form-range w-50" type="range" id="delay-feedback" name="delay-feedback" min="0" max="1" step="0.1" value={trackContext.delay.options.feedback} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />
					</div>
					<div className="row pt-2">
						<div className="dropdown">
							<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
								Delay: {trackContext.delay.options.delayTime}
							</button>
							<ul className="dropdown-menu">
								<li><a className="dropdown-item" onClick={() => trackContext.modifyEffect("delay-delayTime", "4n")}>4n</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.modifyEffect("delay-delayTime", "8n")}>8n</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.modifyEffect("delay-delayTime", "16n")}>16n</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.modifyEffect("delay-delayTime", "32n")}>32n</a></li>

							</ul>
						</div>

				</div>
				</>
			)
		case "eq":
			return (<>
			
				<div className="col-auto gx-5 gy-2">
					<div className="row justify-content-around">

						Highs: <input className="form-range w-50" type="range" id="eq-high" name="eq-high" min="-8" max="8" step="1" value={trackContext.eq.options.high} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} /> {trackContext.eq.options.high}
					
				</div>
					<div className="row justify-content-around">

						Mids: <input className="form-range w-50" type="range" id="eq-mid" name="eq-mid" min="-8" max="8" step="1" value={trackContext.eq.options.mid} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} /> {trackContext.eq.options.mid}

					</div>
					<div className="row justify-content-around">

						Lows: <input className="form-range w-50" type="range" id="eq-low" name="eq-low" min="-8" max="8" step="1" value={trackContext.eq.options.low} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} /> {trackContext.eq.options.low}
					</div>
				</div>
				<div className="col-auto gy-2">
					
				<button className="btn btn-primary me-2"  onClick={trackContext.resetEQ}>Reset</button>
				<EffectTutorial />
				</div>
			</>
			)
		case "reverb":
			return (
				<>
					
						<div className="row justify-content-around">
						Decay: <input className="form-range w-50" type="range" id="reverb-decay" name="reverb-decay" min="0.5" max="8" step="0.5" value={trackContext.reverb.options.decay} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />

						</div>
						
				</>
			)
	}

	}

	return(
		<>
		
		<div className="container effect-editor pb-3 mb-3 border-bottom border-secondary">
			<div className="row pb-2">
				<div className="col-auto">
					<button className="btn btn-primary" onClick={trackContext.toggleFilter}>{trackContext.filter.wet == 1 ? "Disable" : "Enable"} Filter</button>
				</div>
				<div className="col-auto">
					<FilterTutorial id={id} />
				</div>
			</div>
			<div className="row pb-2">
					<div className="col-auto">
						<div className="row justify-content-md-left g-3">
							<div className="col col-auto">
								Cutoff
							</div>
							<div className="col col-4">
								<input className="form-range" type="range" id="cutoff" name="cutoff" min="0" max="2000" step="1" value={trackContext.filter.cutoff} onChange={(e) => trackContext.changeCutoff(e.target.value)}></input>
							</div>

							<Renamable number={true} range={[0, 2000]} step={1} name={trackContext.filter.cutoff} handler={trackContext.changeCutoff} />

							<div className='col col-auto'>
							<div className="dropdown">
								<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
									Rolloff: {trackContext.filter.rolloff}
								</button>
								<ul className="dropdown-menu">
									<li><a className="dropdown-item" onClick={() => trackContext.changeRollOff(-12)}>-12</a></li>
									<li><a className="dropdown-item" onClick={() => trackContext.changeRollOff(-24)}>-24</a></li>
								</ul>
							</div>
							</div>
						</div>
					</div>


			</div>
			<div className="row">
					<div className="col-auto">
						<div className="dropdown">
							<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
								Filter Type: {toTitleCase(trackContext.filter.type)}
							</button>
							<ul className="dropdown-menu">
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterType("highpass")}>Highpass</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterType("lowpass")}>Lowpass</a></li>
							</ul>
						</div>


					</div>
					<div className="col-auto">
						<div className="dropdown">
							<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
								LFO Rate: {trackContext.filter.rate == 0 ? "Off" : `1/${trackContext.filter.rate.split("n")[0]}`}
							</button>
							<ul className="dropdown-menu">
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterRate(0)}>Off</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterRate("2n")}>2</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterRate("4n")}>4</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterRate("8n")}>8</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterRate("16n")}>16</a></li>
								<li><a className="dropdown-item" onClick={() => trackContext.changeFilterRate("32n")}>32</a></li>
							</ul>
						</div>
					</div>
			</div>
		</div>
		
		<Tabs onSelect={(index, lastIndex, event) => {
				if (event.target.className === "effect-checkbox") {
					console.log(index, lastIndex, event.target)
					return false
				}
			}}>
				<TabList>
					<Tab key={`tabeq`}>EQ</Tab>
					{trackContext.effects.map(effect => {
						if(effect != "eq"){
							return <Tab key={`tab${effect}`}><input type="checkbox" className="form-check-input effect-checkbox" name={effect} checked={trackContext[effect].enabled} onChange={(e) => trackContext.toggleEffect(e.target.name)} /> {toTitleCase(effect)}</Tab>
						}
					})}
				</TabList>

				<TabPanel key="tabeq">
					<div className="row">
						{effectOptions("eq")}
					</div>
				</TabPanel>
				{trackContext.effects.map(effect => {
					if(effect != "eq"){
						return <TabPanel key={`panel${effect}`}>
							<div className="row">

							<div className="col-auto gx-5 gy-2">
									<div className="row justify-content-around">
									Wet: <input className="form-range w-50" type="range" id={`${effect}-wet`} name={`${effect}-wet`} min="0" max="1" step="0.1" value={trackContext[effect].options.wet} onChange={(e) => trackContext.modifyEffect(e.target.name, e.target.value)} />
								</div>
								{effectOptions(effect)}
							</div>
							<div className="col-auto gy-2">
								<EffectTutorial></EffectTutorial>
							</div>
							</div>
						</TabPanel>
					}
					
				})}
		</Tabs>
		
		</>
	)
}

export default EffectEditor;