import { useEffect, useReducer, useState, useRef } from "react";
import useTrack from './useTrack';

import * as Tone from "tone"

const Sequencer = ({id, steps, setSteps, globalBeat}) => {

  const trackContext = useTrack(id, "synth");

  const beat = useRef(globalBeat)

	const [, forceUpdate] = useReducer(x => x + 1, 0);

	const toggleNote = (noteIndex, stepIndex) => { // update steps 2d array when toggling buttons
		const newSteps = steps.slice()
		newSteps[noteIndex][stepIndex] = !newSteps[noteIndex][stepIndex]
		setSteps(newSteps)
		forceUpdate()
	}

  useEffect(() => {
    Tone.getTransport().scheduleRepeat(time => {
      beat.current = beat.current + 0.5
    }, "8n", "0:0:0");
  }, [])


  return trackContext.notes.map((note, noteIndex) => {
    return (
    <div className="note-row" key={note}>
      <span className="note-name">{note}</span>
      {steps[noteIndex].map((step, stepIndex) => {
        let buttonClass = "sequencer-button"
        if(step){
          buttonClass += " sequencer-active"
        }

        if((beat.current % 8) == stepIndex){
          buttonClass += " sequencer-playing"
        }

        return (
          <button
            className={buttonClass}
            key={`${noteIndex}${stepIndex}`}
            onClick={() => toggleNote(noteIndex, stepIndex)}
          >
          </button>
        );
      })}
    </div>
    );
  });
 
};

export default Sequencer;
