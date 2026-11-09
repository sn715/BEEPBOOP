import { Platform, useWindowDimensions } from "react-native";

// On a wide browser the web demo sits inside a phone-sized frame, so screens size themselves to the frame, not the window.
export const PHONE = { width: 393, height: 852 };
const FRAME_BREAKPOINT = 600;

export function useIsFramed() {
  const { width } = useWindowDimensions();
  return Platform.OS === "web" && width > FRAME_BREAKPOINT;
}

export function useScreenWidth() {
  const { width } = useWindowDimensions();
  return useIsFramed() ? PHONE.width : width;
}
