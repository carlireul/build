import { useRef, useState } from 'react'
import * as Tone from "tone"
import './App.css'
import PWABadge from './PWABadge.jsx'
import Sequencer from './components/Sequencer.jsx'
import SynthEditor from './components/SynthEditor.jsx'

function App() {

  return (
    <>
      {/* <Sequencer /> */}
      <SynthEditor />
      <PWABadge />
    </>
  )
}

export default App
