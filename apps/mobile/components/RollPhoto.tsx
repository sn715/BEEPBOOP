import { Image } from "expo-image";

import { PHOTO_CROP_HEIGHT, PHOTOS, rollImage, ROLL_SOURCE } from "../lib/camera-roll";

// Crops one photo out of the camera roll screenshot to fill a parent of the given size.
// The parent needs overflow: "hidden".
export function RollPhoto({ photo: index, width, height }: { photo: number; width: number; height: number }) {
  const photo = PHOTOS[index];
  const scale = Math.max(height / PHOTO_CROP_HEIGHT, width / photo.width);
  const left = photo.x + (photo.width - width / scale) / 2;

  return (
    <Image
      source={rollImage}
      contentFit="fill"
      style={{
        position: "absolute",
        left: -left * scale,
        top: -photo.y * scale,
        width: ROLL_SOURCE.width * scale,
        height: ROLL_SOURCE.height * scale,
      }}
    />
  );
}
