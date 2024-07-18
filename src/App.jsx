import { useEffect, useState, useRef } from 'react'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './App.css'
import 'react-tabs/style/react-tabs.css'

import * as Tone from "tone"

import { audio } from './data/audio.js';
import { synths, newSynth } from './data/synths.js';

import { TrackProvider } from './components/TrackContext.jsx';
import GlobalControls from './components/GlobalControls.jsx';
import AudioTrack from './components/AudioTrack.jsx';
import SynthTrack from './components/SynthTrack.jsx';

function App() {

  // App state

  const [visible, setVisible] = useState(false)
  const [activeTabs, setActiveTabs] = useState([])
  const [trackLength, setTrackLength] = useState("1:0:0")

  // Tone setup

  const globalBeat = useRef(0);

  const [audioTracks, setAudioTracks] = useState(null);
  const [synthTracks, setSynthTracks] = useState(null);

  useEffect(() => { // set up: create audio + synth tracks, start global beat
    const defaultAudioTracks = [
      {
        id: audio[0].id,
        source: audio[0].src,
        title: audio[0].title
      },
      {
        id: audio[1].id,
        source: audio[1].src,
        title: audio[1].title
      }
    ]
    setAudioTracks(defaultAudioTracks)
    setSynthTracks([synths[0]]);

    Tone.getTransport().scheduleRepeat(time => {
      globalBeat.current = globalBeat.current + 0.5
    }, "8n", "0:0:0");
  }, [])

  // Tone functionality

  const newSynthTrack = () => {
    const newTrack = { ...synths[1] } // TODO: choose options
    setSynthTracks(prev => [...prev, newTrack]);
  }

  // Handlers

  const handleClick = () => {
    Tone.start()
    Tone.getTransport().loop = true;
    Tone.getTransport().loopStart = 0;
    Tone.getTransport().loopEnd = trackLength;
    setVisible(true)
  }

  // Tab management

  const generateTabs = () => {
    return (
      <Tabs>
        <TabList>
          <Tab>Timeline</Tab>
          { activeTabs.map(tab =>
          <Tab key={`tab${tab.id}`}>
            {tab.title}
            <button className="tab-button" value={tab.id} onClick={(e) => (closeTab(e.target.value))}>X</button>
          </Tab>
          ) }
        </TabList>
        <TrackProvider>
          <TabPanel forceRender={true}>
            <div className="sequencer">

              { audioTracks ? audioTracks.map(track => 
                <AudioTrack key={track.id} id={track.id} source={track.source} title={track.title} addTab={addTab} />
              )
              : "Loading..." }

              <button onClick={newSynthTrack}>+ Add Synth</button>

              { synthTracks ? synthTracks.map((track, i) => 
                  <SynthTrack key={track.id} id={track.id} noteProperties={track.notes} num={i} globalBeat={globalBeat} addTab={addTab} />
              )
              : "Loading" }


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
    <button id="start-button"style={visible ? {display: 'none'} : null} onClick={handleClick}>Start</button>

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
