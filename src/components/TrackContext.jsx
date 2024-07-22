import { useState, createContext, useEffect } from 'react';
import { synths } from '../data/synths';
import { audio } from '../data/audio';

const TrackContext = createContext([{}, () => {}]);

const TrackProvider = (props) => {

  const tracks = {}

  useEffect(() => {
    const globalBeat = 0

    const defaultControls = {
      muted: false,
      vol: -8,
      solod: false,
      pan: 0
    }

    for (const track of synths) {
      tracks[track.id] = {
        ...track,
        controls: { ...defaultControls }
      }
    }

    for (const track of audio) {
      tracks[track.id] = {
        ...track,
        controls: { ...defaultControls }
      }
    }
  }, [])

  const [state, setState] = useState(tracks);

  return (
    <TrackContext.Provider value={[state, setState]}>
      {props.children}
    </TrackContext.Provider>
  );
}

export { TrackContext, TrackProvider, };