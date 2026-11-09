import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { formatDuration } from "../lib/camera-roll";
import { Clip } from "../lib/journal";
import { colors, fonts, SCREEN_MARGIN } from "../lib/theme";
import { RollPhoto } from "./RollPhoto";

export const SLOT_COUNT = 4;
const SLOT_WIDTH = 114.461;
const SLOT_HEIGHT = 153.401;
const STRIP_RADIUS = 5.222;

// The row of clip slots. Pass onPressClip to let a tap open a filled slot.
export function ClipStrip({ clips, onPressClip }: { clips: Clip[]; onPressClip?: (clip: Clip) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.strip} contentContainerStyle={styles.content}>
      {Array.from({ length: SLOT_COUNT }, (_, slot) => {
        const clip: Clip | undefined = clips[slot];
        return (
          <Pressable
            key={slot}
            disabled={!clip || !onPressClip}
            accessibilityRole={onPressClip && clip ? "button" : undefined}
            accessibilityLabel={clip ? `Edit clip in slot ${slot + 1}` : `Empty slot ${slot + 1}`}
            onPress={() => clip && onPressClip?.(clip)}
            style={[styles.slot, slot === 0 && styles.slotFirst]}
          >
            {clip && (
              <>
                <RollPhoto photo={clip.photo} width={SLOT_WIDTH} height={SLOT_HEIGHT} />
                <Text style={styles.duration}>{formatDuration(clip.end - clip.start)}</Text>
              </>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: SCREEN_MARGIN,
    gap: 2.36,
  },
  slot: {
    width: SLOT_WIDTH,
    height: SLOT_HEIGHT,
    backgroundColor: colors.slot,
    borderWidth: 0.446,
    borderColor: colors.slotBorder,
    overflow: "hidden",
  },
  slotFirst: {
    borderTopLeftRadius: STRIP_RADIUS,
    borderBottomLeftRadius: STRIP_RADIUS,
  },
  duration: {
    position: "absolute",
    right: 11,
    bottom: 8,
    fontFamily: fonts.regular,
    fontSize: 14.16,
    color: colors.ink,
  },
});
