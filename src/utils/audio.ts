export const playSound = (sound) => {
  const audio = new Audio(sound);
  console.log('playing sound', sound);
  audio.play();
};
