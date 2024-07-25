import { useEffect, useState } from 'react'
import db from '../data/db.js';
import { presets } from '../data/synths.js';
import uniqid from "uniqid";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import * as Tone from "tone"

import { audio } from '../data/audio.js';
import useTrackDB from './useTrackDB.jsx';

import GlobalControls from './GlobalControls'
import SynthTrack from './SynthTrack'
import AudioTrack from './AudioTrack'

const DAW = () => {
	// DB

	// db.delete({ disableAutoOpen: false });
	const trackDB = useTrackDB()

	// UI state

	const [visible, setVisible] = useState(false)
	const [activeTabs, setActiveTabs] = useState([])

	// Tone setup

	const [trackLength, setTrackLength] = useState("1:0:0")
	const [audioTracks, setAudioTracks] = useState(null);
	// const [synthTracks, setSynthTracks] = useState(trackDB.tracks);

	useEffect(() => { // set up: create audio + synth tracks
		const defaultAudioTracks = [{
			id: audio[0].id,
			source: audio[0].src,
			title: audio[0].title
		}]
		setAudioTracks(defaultAudioTracks)

		// setSynthTracks()

		// const fetchSynths = async () => {
		// 	const synths = await db.tracks.toArray()

		// 	if (synths.length === 0) {
		// 		setSynthTracks([{ ...presets[0], id: uniqid() }])
		// 	} else {
		// 		setSynthTracks(synths);
		// 	}
		// }

		// fetchSynths().catch(console.error)

	}, [])

	// Handlers

	const handleClick = () => { // Start button
		Tone.start()
		Tone.getTransport().loop = true;
		Tone.getTransport().loopStart = 0;
		Tone.getTransport().loopEnd = trackLength;
		setVisible(true)
	}

	const newSynthTrack = async () => {
		const newTrack = {
			...presets[0],
			id: uniqid(),
			name: "Untitled",
		}

		await db.tracks.add(newTrack)

		// setSynthTracks(prev => [...prev, newTrack])
	}

	const deleteTrack = (id) => {
		trackDB.deleteTrack(id)
		closeTab(id)
	}

	// Tab management

	const generateTabs = () => {
		return (
			<Tabs onSelect={(index, lastIndex, event) => {
				if (event.target.className === "fa-solid fa-xmark") {
					console.log(index, lastIndex, event.target)
					return false
				}
			}}>
				<TabList>
					<Tab>Timeline</Tab>
					{activeTabs.map(tab =>
						<Tab key={`tab${tab.id}`}>
							{tab.title}

							<button className="tab-button" value={tab.id} onClick={(e) => (closeTab(tab.id))}> <i className="fa-solid fa-xmark"></i></button>
						</Tab>
					)}
				</TabList>
					<TabPanel forceRender={true}>
						<div className="sequencer">

							{trackDB.audios ? trackDB.audios.map((id, i) =>
								<>
									{i + 1} <AudioTrack key={id} id={id} addTab={addTab} deleteTrack={deleteTrack} />
								</>
							)
								: "Loading..."}



							{trackDB.synths ? trackDB.synths.map((id, i) =>
							<>
								{i + 1 + audioTracks.length}  <SynthTrack key={id} id={id} addTab={addTab} deleteTrack={deleteTrack} />
								</>
							)
								: "Loading"}

							<button onClick={trackDB.addNewSynth}>+ Add Synth</button>


						</ div>
					</TabPanel>
					{activeTabs.map(tab =>
						<TabPanel key={`panel${tab.id}`} forceRender={true}>
							{tab.content}
						</TabPanel>
					)}
			</Tabs>
		)
	}

	const addTab = (newTab) => {
		if (!activeTabs.find(tab => tab.id == newTab.id)) {
			setActiveTabs(prev => [...prev, newTab])
		}
	}

	const closeTab = (id) => {
		setActiveTabs(prev => prev.filter(item => item.id != id))
	}

	return(
		<>
			<button id="start-button" style={visible ? { display: 'none' } : null} onClick={handleClick}><i className="fa-solid fa-music"></i> Start</button>

			<div id="app-container" style={visible ? null : { display: 'none' }}>
				<div id="top-container">
					{generateTabs()}
				</div>
				<div id="bottom-container">
					<div>
						<GlobalControls />
						<button onClick={trackDB.save}>Save</button>
					</div>
					<div>
						tips
					</div>
					<div>
						settings
					</div>
				</div>
			</div>
		</>
	)
}

export default DAW