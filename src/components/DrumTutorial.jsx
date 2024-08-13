import { useEffect, useState, useRef } from 'react';
import useTrack from './useTrack';
import Modal from 'react-bootstrap/Modal'
import drumnbass from '../data/audio/drumnbass.mp3'
import hiphop from '../data/audio/hiphop.mp3'
import house from '../data/audio/house.mp3'
import twobeat from '../data/audio/twobeat.mp3'
import fouronthefloor from '../data/audio/fouronthefloor.mp3'

import * as Tone from "tone";

const DrumTutorial = ({id}) => {


	const [showTutorial, setShowTutorial] = useState(false)
	const [playing, setPlaying] = useState({
		drumnbass: false,
		hiphop: false,
		house: false,
		twobeat: false,
		fouronthefloor: false
	})
	const player = useRef()
	const solo = useRef()

	const setup = () => {
		setShowTutorial(true)
		solo.current = new Tone.Solo().toDestination()
		player.current = new Tone.Players({
			drumnbass: drumnbass,
			hiphop: hiphop,
			house: house,
			twobeat: twobeat,
			fouronthefloor: fouronthefloor
		}, () => {
			player.current.connect(solo.current)
		})
	}

	const cleanup = () => {
		solo.current.solo = false
		player.current.stopAll()
		player.current.disconnect()
		solo.current.disconnect()
		player.current.dispose()
		solo.current.dispose()

		setShowTutorial(false)

		const newPlaying = { ...playing }
		Object.keys(newPlaying).forEach(v => newPlaying[v] = false)
		setPlaying(newPlaying)

		console.log("disposed")
	}

	const togglePlay = (name) => {
		solo.current.solo = true
		const audio = player.current.player(name);

		if(playing[name]){
			console.log("hi")
			audio.stop()
		} else {

			player.current.stopAll()

			setPlaying(prev => {
				const newPlaying = { ...prev }
				newPlaying[name] = true
				return newPlaying
			})
			
			audio.onstop = () => {
				setPlaying(prev => {
					const newPlaying = { ...prev }
					newPlaying[name] = false
					return newPlaying
				})
			}
			
			audio.start();
		} 
		

	}

	return (
		<>
			<button className="btn btn-info" onClick={setup}><i className="fa-solid fa-magnifying-glass" ></i></button>
			<Modal size="lg" show={showTutorial} onHide={cleanup}>
				<Modal.Header>
					<h3>Drums</h3>
				</Modal.Header>
				<Modal.Body>
					<p>
						The <b>sequencer</b> is where you place the notes/drum hits you want to be played. One loop of the sequencer is a <b>bar</b>, and there are <b>4 beats</b> in a bar. You can divide the bar into quarter, eighth or sixteenth notes.
					</p>
					<p>
						Drum beats are the backbone of electronic music. Different genres can be distinguished by their drum beats. Here are some common <b>drum patterns</b> to inspire you. These patterns are a good starting point for creating a track in a specific genre, but feel free to change it up.
					</p>
					
					<p>
						<button className="btn btn-primary" onClick={() => togglePlay("fouronthefloor")}>
							{playing.fouronthefloor ?
								<i className="fa-solid fa-pause"></i>
								: <i className="fa-solid fa-play"></i>
							}
						</button> <b>Four-on-the-floor</b> is one of the most fundamental patterns: a kick drum on every beat.
					</p>
					
							<p>
								<button className="btn btn-primary" onClick={() => togglePlay("twobeat")}>
									{playing.twobeat ?
										<i className="fa-solid fa-pause"></i>
										: <i className="fa-solid fa-play"></i>
									}
								</button>
								<b> Two beat</b> has a kick on the 1st and 3rd beats, and a snare on the 2nd and 4th.
							</p>
							<p>
								<button className="btn btn-primary" onClick={() => togglePlay("house")}>
									{playing.house ?
										<i className="fa-solid fa-pause"></i>
										: <i className="fa-solid fa-play"></i>
									}
								</button>
								<b> House</b> music uses the classic four-on-the-floor pattern, plus a clap on the 2nd and 4th beats and hi-hats on every 8th note.
							</p>
							<p>
								<button className="btn btn-primary" onClick={() => togglePlay("drumnbass")}>
									{playing.drumnbass ?
										<i className="fa-solid fa-pause"></i>
										: <i className="fa-solid fa-play"></i>
									}
								</button>
								<b> Drum 'n' bass</b> is based on a very fast 2-step rhythm of snares on the 2nd and 4th beats, and kicks on the first and sixth 8th notes plus hi-hats on the 8th notes.
							</p>
							<p>
								<button className="btn btn-primary" onClick={() => togglePlay("hiphop")}>
									{playing.hiphop ?
										<i className="fa-solid fa-pause"></i>
										: <i className="fa-solid fa-play"></i>
									}
								</button> Classic <b>hip-hop</b> builds off the two-beat pattern by adding extra kicks and hi-hats between the beats.
							</p>
					

				</Modal.Body>

				<Modal.Footer>
					<button className="btn btn-secondary" onClick={cleanup}>X</button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default DrumTutorial