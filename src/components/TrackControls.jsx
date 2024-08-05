import { useState, useEffect } from 'react';
import useTrack from './useTrack';

const TrackControls = ({ id, children }) => {
	const trackContext = useTrack(id, "controls")

	const [volStyle, setVolStyle] = useState("fa-solid fa-volume-low");

	useEffect(() => {
		if (trackContext.vol == -20) {
			setVolStyle("fa-solid fa-volume-off")
		} else if (trackContext.vol <= 7) {
			setVolStyle("fa-solid fa-volume-low")
		} else if (trackContext.vol >= 8) {
			setVolStyle("fa-solid fa-volume-high")
		}
	}, [trackContext.vol])

	return <>
		{/* <div className="container">
			<div className="col"> */}
				<div className="row row-cols-lg-auto g-2 align-items-center">
					<button className="track-button" onClick={trackContext.toggleSolo}>{trackContext.solod ? <i className="fa-solid fa-headphones" style={{color: "#74C0FC"}}></i> : <i className="fa-solid fa-headphones"></i>}</button>
					<button className="track-button" onClick={trackContext.mute}>{trackContext.muted ? <i className="fa-solid fa-volume-xmark" style={{ color: "#74C0FC" }}></i> : <i className="fa-solid fa-volume-xmark"></i>}</button>
					<i className={volStyle}></i>  <input className="form-range w-25" type="range" id="vol" name="vol" min="-20" max="20" value={trackContext.vol} onChange={(e) => trackContext.changeVol(e.target.value)}></input>
					<button className="track-button" onClick={() => trackContext.centrePan()}><i className="fa-solid fa-left-right"></i></button> <input className="form-range w-25" type="range" id="pan" name="pan" min="-1" max="1" step="0.1" value={trackContext.pan} onChange={(e) => trackContext.changePan(e.target.value)}></input>
					{children}
				</div>
			{/* </div>
		</div> */}
	</>
}

export default TrackControls