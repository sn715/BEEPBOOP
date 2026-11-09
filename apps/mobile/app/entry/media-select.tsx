import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ClipStrip, SLOT_COUNT } from "../../components/ClipStrip";
import { ProfileRow } from "../../components/ProfileRow";
import { Divider, Label, NavBar, sharedStyles } from "../../components/ui";
import { formatDuration, PHOTOS, rollImage, ROLL_SOURCE, ROW_HEIGHT } from "../../lib/camera-roll";
import { useJournal } from "../../lib/journal";
import { useScreenWidth } from "../../lib/screen";
import { colors, SCREEN_MARGIN } from "../../lib/theme";

const ROLL_LEFT = 5;
const ROLL_RIGHT = 4;

export default function MediaSelectScreen() {
  const width = useScreenWidth();
  const insets = useSafeAreaInsets();
  const { draft, updateDraft } = useJournal();

  const rollWidth = width - ROLL_LEFT - ROLL_RIGHT;
  const rollScale = rollWidth / ROLL_SOURCE.width;
  const rollHeight = (ROLL_SOURCE.cropBottom - ROLL_SOURCE.cropTop) * rollScale;

  return (
    <View style={[sharedStyles.screen, { paddingTop: insets.top }]}>
      <NavBar
        title="journal"
        onBack={() => router.back()}
        action={{ label: "Next", disabled: draft.clips.length === 0, onPress: () => router.push("/entry/new") }}
      />
      <Divider />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom }}>
        <View style={styles.profile}>
          <ProfileRow privacy={draft.privacy} onChangePrivacy={(privacy) => updateDraft({ privacy })} />
        </View>

        <ClipStrip clips={draft.clips} onPressClip={(clip) => router.push(`/entry/trim?photo=${clip.photo}`)} />

        <View style={styles.dividerSpace}>
          <Divider soft />
        </View>
        <Label style={styles.rollHeading}>camera roll</Label>

        <View style={{ marginLeft: ROLL_LEFT, width: rollWidth, height: rollHeight, overflow: "hidden" }}>
          <Image
            source={rollImage}
            contentFit="fill"
            style={{
              position: "absolute",
              top: -ROLL_SOURCE.cropTop * rollScale,
              width: rollWidth,
              height: ROLL_SOURCE.height * rollScale,
            }}
          />
          {PHOTOS.map((photo, index) => {
            const selected = draft.clips.some((clip) => clip.photo === index);
            const full = draft.clips.length >= SLOT_COUNT;
            return (
              <Pressable
                key={index}
                disabled={full && !selected}
                accessibilityRole="button"
                accessibilityLabel={`Clip ${index + 1}, ${formatDuration(photo.seconds)}`}
                accessibilityState={{ selected, disabled: full && !selected }}
                onPress={() => router.push(`/entry/trim?photo=${index}`)}
                style={{
                  position: "absolute",
                  left: photo.x * rollScale,
                  top: Math.max(0, (photo.y - ROLL_SOURCE.cropTop) * rollScale),
                  width: photo.width * rollScale,
                  height: ROW_HEIGHT * rollScale,
                }}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    paddingTop: 18,
    paddingBottom: 17,
  },
  dividerSpace: {
    paddingTop: 18.6,
  },
  rollHeading: {
    height: 28,
    paddingTop: 7,
    paddingHorizontal: SCREEN_MARGIN,
    color: colors.ink,
  },
});
