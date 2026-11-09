import { Fragment, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RollPhoto } from "../../../components/RollPhoto";
import { Divider, NavBar, sharedStyles } from "../../../components/ui";
import { Entry, formatEntryDay, formatMonthHeading, useJournal } from "../../../lib/journal";
import { colors, fonts, SCREEN_MARGIN } from "../../../lib/theme";

const THUMB_WIDTH = 118;
const THUMB_RIGHT = 31;
const ROW_HEIGHT = 103.5;
const MONTH_HEIGHT = 20.5;
const MUTED_SMALL = 13.185;

export default function DiaryScreen() {
  const insets = useSafeAreaInsets();
  const { entries, startDraft } = useJournal();
  const [menuOpen, setMenuOpen] = useState(false);

  const newConcert = () => {
    setMenuOpen(false);
    startDraft();
    router.push("/entry/media-select");
  };

  const leaveDiary = () => {
    setMenuOpen(false);
    router.replace("/welcome");
  };

  return (
    <View style={[sharedStyles.screen, { paddingTop: insets.top }]}>
      <NavBar
        title="diary"
        onBack={leaveDiary}
        right={
          <Pressable hitSlop={16} accessibilityRole="button" accessibilityLabel="More options" onPress={() => setMenuOpen((open) => !open)}>
            <Text style={styles.menuIcon}>OOO</Text>
          </Pressable>
        }
      />
      <Divider />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom }}>
        <Pressable style={styles.row} accessibilityRole="button" accessibilityLabel="New concert" onPress={newConcert}>
          <Text style={[styles.artist, styles.newConcert]}>new concert</Text>
          <View style={[styles.thumb, styles.plusBox]}>
            <Text style={styles.plus}>+</Text>
          </View>
        </Pressable>
        <Divider />

        {entries.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.artist}>nothing logged yet.</Text>
            <Text style={styles.venue}>add the last show you went to.</Text>
          </View>
        )}

        {entries.map((entry, index) => {
          const heading = formatMonthHeading(entry);
          const startsMonth = index === 0 || formatMonthHeading(entries[index - 1]) !== heading;
          return (
            <Fragment key={entry.id}>
              {startsMonth && (
                <>
                  <Text style={styles.month}>{heading}</Text>
                  <Divider />
                </>
              )}
              <Pressable
                style={styles.row}
                accessibilityRole="button"
                accessibilityLabel={`${entry.artist}, ${entry.venue}`}
                onPress={() => router.push(`/entry/${entry.id}`)}
              >
                <View style={styles.text}>
                  <Text style={styles.artist} numberOfLines={1}>
                    {entry.artist}
                  </Text>
                  {entry.venue.length > 0 && (
                    <Text style={styles.venue} numberOfLines={1}>
                      {entry.venue}
                    </Text>
                  )}
                  <Text style={styles.date}>{formatEntryDay(entry)}</Text>
                </View>
                <Thumbnail entry={entry} />
              </Pressable>
              <Divider />
            </Fragment>
          );
        })}
      </ScrollView>

      {menuOpen && (
        <>
          <Pressable accessibilityLabel="Close menu" style={StyleSheet.absoluteFill} onPress={() => setMenuOpen(false)} />
          <View style={[styles.menu, { top: insets.top + 52 }]}>
            <Pressable accessibilityRole="button" style={styles.menuItem} onPress={newConcert}>
              <Text style={styles.menuText}>new concert</Text>
            </Pressable>
            <Divider />
            <Pressable accessibilityRole="button" style={styles.menuItem} onPress={leaveDiary}>
              <Text style={styles.menuText}>log out</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

function Thumbnail({ entry }: { entry: Entry }) {
  const firstMedia = entry.media[0];
  return (
    <View style={styles.thumb}>
      {entry.thumbnail ? (
        <Image
          source={entry.thumbnail.source}
          contentFit={entry.thumbnail.heightPercent ? "fill" : "cover"}
          style={{
            position: "absolute",
            width: "100%",
            height: `${entry.thumbnail.heightPercent ?? 100}%`,
            top: `${entry.thumbnail.topPercent ?? 0}%`,
          }}
        />
      ) : (
        firstMedia?.kind === "clip" && <RollPhoto photo={firstMedia.photo} width={THUMB_WIDTH} height={ROW_HEIGHT} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: SCREEN_MARGIN,
  },
  text: {
    flex: 1,
    paddingRight: 12,
    marginRight: THUMB_WIDTH + THUMB_RIGHT,
  },
  artist: {
    fontFamily: fonts.regular,
    fontSize: 21.415,
    lineHeight: 28,
    color: colors.ink,
  },
  newConcert: {
    color: colors.muted,
  },
  venue: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 18,
    color: colors.muted,
  },
  date: {
    fontFamily: fonts.regular,
    fontSize: MUTED_SMALL,
    lineHeight: 16,
    color: colors.muted,
  },
  month: {
    height: MONTH_HEIGHT,
    paddingHorizontal: SCREEN_MARGIN,
    fontFamily: fonts.regular,
    fontSize: MUTED_SMALL,
    lineHeight: MONTH_HEIGHT,
    color: colors.muted,
    textTransform: "uppercase",
  },
  thumb: {
    position: "absolute",
    right: THUMB_RIGHT,
    top: 0,
    width: THUMB_WIDTH,
    height: ROW_HEIGHT,
    overflow: "hidden",
  },
  plusBox: {
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    fontFamily: fonts.regular,
    fontSize: 45.415,
    lineHeight: 54,
    color: colors.ink,
  },
  menuIcon: {
    fontFamily: fonts.regular,
    fontSize: 7.623,
    color: colors.ink,
  },
  menu: {
    position: "absolute",
    right: SCREEN_MARGIN,
    width: 160,
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.line,
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
  empty: {
    paddingTop: 40,
    paddingHorizontal: SCREEN_MARGIN,
    gap: 6,
  },
});
