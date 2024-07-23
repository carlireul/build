import { useEffect, useState } from 'react'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './App.css'

import * as Tone from "tone"

import { audio } from './data/audio.js';
import { synths, newSynth } from './data/synths.js';

import { TrackProvider } from './components/TrackContext.jsx';
import GlobalControls from './components/GlobalControls.jsx';
import AudioTrack from './components/AudioTrack.jsx';
import SynthTrack from './components/SynthTrack.jsx';

function App() {

  // UI state

  const [visible, setVisible] = useState(false)
  const [activeTabs, setActiveTabs] = useState([])
  
  // Tone setup
  
  const [trackLength, setTrackLength] = useState("1:0:0")
  const [audioTracks, setAudioTracks] = useState(null);
  const [synthTracks, setSynthTracks] = useState(null);

  useEffect(() => { // set up: create audio + synth tracks
    const defaultAudioTracks = [{
        id: audio[0].id,
        source: audio[0].src,
        title: audio[0].title
      }]
    setAudioTracks(defaultAudioTracks)
    
    setSynthTracks([synths[0]]);

  }, [])

  // Handlers

  const handleClick = () => { // Start button
    Tone.start()
    Tone.getTransport().loop = true;
    Tone.getTransport().loopStart = 0;
    Tone.getTransport().loopEnd = trackLength;
    setVisible(true)
  }

  const newSynthTrack = () => {
    const newTrack = newSynth()
    setSynthTracks(prev => [...prev, newTrack])
  }

  const deleteSynthTrack = (id) => {
    setSynthTracks(synthTracks.filter(item => item.id !== id))
    closeTab(id)
  }

  // Tab management

  const generateTabs = () => {
    return (
      <Tabs onSelect={(index, lastIndex, event) => {
        if(event.target.className === "fa-solid fa-xmark"){
          console.log(index, lastIndex, event.target)
          return false
        }
      }}>
        <TabList>
          <Tab>Timeline</Tab>
          { activeTabs.map(tab =>
          <Tab key={`tab${tab.id}`}>
            {tab.title}
              
              <button className="tab-button" value={tab.id} onClick={(e) => (closeTab(tab.id))}> <i className="fa-solid fa-xmark"></i></button>
          </Tab>
          ) }
        </TabList>
        <TrackProvider>
          <TabPanel forceRender={true}>
            <div className="sequencer">

              { audioTracks ? audioTracks.map(track => 
                <AudioTrack key={track.id} id={track.id} addTab={addTab} />
              )
              : "Loading..." }

              

              { synthTracks ? synthTracks.map((track, i) => 
                  <SynthTrack key={track.id} id={track.id} num={i} addTab={addTab} deleteTrack={deleteSynthTrack} />
              )
              : "Loading" }

              <button onClick={newSynthTrack}>+ Add Synth</button>


            </ div>
          </TabPanel>
          { activeTabs.map(tab =>
            <TabPanel key={`panel${tab.id}`} forceRender={true}>
              {tab.content}
            </TabPanel>
          ) }
        </TrackProvider>
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

  return (
    <>
      <button id="start-button" style={visible ? { display: 'none' } : null} onClick={handleClick}><i className="fa-solid fa-music"></i> Start</button>

    <div id="app-container" style={visible ? null : { display: 'none' }}>
      <div id="top-container">
        {generateTabs()}
      </div>
      <div id="bottom-container">
        <div>
            <GlobalControls />
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

export default App
