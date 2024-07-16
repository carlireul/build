import { useState, useEffect, useRef, useReducer } from "react";

const Sequencer = ({notes, steps, octave, setSteps}) => {

	const [, forceUpdate] = useReducer(x => x + 1, 0);

	const toggleNote = (noteIndex, stepIndex) => { // update steps 2d array when toggling buttons
		const newSteps = steps.slice()
		newSteps[noteIndex][stepIndex] = !newSteps[noteIndex][stepIndex]
		setSteps(newSteps)
		forceUpdate()
	}

  return notes.map((note, noteIndex) => {
    return (
    <div key={`${note}${octave}`}>
      <span>{`${note}${octave}`}</span>
      {steps[noteIndex].map((step, stepIndex) => {
        return (
          <button
            style={step ? { color: "blue" } : null}
            key={`${noteIndex}${stepIndex}`}
            onClick={() => toggleNote(noteIndex, stepIndex)}
          >
            {step ? "on" : "off"}
          </button>
        );
      })}
    </div>
    );
  });
 
};

export default Sequencer;
