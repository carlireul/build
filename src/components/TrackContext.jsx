import { useState, createContext } from 'react';
import { synths } from '../data/synths';

const TrackContext = createContext([{
  muted: false,
  vol: -8,
  solod: false,
  pan: 0
}, () => {}]);

const TrackProvider = (props) => {

  const tracks = {}

  const defaultControls = {
    muted: false,
    vol: -8,
    solod: false,
    pan: 0
  }

  for(const track of synths){
    tracks[track.id] = {
      ...track,
      controls: {...defaultControls}
    }
  }

  const [state, setState] = useState(tracks);

  return (
    <TrackContext.Provider value={[state, setState]}>
      {props.children}
    </TrackContext.Provider>
  );
}

export { TrackContext, TrackProvider };