import { useEffect, useState, useRef } from 'react'
import db from '../data/db.js';
import { presets } from '../data/synths.js';


import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import * as Tone from "tone"

import { audio } from '../data/audio.js';
import useTrackDB from './useTrackDB.jsx';

import GlobalControls from './GlobalControls'
import SynthTrack from './SynthTrack'
import AudioTrack from './AudioTrack'
import FileUpload from './FileUpload.jsx';
import AudioTrackControls from './AudioTrackControls.jsx';
import SynthTab from './SynthTab.jsx';

const DAW = ({savedState}) => {
	// DB

	const trackDB = useTrackDB()
	console.log(savedState)

	// UI state

	const [visible, setVisible] = useState(false)
	const [activeTabs, setActiveTabs] = useState([])
	console.log(activeTabs)
	const [selectedFile, setSelectedFile] = useState(null);
	const [name, setName] = useState(savedState.name)

	// Tone setup

	const [trackLength, setTrackLength] = useState(savedState.trackEnd)	

	// Handlers

	const handleClick = () => { // Start button
		Tone.start()
		Tone.getTransport().loop = true;
		Tone.getTransport().loopStart = 0;
		Tone.getTransport().loopEnd = trackLength;
		Tone.getTransport().position = savedState.position
		setVisible(true)
	}

	const uploadAudio = () => {
		if(!selectedFile){
			return
		}

		trackDB.addNewAudio(selectedFile, savedState.id)
	}

	const deleteTrack = (id) => {
		trackDB.deleteTrack(id, savedState.id)
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
								{i + 1 + trackDB.audios.length}  <SynthTrack key={id} id={id} addTab={addTab} deleteTrack={deleteTrack} />
								</>
							)
								: "Loading"}

							<button onClick={() => trackDB.addNewSynth(savedState.id)}>+ Synth</button>
							
						<FileUpload
							onFileSelectSuccess={(file) => setSelectedFile(file)}
							onFileSelectError={({ error }) => alert(error)}
						/>
						<button onClick={uploadAudio}>+ Audio</button>


						</ div>
					</TabPanel>
					{activeTabs.map(tab =>
						<TabPanel key={`panel${tab.id}`} forceRender={true}>
							{ tab.type == "synth" ?
							<SynthTab id={tab.id} />
							: <AudioTrackControls id={tab.id} />
							}
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
						<GlobalControls savedState={savedState} />
						<button onClick={() => {
							const newState = {
								id: savedState.id,
								bpm: parseInt(Tone.getTransport().bpm.value),
								vol: parseInt(Tone.getDestination().volume.value),
								position: Tone.getTransport().position,
								trackEnd: trackLength,
								name: name,
								tabs: [...activeTabs],
							}

							trackDB.save(newState)}}>Save</button>
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