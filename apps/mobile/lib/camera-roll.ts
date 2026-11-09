// The sample camera roll is one flat screenshot, so each clip is located by its pixel position in the file.
// The roll stops at the end of row 4: everything below that is iOS UI captured in the screenshot.
export const rollImage = require("../assets/images/camera-roll.png");

export const ROLL_SOURCE = { width: 1170, height: 2532, cropTop: 568.2, cropBottom: 2128 };
export const ROW_HEIGHT = 386;

// Slots and journal photos leave out the bottom of the cell, where the heart and duration are baked in.
export const PHOTO_CROP_HEIGHT = 320;

const COLUMNS = [
  { x: 0, width: 387 },
  { x: 392, width: 386 },
  { x: 783, width: 387 },
];
const ROWS_Y = [566, 958, 1350, 1742];
const SECONDS = [24, 17, 38, 31, 37, 5, 15, 17, 9, 22, 13, 34];

export const PHOTOS = ROWS_Y.flatMap((y) => COLUMNS.map((column) => ({ ...column, y }))).map((photo, index) => ({
  ...photo,
  seconds: SECONDS[index],
}));

export const formatDuration = (seconds: number) => {
  const whole = Math.round(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
};
