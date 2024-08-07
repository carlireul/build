import { useState, createContext, useEffect } from 'react';
import db from '../data/db';

const TrackContext = createContext([{}, () => {}]);

const TrackProvider = ({id, children}) => {

  const tracks = {}

  useEffect(() => {

    const fetchData = async () => {

      await db.transaction('r', db.states, db.tracks, async () => {

        const idData = await db.states.where("id").equals(id).first()

        const data = await db.tracks.toArray()

        for (const track of data) {
          if (idData.tracks.includes(track.id)) {
            if (track.type == "synth") {
              // const clips = {}
              // if (track.clips){
              //   for (const [key, value] of Object.entries(track.clips)){
              //     clips[key] = { ...clips[key], source: URL.createObjectURL(value.file) }
              //   }
              // }
              tracks[track.id] = { ...track, 
                // clips: {...clips} 
              }
            }
            else if (track.type == "audio") tracks[track.id] = { ...track, source: URL.createObjectURL(track.file) }
            else if (track.type == "sampler") tracks[track.id] = { ...track }
          } 
        }

      })
      

    }

    fetchData().catch(console.error)

    return () => {

    }
  }, [])

  const [state, setState] = useState(tracks);

  return (
    <TrackContext.Provider value={[state, setState]}>
      {children}
    </TrackContext.Provider>
  );
}

export { TrackContext, TrackProvider, };