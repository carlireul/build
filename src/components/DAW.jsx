import { useEffect, useState, useRef } from 'react'
import db from '../data/db.js';
import { presets } from '../data/synths.js';


import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import * as Tone from "tone"

import useTrackDB from './useTrackDB.jsx';

import GlobalControls from './GlobalControls'
import SynthTrack from './SynthTrack'
import AudioTrack from './AudioTrack'
import SamplerTrack from './SamplerTrack.jsx'
import FileUpload from './FileUpload.jsx';

const DAW = ({ savedState, deleteProject, changeProject }) => {
	// DB

	const trackDB = useTrackDB()
	// console.log(savedState)

	// UI state

	const [visible, setVisible] = useState(false)
	const [activeTabs, setActiveTabs] = useState([])
	const [selectedFile, setSelectedFile] = useState(null);
	const [name, setName] = useState(savedState.name)

	useEffect(() => {
		document.querySelector("#progress").style = `left: 0%`;
		const interval = setInterval(() => {
			const progress = (Tone.getTransport().progress);
			document.querySelector("#progress").style = `left: ${progress}%`;
		}, 16);

		return () => {
			clearInterval(interval)
		}
	})

	// Tone setup

	const [trackLength, setTrackLength] = useState(savedState.trackEnd)	

	// Handlers

	const handleClick = () => { // Start button
		Tone.start()
		Tone.getTransport().loop = true;
		Tone.getTransport().loopStart = 0;
		Tone.getTransport().loopEnd = trackLength
		setVisible(true)
	}

	const uploadAudio = () => {
		if(!selectedFile){
			return
		}

		if(Tone.getTransport().state == "started"){
			Tone.getTransport().pause()
			trackDB.addNewAudio(selectedFile, savedState.id)
		} else {
			trackDB.addNewAudio(selectedFile, savedState.id)
		}

	}

	const deleteTrack = (id) => {
		trackDB.deleteTrack(id, savedState.id)
		closeTab(id)
	}


	// Tab management

	const generateTabs = () => {
		return (
			<>
			
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
						<div id="tracks">
						<div id="progress" />

							{trackDB.audios ? trackDB.audios.map((id, i) =>
								<span key={i}>
									<AudioTrack key={id} id={id} addTab={addTab} deleteTrack={deleteTrack} />
								</span>
							)
								: "Loading..."}



							{trackDB.synths ? trackDB.synths.map((id, i) =>
								<span key={i}>
									<SynthTrack key={id} id={id} addTab={addTab} deleteTrack={deleteTrack} />
								</span>
							)
								: "Loading"}

							{trackDB.samplers ? trackDB.samplers.map((id, i) =>
								<span key={i}>
									<SamplerTrack key={id} id={id} addTab={addTab} deleteTrack={deleteTrack} />
								</span>
							)
								: "Loading"}

						<button onClick={() => trackDB.addNewSynth(savedState.id)}>+ Synth</button>
						<button onClick={() => trackDB.addNewSampler(savedState.id, "808")}>+ Drums</button>
							
						<FileUpload
							onFileSelectSuccess={(file) => setSelectedFile(file)}
							onFileSelectError={({ error }) => alert(error)}
						/>
						<button onClick={uploadAudio}>+ Audio</button>


						</ div>
					</TabPanel>
					{activeTabs.map(tab =>
						<TabPanel key={`panel${tab.id}`} forceRender={true}>
							{tab.content}
						</TabPanel>
					)}
			</Tabs>
			</>
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
						
					</div>
					<div>
						tips
					</div>
					<div>
						settings
						<input type="text" value={name} onChange={e => setName(e.target.value)}/>
						<span>Projects</span>
						<button onClick={changeProject}>Open...</button>
						<button onClick={() => {
							const newState = {
								id: savedState.id,
								bpm: parseInt(Tone.getTransport().bpm.value),
								vol: parseInt(Tone.getDestination().volume.value),
								trackEnd: trackLength,
								name: name,
							}

							trackDB.save(newState)
						}}>Save</button>
						<button onClick={deleteProject}>Delete</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default DAW