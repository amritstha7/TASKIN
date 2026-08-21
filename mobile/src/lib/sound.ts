import { createAudioPlayer } from 'expo-audio';

const chimeAsset = require('../../assets/sounds/chime.wav');

/** Short two-tone confirmation chime, matching the original web app's completion sound. */
export function playChime(): void {
  const player = createAudioPlayer(chimeAsset);
  player.play();
  setTimeout(() => {
    player.remove();
  }, 600);
}
