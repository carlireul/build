import { useState, createContext, useEffect } from 'react';
import db from '../data/db';

const TrackContext = createContext([{}, () => {}]);

const TrackProvider = (props) => {

  const tracks = {}

  useEffect(() => {

    const fetchData = async () => {
      const data = await db.tracks.toArray()
      // audio

      for (const track of data) {
        tracks[track.id] = {...track}
      }

    }

    fetchData().catch(console.error)
  }, [])

  const [state, setState] = useState(tracks);

  return (
    <TrackContext.Provider value={[state, setState]}>
      {props.children}
    </TrackContext.Provider>
  );
}

export { TrackContext, TrackProvider, };