import { useReducer } from "react";
import useTrack from './useTrack';

const Sequencer = ({id, steps, setSteps}) => {

  const trackContext = useTrack(id);

	const [, forceUpdate] = useReducer(x => x + 1, 0);

	const toggleNote = (noteIndex, stepIndex) => { // update steps 2d array when toggling buttons
		const newSteps = steps.slice()
		newSteps[noteIndex][stepIndex] = !newSteps[noteIndex][stepIndex]
		setSteps(newSteps)
		forceUpdate()
	}

  return trackContext.notes.map((note, noteIndex) => {
    return (
    <div key={note}>
      <span>{note}</span>
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
