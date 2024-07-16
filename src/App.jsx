import { useEffect, useState } from 'react'

import * as Tone from "tone"
import uniqid from 'uniqid';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './App.css'
import './Style.css'
import 'react-tabs/style/react-tabs.css'

import Workstation from './components/Workstation.jsx'

function App() {

  const [visible, setVisible] = useState(false)
  const [activeTabs, setActiveTabs] = useState([])

  const handleClick = () => {
    Tone.start()
    Tone.getTransport().loop = true;
    Tone.getTransport().loopStart = 0;
    Tone.getTransport().loopEnd = "1:0:0";
    setVisible(true)
  }

  const generateTabs = () => {
    return (
      <Tabs>
        <TabList>
          <Tab>Timeline</Tab>
          {activeTabs.map(tab => <Tab key={`tab${tab.id}`}>{tab.title} <button value={tab.id} onClick={(e) => (closeTab(e.target.value))}>X</button></Tab>)}
        </TabList>
        <TabPanel forceRender={true}>
          <Workstation addTab={addTab} />
        </TabPanel>
        {activeTabs.map(tab => <TabPanel key={`panel${tab.id}`}>{tab.content}</TabPanel>)}
      </Tabs>
    )
  }

  const addTab = (newTab) => {
    if (!activeTabs.find(tab => tab.id == newTab.id)){
      setActiveTabs(prev => [...prev, newTab])
    }
  }

  const closeTab = (id) => {
    setActiveTabs(prev => prev.filter(item => item.id != id))
  }

  return (
    <div className="app-container">
     
      <button className="start-button"style={visible ? {display: 'none'} : null} onClick={handleClick}>Start</button>

      <div style={visible ? null : { display: 'none' }}>
          {generateTabs()}
      </div>

    </div>
  )
}

export default App
