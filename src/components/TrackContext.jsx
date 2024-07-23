import { useState, createContext, useEffect } from 'react';
import { synths } from '../data/synths';
import { audio } from '../data/audio';
import { Scale } from 'tonal';

const TrackContext = createContext([{}, () => {}]);

const TrackProvider = (props) => {

  const tracks = {}

  useEffect(() => {

    const defaultControls = {
      muted: false,
      vol: -8,
      solod: false,
      pan: 0
    }

    for (const track of synths) {
      const notes = Scale.get(track.notes.scale).notes
      const steps = new Array(notes.length).fill(null).map(() => new Array(track.notes.subdivision).fill(false));

      tracks[track.id] = {
        ...track,
        controls: { ...defaultControls },
        steps: steps,
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