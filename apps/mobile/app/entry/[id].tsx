import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ARTIST_ROW_HEIGHT, EntryGrid, GridText, VENUE_ROW_HEIGHT } from "../../components/EntryGrid";
import { ProfileRow } from "../../components/ProfileRow";
import { RollPhoto } from "../../components/RollPhoto";
import { Divider, NavBar, sharedStyles } from "../../components/ui";
import { formatEntryDate, Media, useJournal } from "../../lib/journal";
import { colors, fonts, SCREEN_MARGIN } from "../../lib/theme";

const MEDIA_HEIGHT = 346;
const MEDIA_WIDTH = 256;

export default function JournalViewScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, updateEntry } = useJournal();
  const entry = entries.find((candidate) => candidate.id === id);

  return (
    <View style={[sharedStyles.screen, { paddingTop: insets.top }]}>
      <NavBar title="journal" onBack={() => router.dismissTo("/diary")} />
      <Divider />

      {entry && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
          <View style={styles.profile}>
            <ProfileRow privacy={entry.privacy} onChangePrivacy={(privacy) => updateEntry(entry.id, { privacy })} />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.media} contentContainerStyle={styles.mediaContent}>
            {entry.media.map((media, index) => (
              <MediaCard key={index} media={media} />
            ))}
          </ScrollView>
          <View style={styles.gridGap} />

          <EntryGrid
            artist={<GridText label="artist" rowHeight={ARTIST_ROW_HEIGHT} value={entry.artist} />}
            venue={<GridText label="venue" rowHeight={VENUE_ROW_HEIGHT} value={entry.venue} />}
            date={<GridText label="date" rowHeight={VENUE_ROW_HEIGHT} value={formatEntryDate(entry)} />}
          >
            <View style={styles.entry}>
              <Text style={styles.entryTitle}>Entry #{entry.number}</Text>
              {entry.review.length > 0 && <Text style={styles.review}>{entry.review}</Text>}
            </View>
          </EntryGrid>
        </ScrollView>
      )}
    </View>
  );
}

function MediaCard({ media }: { media: Media }) {
  return (
    <View style={styles.mediaCard}>
      {media.kind === "clip" ? (
        <RollPhoto photo={media.photo} width={MEDIA_WIDTH} height={MEDIA_HEIGHT} />
      ) : (
        <Image source={media.source} contentFit="cover" style={StyleSheet.absoluteFill} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    paddingTop: 18,
    paddingBottom: 17,
  },
  media: {
    flexGrow: 0,
  },
  mediaContent: {
    paddingHorizontal: SCREEN_MARGIN,
    gap: 8,
  },
  mediaCard: {
    width: MEDIA_WIDTH,
    height: MEDIA_HEIGHT,
    borderRadius: 5.222,
    overflow: "hidden",
    backgroundColor: colors.slot,
  },
  gridGap: {
    height: 18.6,
  },
  entry: {
    paddingTop: 24,
    paddingHorizontal: SCREEN_MARGIN,
    gap: 10,
  },
  entryTitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 18,
    color: colors.ink,
  },
  review: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 15,
    color: colors.ink,
  },
});
