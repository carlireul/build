import { useState, useEffect, useRef } from 'react';

import * as Tone from "tone";
import Peaks from 'peaks.js';

import TrackControls from './TrackControls';
import Renamable from './Renamable';

import useTrack from './useTrack';

function AudioTrack({id, addTab, deleteTrack}){
	const trackContext = useTrack(id, "audio")

	const [loaded, setLoaded] = useState(false);

	const controls = useRef();
	const peaks = useRef();

	const containerRef = useRef();

	function fetchAndDecode(audioContext, url) {
		// Load audio file into an AudioBuffer
		return fetch(url)
			.then(function (response) {
				return response.arrayBuffer();
			})
			.then(function (buffer) {
				// console.log(buffer)
				return audioContext.decodeAudioData(buffer);
			});
	}

	function fetchAndUpdateWaveform(peaksInstance, audioContext, source) {
		return fetchAndDecode(audioContext, source.mediaUrl)
			.then(function (audioBuffer) {
				// Update the Peaks.js waveform view with the new AudioBuffer.
				// The AudioBuffer is passed through to the external player's setSource()
				// method, to update the player.
				peaksInstance.setSource({
					webAudio: {
						audioBuffer: audioBuffer,
						scale: 128,
						multiChannel: false
					}
				}, function (error) {
					if (error) {
						console.error('setSource error', error);
					}
				});
			});
	}

	useEffect(() => { // setup: load controls and player
		controls.current = new Tone.Channel(-8, 0).toDestination();
		trackContext.mute() // for testing

		const initPlayer = async () => {
			await fetchAndDecode(Tone.getContext(), trackContext.source)
				.then((audioBuffer) => {
					const peaksPlayer = {
						eventEmitter: null,
						externalPlayer: new Tone.Player(audioBuffer),
						playbackSchedule: null,

						init: function (eventEmitter) {
							this.externalPlayer.sync().start(0) // puts Tone player in transport
							this.externalPlayer.chain(controls.current)

							setLoaded(true)

							this.eventEmitter = eventEmitter;

							return Promise.resolve();
						},

						destroy: function () {
							this.externalPlayer.disconnect()
							this.externalPlayer.dispose()

							if (this.playbackSchedule) {
								Tone.getTransport().clear(this.playbackSchedule)
							}

							this.externalPlayer = null;
							this.eventEmitter = null;
						},

						play: function () {
							if(this.playbackSchedule){
								Tone.getTransport().clear(this.playbackSchedule)
							}

							// this.playbackSchedule = Tone.getTransport().scheduleRepeat(time => {
							// 	this.eventEmitter.emit('player.timeupdate', this.getCurrentTime())
							// 	console.log("hi")
							// }, "0.25", "0:0:0")

							Tone.getTransport().start();
							
							this.eventEmitter.emit('player.playing', this.getCurrentTime());
						},

						pause: function () {
							Tone.getTransport().pause();

							this.eventEmitter.emit('player.pause', this.getCurrentTime());
						},

						isPlaying: function () {
							return Tone.getTransport().state === "started";
						},

						seek: function (time) {
							Tone.getTransport().seconds = time;

							this.eventEmitter.emit('player.seeked', this.getCurrentTime());
							this.eventEmitter.emit('player.timeupdate', this.getCurrentTime());
						},

						isSeeking: function () {
							return false;
						},

						getCurrentTime: function () {
							return Tone.getTransport().seconds;
						},

						getDuration: function () {
							return this.externalPlayer.buffer.duration;
						},

						setSource: function (opts) {
							if (this.isPlaying()) {
								this.pause();
							}

							// Update the Tone.js Player object with the new AudioBuffer
							this.externalPlayer.buffer.set(opts.webAudio.audioBuffer);

							return Promise.resolve();
						},
					};

					const options = {
						zoomview: {
							container: containerRef.current,
							waveformColor: "#74C0FC",
							playheadColor: 'transparent',
						},
						player: peaksPlayer,
						webAudio: {
							audioBuffer: audioBuffer,
							scale: 128,
							multiChannel: false
						},
					};

					Peaks.init(options, function (err, instance) {
						if (err) {
							console.error('Failed to initialize Peaks instance: ' + err.message);
							return;
						}
						peaks.current = instance
						// console.log("instance", peaks.current, peaks.current.player.getCurrentTime());
					});
				})
		}

		initPlayer()

		return () => { //cleanup
			if(peaks.current){
				peaks.current.player.destroy()
			}

			controls.current.disconnect()
			controls.current.dispose()

		}

	}, [])

	useEffect(() => {

		fetchAndUpdateWaveform(peaks.current, Tone.getContext(), trackContext.source) 

	}, [trackContext.source])

	if (controls.current) {
		controls.current.solo = trackContext.solod;
		controls.current.volume.value = trackContext.vol;
		controls.current.pan.value = trackContext.pan;
		controls.current.mute = trackContext.muted;
	}

	return (
		<div className="track-container">
			<div className="track-timeline-audio" ref={containerRef}></div>
			<div className="track-controls">
				<div className="row row-cols-lg-auto g-1 align-items-center">
					<button className="track-button" onClick={() => {
						if(loaded){
							addTab({
								id: id,
								title: trackContext.name,
								content: <TrackControls id={id} />
							})
						}
					}
					}>
					<i className="fa-solid fa-file-audio"></i>
					</button>
					<Renamable name={trackContext.name ? trackContext.name : "Untitled"} handler={trackContext.rename}>
						<button className="track-button" onClick={() => deleteTrack(id)}> <i className="fa-solid fa-xmark"></i></button>
					</Renamable>

				</div>
				{loaded ? <TrackControls id={id} /> : "Loading Audio.."}
			</div>
		</div>
	)
}

export default AudioTrack