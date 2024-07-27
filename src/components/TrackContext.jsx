import { useState, createContext, useEffect } from 'react';
import db from '../data/db';

const TrackContext = createContext([{}, () => {}]);

const TrackProvider = ({id, children}) => {

  const tracks = {}

  useEffect(() => {

    const fetchData = async () => {
      const idData = await db.states.where("id").equals(id).first()
      console.log(idData.tracks)

      const data = await db.tracks.toArray()

      for (const track of data) {
        if(idData.tracks.includes(track.id)){
          if(track.type == "synth") tracks[track.id] = {...track}
          else if (track.type == "audio") tracks[track.id] = { ...track, source: URL.createObjectURL(track.file) }
        } else{
          console.log("not included", track)
        }
      }

    }

    fetchData().catch(console.error)
  }, [])

  const [state, setState] = useState(tracks);

  return (
    <TrackContext.Provider value={[state, setState]}>
      {children}
    </TrackContext.Provider>
  );
}

export { TrackContext, TrackProvider, };