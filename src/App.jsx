import { useRef, useState } from 'react'
import * as Tone from "tone"
import './App.css'
import PWABadge from './PWABadge.jsx'
import Sequencer from './components/Sequencer.jsx'
import SynthEditor from './components/SynthEditor.jsx'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'

function App() {

  const [load, setLoad] = useState(false)

  const handleClick = () => {
    Tone.start()
    Tone.getTransport().loop = true;
    Tone.getTransport().loopStart = 0;
    Tone.getTransport().loopEnd = "1:0:0";
    setLoad(true)
  }

  return (
    <>
    {load ? <Sequencer /> : <button onClick={handleClick}>Start</button>}
    
    <PWABadge />
    </>
  )
}

export default App
