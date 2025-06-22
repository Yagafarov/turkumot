import { Howl } from 'howler';
import correctSound from '../sounds/correct.mp3';
import wrongSound from '../sounds/wrong.mp3';

export const playCorrectSound = () => {
  new Howl({ src: [correctSound] }).play();
};

export const playWrongSound = () => {
  new Howl({ src: [wrongSound] }).play();
};
