import { useState } from 'react'
import * as Tone from "tone"
import './App.css'
import Sequencer from './components/Sequencer.jsx'

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
    </>
  )
}

export default App
