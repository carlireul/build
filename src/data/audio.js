import uniqid from 'uniqid';

import julia from "./julia.mp3";
import idk from "./idk.mp3";

export const audio = [
  {
    id: uniqid(),
    name: "Test Audio 1",
    source: julia,
  },
  {
    id: uniqid(),
    name: "Test Audio 2",
    source: idk,
  }
];