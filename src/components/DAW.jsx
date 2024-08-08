import { useEffect, useState, useRef } from 'react'
import db from '../data/db.js';
import { presets } from '../data/synths.js';


import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Tooltip } from 'react-tooltip';

import * as Tone from "tone"

import useTrackDB from './useTrackDB.jsx';

import GlobalControls from './GlobalControls'
import SynthTrack from './SynthTrack'
import AudioTrack from './AudioTrack'
import SamplerTrack from './SamplerTrack.jsx'
import FileUpload from './FileUpload.jsx';
import Renamable from './Renamable.jsx';
import Visualizer from './Visualizer.jsx';

const DAW = ({ savedState, deleteProject, changeProject }) => {
	// DB

	const trackDB = useTrackDB()

	// UI state

	const [visible, setVisible] = useState(false)
	const [activeTabs, setActiveTabs] = useState([])
	const [selectedFile, setSelectedFile] = useState(null);
	const [name, setName] = useState(savedState.name)
	const [tooltipsEnabled, setTooltipsEnabled] = useState(true)

	// Tone setup

	const [trackLength, setTrackLength] = useState(savedState.trackEnd)	

	// Handlers

	const handleClick = () => { // Start button
		Tone.start()
		Tone.getTransport().loop = true;
		Tone.getTransport().loopStart = 0;
		Tone.getTransport().loopEnd = "8:0:0"
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
					<Tab>Overview</Tab>
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
			<button id="start-button" className="btn btn-primary" style={visible ? { display: 'none' } : null} onClick={handleClick}><i className="fa-solid fa-music"></i> Start</button>

			<div className="container h-100" style={visible ? null : { display: 'none' }}>
				<div className="row">
					{generateTabs()}
				</div>
				<div className=" row mt-auto">
					<div className="col-7">
						<GlobalControls savedState={savedState} />
						<div className="row row-cols-lg-auto g-2 align-items-center">

						<button className="btn btn-secondary" onClick={() => trackDB.addNewSynth(savedState.id)}>Add Synth</button>

						<div className="dropup">
							<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
								Add Drumkit
							</button>
							<ul className="dropdown-menu">
								<li><a className="dropdown-item" onClick={() => trackDB.addNewSampler(savedState.id, "808")}>808</a></li>
								<li><a className="dropdown-item" onClick={() => trackDB.addNewSampler(savedState.id, "acoustic")}>Acoustic</a></li>
								<li><a className="dropdown-item" onClick={() => trackDB.addNewSampler(savedState.id, "analog")}>Analog</a></li>
								<li><a className="dropdown-item" onClick={() => trackDB.addNewSampler(savedState.id, "electro")}>Electro</a></li>
								<li><a className="dropdown-item" onClick={() => trackDB.addNewSampler(savedState.id, "random")}>Random</a></li>
							</ul>
						</div>
						<FileUpload
							onFileSelectSuccess={(file) => setSelectedFile(file)}
							onFileSelectError={({ error }) => alert(error)}
						/>
						{ selectedFile ? <button className="btn btn-secondary" onClick={uploadAudio}>+</button> : null }
						</div>
						
					</div>
					<div className="col-3">
						<div className="form-check">
							<input className="form-check-input" checked={tooltipsEnabled} type="checkbox" value="" id="tooltipcheckbox" onChange={() => setTooltipsEnabled((prev) => !prev)} />
							<label className="form-check-label" htmlFor="tooltipcheckbox">
									Show tooltips
								</label>
						</div>

						{ tooltipsEnabled ? <Tooltip
							id="tooltip"
							style={{ backgroundColor: "#74C0FC", color: "#fff" }}
							render={({ content }) => (
								<span>
									{content}
								</span>
							)}
						/> : null }
					</div>
					<div className="col-2">
						<div className="row g-1 pb-2 align-items-center">
							<Renamable name={name} handler={setName} />
						</div>
						<div className="row">
							<div className="dropup">
									<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
										Project Options
									</button>
									<ul className="dropdown-menu">
										<li><a className="dropdown-item" onClick={() => {
											const newState = {
												id: savedState.id,
												bpm: parseInt(Tone.getTransport().bpm.value),
												vol: parseInt(Tone.getDestination().volume.value),
												trackEnd: trackLength,
												name: name,
											}

											trackDB.save(newState)
										}}>Save</a></li>
										<li><a className="dropdown-item" onClick={changeProject}>Open...</a></li>
										<li><a className="dropdown-item" onClick={deleteProject}>Delete</a></li>
									</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default DAW