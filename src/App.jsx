import { useRef, useState } from 'react'
import * as Tone from "tone"
import './App.css'
import PWABadge from './PWABadge.jsx'
import Sequencer from './components/Sequencer.jsx'

function App() {

  return (
    <>
      <Sequencer />

      <PWABadge />
    </>
  )
}

export default App
