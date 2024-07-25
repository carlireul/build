import './App.css'
import DAW from './components/DAW.jsx';
import { TrackProvider } from './components/TrackContext.jsx';

function App() { 


  return (
    <TrackProvider>
      <DAW />
    </TrackProvider>
    
  )
}

export default App
