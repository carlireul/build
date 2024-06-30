import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";

const Timeline = () => {

	const wavesurfer = WaveSurfer.create({
		container: '#waveform',
		waveColor: '#4F4A85',
		progressColor: '#383351',
		url: '/audio.mp3',
	})

	return (
	<>
	<div className=".timeline-container">
		<div id="waveform"></div>
	</div>
	</>
	)
}

export default Timeline