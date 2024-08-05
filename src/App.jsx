import { useEffect, useRef, useState } from 'react';
import './App.css'
import DAW from './components/DAW.jsx';
import { TrackProvider } from './components/TrackContext.jsx';
import { useLiveQuery } from "dexie-react-hooks";
import db from './data/db.js';
import { defaultControls, defaultSteps, presets, defaultEffects } from './data/synths.js';
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
      effects : {
        ...defaultEffects
      },
      steps: defaultSteps
    }

    const newProject = {
      id: projectID,
      bpm: 120,
      vol: -8,
      position: "0:0:0",
      trackEnd: "1:0:0",
      name: `Untitled Project ${projects.length + 1}`,
      tracks: [trackID]
    }

    await db.transaction('rw', db.states, db.tracks, () => {
      db.tracks.add(synth)
      db.states.add(newProject)
    })

    setSelectedProject(newProject.id)

  }

  const deleteProject = async (id) => {
    setSelectedProject(null)
    await db.states.delete(id)
  }

  const changeProject = () => {
    setSelectedProject(null)
  }

  if(!projects) return null;

  return (<>
      { selectedProject ?
      <TrackProvider id={selectedProject}>
        <DAW savedState={projects.find(project => project.id == selectedProject)} deleteProject={() => deleteProject(selectedProject)} changeProject={changeProject}/>
      </TrackProvider> 
      : 
        <div className="btn-group">
          <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            Open Project...
          </button>
          <ul className="dropdown-menu">
            {projects.map(project => {
              return <li key={project.id}><a className="dropdown-item" onClick={() => setSelectedProject(project.id)}>{project.name}</a></li> 
            })}
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" onClick={newProject}>New Project</a></li>
          </ul>
        </div>

       }
    
  </>
    
  )
}

export default App
