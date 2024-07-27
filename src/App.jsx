import { useEffect, useRef, useState } from 'react';
import './App.css'
import DAW from './components/DAW.jsx';
import { TrackProvider } from './components/TrackContext.jsx';
import { useLiveQuery } from "dexie-react-hooks";
import db from './data/db.js';
import { defaultControls, defaultSteps, presets } from './data/synths.js';
import uniqid from "uniqid";

function App() { 

  // db.delete({ disableAutoOpen: false });

  const projects = useLiveQuery(() => db.states.toArray())
  const [selectedProject, setSelectedProject] = useState(null)

  const newProject = async () => {
    const projectID = uniqid()
    const trackID = uniqid()
    
    const synth = {
      ...presets[0],
      id: trackID,
      controls: {
        ...defaultControls
      },
      steps: defaultSteps
    }

    const newProject = {
      id: projectID,
      bpm: 120,
      vol: -8,
      position: "0:0:0",
      trackEnd: "9:0:0",
      name: "New Project",
      tracks: [trackID]
    }

    await db.tracks.add(synth)
    await db.states.add(newProject)

    setSelectedProject(newProject.id)

  }

  if(!projects) return null;

  return (<>
      { selectedProject ?
      <TrackProvider id={selectedProject}>
        <DAW savedState={projects.find(project => project.id == selectedProject)} />
      </TrackProvider> 
      : 
      <>
      <select name="" id="project-select" onChange={(e) => setSelectedProject(e.target.value)}>
        <option value="" disabled selected>Choose a project...</option>
        {projects.map(project => {
          return <option key={project.id} value={project.id}>{project.name}</option>
        })}
      </select>
      <button onClick={newProject}>New Project</button>
      </>
       }
    
  </>
    
  )
}

export default App
