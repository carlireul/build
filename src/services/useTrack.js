import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

export function useTrack({id, source, title}) {

  const player = useRef();
  const controls = useRef();

  const [muted, setMuted] = useState(true);
  const [vol, setVol] = useState(-8);
  const [pan, setPan] = useState(0);
  const [solod, setSolod] = useState(false);

  useEffect(() => {
    // setup: load controls and player
    controls.current = new Tone.Channel(-8, 0).toDestination();

    controls.current.mute = true; // for testing

    player.current = new Tone.Player(source, () => {
      player.current.sync().start(0); // puts in transport
    }).chain(controls.current);

  }, []);

  useEffect(() => {
    controls.current.solo = solod;
    controls.current.volume.value = vol;
    controls.current.pan.value = pan;
    controls.current.mute = muted;

  }, [muted, vol, pan, solod])

  const mute = () => {
    setMuted((prev) => !prev);
  };

  const changeVol = (value) => {
    setVol(value);
  };

  const changePan = (value) => {
    setPan(value);
  };

  const centrePan = () => {
    setPan(0);
  };

  const toggleSolo = () => {
    setSolod((prev) => !prev);
  };

  const track = {
    title: title,
    id: id,
    mute: {
      value: muted,
      toggle: mute
    },
    vol: {
      value: vol,
      set: changeVol
    },
    pan: {
      value: pan,
      set: changePan,
      centre: centrePan
    },
    solo: {
      value: solod,
      toggle: toggleSolo
    }  
  }

  return track

}
