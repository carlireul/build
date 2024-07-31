import { useEffect, useState } from "react";
import useTrack from './useTrack';
import { getBeat } from '../services/helpers'

import * as Tone from "tone"

const Sequencer = ({id, type}) => {

  const trackContext = useTrack(id, type);

  const [drawIndex, setDrawIndex] = useState(0)

  useEffect(() => {
    const drawSchedule = Tone.getTransport().scheduleRepeat(() => {
      setDrawIndex(getBeat(Tone.getTransport().position, trackContext.subdivision))
    },
      `${trackContext.subdivision}n`, // repetition interval
      "0:0:0")

      return () => {
        Tone.getTransport().clear(drawSchedule)
      }
  }, [trackContext.subdivision])

  return trackContext.notes.map((note, noteIndex) => {
    return (
    <div className="note-row" key={note}>
      <span className="note-name">{note}</span>
      {trackContext.steps[noteIndex].map((step, stepIndex) => {
        let buttonClass = "sequencer-button"
        if(step){
          buttonClass += " sequencer-active"
        }

        if (drawIndex == stepIndex){
          buttonClass += " sequencer-playing"
        }

        return (
          <button
            className={buttonClass}
            key={`${noteIndex}${stepIndex}`}
            onClick={() => trackContext.toggleNote(noteIndex, stepIndex)}
          >
          </button>
        );
      })}
    </div>
    );
  });
 
};

export default Sequencer;
