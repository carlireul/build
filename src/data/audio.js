import uniqid from 'uniqid';

import julia from "./julia.mp3";
import idk from "./idk.mp3";

export const audio = [
  {
    title: "Audio 1",
    src: julia,
    id: uniqid()
  },
  {
    title: "Audio 2",
    src: idk,
    id: uniqid()
  }
];