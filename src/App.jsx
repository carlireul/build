import { useState } from 'react';
import { injectSpeedInsights } from '@vercel/speed-insights';
import './App.css'
import * as Tone from "tone";
import DAW from './components/DAW.jsx';
import { TrackProvider } from './components/TrackContext.jsx';
import { useLiveQuery } from "dexie-react-hooks";
import db from './data/db.js';
import { defaultControls, defaultSteps, presets, defaultEffects } from './data/synths.js';
import uniqid from "uniqid";

function App() { 

  injectSpeedInsights();

  // db.delete({ disableAutoOpen: false });

  const projects = useLiveQuery(() => db.states.toArray())

  const [selectedProject, setSelectedProject] = useState(null)

  const newProject = async () => {
    const projectID = uniqid()
    const synthID = uniqid()
    const samplerID = uniqid()
    
    const synth = {
      ...presets[0],
      id: synthID,
      controls: {
        ...defaultControls
      },
      effects : {
        ...defaultEffects
      },
      steps: defaultSteps
    }

    const instruments = {}
    let counter = 0;
    const sample_data = await db.samples.where("pack").equals("808").toArray()
    for (const sample of sample_data) {
      if ([sample.sample_type] in instruments) {
        instruments[`${sample.sample_type}_${counter}`] = sample.source
        counter += 1;
      } else {

        instruments[sample.sample_type] = sample.source
      }
    }

    const sampler = {
      id: samplerID,
      type: "sampler",
      name: "Drums",
      controls: {
        ...defaultControls
      },
      subdivision: 8,
      instruments: instruments,
      steps: new Array(Object.keys(instruments).length).fill(null).map(() => new Array(8).fill(false)),
      effects: {
        ...defaultEffects
      },
      synth: {
        filter: {
          wet: 0,
          cutoff: 0,
          type: "highpass",
          rate: 0,
          rolloff: -12,
        }
      },
      // clips: {}
    }

    const newProject = {
      id: projectID,
      bpm: 120,
      vol: -8,
      position: "0:0:0",
      trackEnd: "1:0:0",
      name: `Untitled Project ${projects.length + 1}`,
      tracks: [synthID, samplerID]
    }

    await db.transaction('rw', db.states, db.tracks, () => {
      db.tracks.add(synth)
      db.tracks.add(sampler)
      db.states.add(newProject)
    })

    setSelectedProject(newProject.id)

  }

  const deleteProject = async (id) => {
    setSelectedProject(null)
    await db.states.delete(id)
  }

  const changeProject = () => {
    Tone.getTransport().stop()
    setSelectedProject(null)
  }

  if(!projects) return null;

  return (<>
      { selectedProject ?
      <TrackProvider id={selectedProject}>
        <DAW savedState={projects.find(project => project.id == selectedProject)} deleteProject={() => deleteProject(selectedProject)} changeProject={changeProject}/>
      </TrackProvider> 
      : 
        <div className="btn-group m-3">
          <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            Open Project...
          </button>
          <ul className="dropdown-menu">
            {projects.map(project => {
              return <li key={project.id}><a className="dropdown-item" onClick={() => {
                Tone.start()
                setSelectedProject(project.id)}}>{project.name}</a></li> 
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
