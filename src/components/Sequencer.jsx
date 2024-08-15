import { useEffect, useState } from "react";
import useTrack from './useTrack';
import { getBeat, toTitleCase } from '../services/helpers'

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
    return (<>
      <div className="d-flex flex-row gap-1 justify-content-evenly" key={`${note}${noteIndex}-row`}>
        <div className="col-1">
          <span className="note-name">{toTitleCase(note.split("_")[0])}</span>
        </div>
      {trackContext.steps[noteIndex].map((step, stepIndex) => {
        let buttonClass = "sequencer-button"
        if(step){
          buttonClass += " sequencer-active"
        }

        if(stepIndex % (trackContext.subdivision / 4) == 0){
          buttonClass += " sequencer-beat"
        }

        if (drawIndex == stepIndex){
          buttonClass += " sequencer-playing"
        }

        return (
          <div className="flex-grow-1" key={`${noteIndex}${stepIndex}`}>

          <button
            className={buttonClass}
            
            onClick={() => trackContext.toggleNote(noteIndex, stepIndex)}
            >
          </button>
          </div>
        );
      })}
    </div>
            </>
    );
  });
 
};

export default Sequencer;
