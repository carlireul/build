import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";
import { useWavesurfer } from '@wavesurfer/react'

const Waveform = ({source}) => {

	const containerRef = useRef()

	const wavesurfer = useWavesurfer({
		audioContext: Tone.getContext().rawContext._nativeAudioContext,
		container: containerRef,
		waveColor: '#4F4A85',
		progressColor: '#383351',
		url: source,
	})

	return(
		<div ref={containerRef} ></div>
	)
	
}

export default Waveform