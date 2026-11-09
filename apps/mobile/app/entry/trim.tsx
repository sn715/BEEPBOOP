import { useEffect, useRef, useState } from "react";
import { PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RollPhoto } from "../../components/RollPhoto";
import { Divider, sharedStyles } from "../../components/ui";
import { PHOTOS } from "../../lib/camera-roll";
import { useJournal } from "../../lib/journal";
import { useScreenWidth } from "../../lib/screen";
import { colors, fonts, SCREEN_MARGIN } from "../../lib/theme";

const TILE_COUNT = 6;
const TIMELINE_HEIGHT = 51;
const YELLOW_BAR = 5;
const PLAY_WIDTH = 49;
const HANDLE_WIDTH = 20;
const PLAYHEAD_WIDTH = 4;
const MIN_SECONDS = 1;
const TICK_MS = 50;
const PREVIEW_RATIO = 222 / 393;

// Trimming a clip sets the start and end saved with it. The demo's clips are stills, so play only moves the playhead.
export default function TrimScreen() {
  const width = useScreenWidth();
  const insets = useSafeAreaInsets();
  const { photo: photoParam } = useLocalSearchParams<{ photo: string }>();
  const { draft, updateDraft } = useJournal();

  const photo = Number(photoParam);
  const total = PHOTOS[photo].seconds;
  const existing = draft.clips.find((clip) => clip.photo === photo);

  const [range, setRangeState] = useState({ start: existing?.start ?? 0, end: existing?.end ?? total });
  const [playhead, setPlayhead] = useState(range.start);
  const [playing, setPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const rangeRef = useRef(range);
  const dragOrigin = useRef(range);

  const timelineWidth = width - SCREEN_MARGIN * 2;
  const trackWidth = timelineWidth - PLAY_WIDTH - HANDLE_WIDTH * 2;
  const secondsPerPoint = total / trackWidth;

  const setRange = (next: typeof range) => {
    rangeRef.current = next;
    setRangeState(next);
  };

  const moveHandle = (handle: "start" | "end", dx: number) => {
    const moved = dragOrigin.current[handle] + dx * secondsPerPoint;
    const next =
      handle === "start"
        ? { ...rangeRef.current, start: Math.min(Math.max(0, moved), rangeRef.current.end - MIN_SECONDS) }
        : { ...rangeRef.current, end: Math.max(Math.min(total, moved), rangeRef.current.start + MIN_SECONDS) };
    setRange(next);
    setPlaying(false);
    setPlayhead(next[handle]);
  };

  const createResponder = (handle: "start" | "end") =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragOrigin.current = rangeRef.current;
      },
      onPanResponderMove: (_, gesture) => moveHandle(handle, gesture.dx),
    });

  const startResponder = useRef(createResponder("start")).current;
  const endResponder = useRef(createResponder("end")).current;

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setPlayhead((current) => {
        const next = current + TICK_MS / 1000;
        if (next < rangeRef.current.end) return next;
        setPlaying(false);
        return rangeRef.current.start;
      });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [playing]);

  const togglePlay = () => {
    if (playhead < range.start || playhead >= range.end) setPlayhead(range.start);
    setPlaying(!playing);
  };

  const save = () => {
    const clip = { photo, start: Math.round(range.start), end: Math.round(range.end) };
    updateDraft({
      clips: existing ? draft.clips.map((current) => (current.photo === photo ? clip : current)) : [...draft.clips, clip],
    });
    router.back();
  };

  const reset = () => {
    setRange({ start: 0, end: total });
    setPlaying(false);
    setPlayhead(0);
    setMenuOpen(false);
  };

  const remove = () => {
    updateDraft({ clips: draft.clips.filter((clip) => clip.photo !== photo) });
    router.back();
  };

  const trackLeft = PLAY_WIDTH + HANDLE_WIDTH;
  const startX = (range.start / total) * trackWidth;
  const endX = (range.end / total) * trackWidth;
  const tileWidth = trackWidth / TILE_COUNT;
  const tileHeight = TIMELINE_HEIGHT - YELLOW_BAR * 2;
  const previewHeight = width * PREVIEW_RATIO;
  const playheadX = trackLeft + (playhead / total) * trackWidth - PLAYHEAD_WIDTH / 2;

  return (
    <View style={[sharedStyles.screen, { paddingTop: insets.top + 4 }]}>
      <View style={styles.pills}>
        <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Cancel" onPress={() => router.back()} style={[styles.pill, styles.pillCancel]}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Save" onPress={save} style={[styles.pill, styles.pillSave]}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>

      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>VIDEO</Text>
        <Pressable hitSlop={6} accessibilityRole="button" accessibilityLabel="More options" onPress={() => setMenuOpen((open) => !open)} style={styles.more}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </Pressable>
      </View>

      <View style={styles.previewArea}>
        <View style={{ width, height: previewHeight, overflow: "hidden" }}>
          <RollPhoto photo={photo} width={width} height={previewHeight} />
        </View>
      </View>

      <View style={[styles.timeline, { width: timelineWidth }]}>
        <Pressable accessibilityRole="button" accessibilityLabel={playing ? "Pause" : "Play"} onPress={togglePlay} style={styles.play}>
          {playing ? (
            <View style={styles.pauseIcon}>
              <View style={styles.pauseBar} />
              <View style={styles.pauseBar} />
            </View>
          ) : (
            <View style={styles.playIcon} />
          )}
        </Pressable>

        <View style={[styles.tiles, { left: trackLeft, width: trackWidth, height: tileHeight }]}>
          {Array.from({ length: TILE_COUNT }, (_, tile) => (
            <View key={tile} style={{ width: tileWidth, height: tileHeight, overflow: "hidden" }}>
              <RollPhoto photo={photo} width={tileWidth} height={tileHeight} />
            </View>
          ))}
        </View>
        <View style={[styles.dim, { left: trackLeft, width: startX, height: tileHeight }]} />
        <View style={[styles.dim, { left: trackLeft + endX, width: trackWidth - endX, height: tileHeight }]} />

        <View pointerEvents="none" style={[styles.frame, { left: PLAY_WIDTH + startX, width: endX - startX + HANDLE_WIDTH * 2 }]} />
        <View
          {...startResponder.panHandlers}
          accessibilityLabel="Trim start"
          style={[styles.handle, styles.handleStart, { left: PLAY_WIDTH + startX }]}
        >
          <View style={styles.chevron}>
            <View style={[styles.chevronBar, styles.chevronLeftTop]} />
            <View style={[styles.chevronBar, styles.chevronLeftBottom]} />
          </View>
        </View>
        <View
          {...endResponder.panHandlers}
          accessibilityLabel="Trim end"
          style={[styles.handle, styles.handleEnd, { left: trackLeft + endX }]}
        >
          <View style={styles.chevron}>
            <View style={[styles.chevronBar, styles.chevronRightTop]} />
            <View style={[styles.chevronBar, styles.chevronRightBottom]} />
          </View>
        </View>
        <View pointerEvents="none" style={[styles.playhead, { left: playheadX }]} />
      </View>

      {menuOpen && (
        <>
          <Pressable accessibilityLabel="Close menu" style={StyleSheet.absoluteFill} onPress={() => setMenuOpen(false)} />
          <View style={[styles.menu, { top: insets.top + 86 }]}>
            <Pressable accessibilityRole="button" style={styles.menuItem} onPress={reset}>
              <Text style={styles.menuText}>Reset trim</Text>
            </Pressable>
            {existing && (
              <>
                <Divider soft />
                <Pressable accessibilityRole="button" style={styles.menuItem} onPress={remove}>
                  <Text style={styles.menuText}>Remove clip</Text>
                </Pressable>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pills: {
    paddingHorizontal: 33,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pill: {
    width: 61,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  pillCancel: {
    backgroundColor: colors.pill,
  },
  pillSave: {
    backgroundColor: colors.trimYellow,
  },
  cancelText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  saveText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.background,
  },
  toolbar: {
    marginTop: 12,
    height: 44,
    paddingHorizontal: 15,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  toolbarTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.muted,
  },
  more: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.ink,
  },
  previewArea: {
    flex: 1,
    justifyContent: "center",
  },
  timeline: {
    height: TIMELINE_HEIGHT,
    marginHorizontal: SCREEN_MARGIN,
    marginBottom: 155,
    borderRadius: 7,
    backgroundColor: colors.trimTrack,
  },
  play: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: PLAY_WIDTH,
    borderRightWidth: 1,
    borderRightColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    marginLeft: 3,
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderLeftWidth: 16,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: colors.ink,
  },
  pauseIcon: {
    flexDirection: "row",
    gap: 4,
  },
  pauseBar: {
    width: 5,
    height: 18,
    borderRadius: 1,
    backgroundColor: colors.ink,
  },
  tiles: {
    position: "absolute",
    top: YELLOW_BAR,
    flexDirection: "row",
    overflow: "hidden",
  },
  dim: {
    position: "absolute",
    top: YELLOW_BAR,
    backgroundColor: "rgba(0,0,0,0.72)",
  },
  frame: {
    position: "absolute",
    top: 0,
    height: TIMELINE_HEIGHT,
    borderTopWidth: YELLOW_BAR,
    borderBottomWidth: YELLOW_BAR,
    borderRadius: 7,
    borderColor: colors.trimYellow,
  },
  handle: {
    position: "absolute",
    top: 0,
    width: HANDLE_WIDTH,
    height: TIMELINE_HEIGHT,
    backgroundColor: colors.trimYellow,
    alignItems: "center",
    justifyContent: "center",
  },
  handleStart: {
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  handleEnd: {
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  chevron: {
    alignItems: "center",
  },
  chevronBar: {
    width: 3,
    height: 12,
    borderRadius: 1.5,
    backgroundColor: colors.background,
  },
  chevronLeftTop: {
    transform: [{ translateY: 1 }, { rotate: "16deg" }],
  },
  chevronLeftBottom: {
    transform: [{ translateY: -1 }, { rotate: "-16deg" }],
  },
  chevronRightTop: {
    transform: [{ translateY: 1 }, { rotate: "-16deg" }],
  },
  chevronRightBottom: {
    transform: [{ translateY: -1 }, { rotate: "16deg" }],
  },
  playhead: {
    position: "absolute",
    top: 0,
    width: PLAYHEAD_WIDTH,
    height: TIMELINE_HEIGHT,
    borderRadius: 2,
    backgroundColor: colors.ink,
  },
  menu: {
    position: "absolute",
    right: 15,
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: 8,
    overflow: "hidden",
  },
  menuItem: {
    height: 44,
    paddingHorizontal: SCREEN_MARGIN,
    justifyContent: "center",
  },
  menuText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.ink,
  },
});
