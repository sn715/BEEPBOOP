import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

import { Privacy, useJournal } from "../lib/journal";
import { colors, fonts, SCREEN_MARGIN } from "../lib/theme";

export const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export function Avatar({ name, photoUri, size = 40, quiet }: { name: string; photoUri?: string | null; size?: number; quiet?: boolean }) {
  const shape = { width: size, height: size, borderRadius: size / 2 };
  if (photoUri) return <Image source={{ uri: photoUri }} contentFit="cover" style={shape} />;
  return (
    <View style={[styles.avatar, shape, quiet && styles.avatarQuiet]}>
      <Text style={[styles.initials, quiet && styles.initialsQuiet]}>{getInitials(name)}</Text>
    </View>
  );
}

export function ProfileRow({ privacy, onChangePrivacy }: { privacy: Privacy; onChangePrivacy: (privacy: Privacy) => void }) {
  const { profile } = useJournal();
  const isPrivate = privacy === "private";

  return (
    <View style={styles.row}>
      {profile.photoUri ? (
        <Image source={{ uri: profile.photoUri }} contentFit="cover" style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoEmpty]} />
      )}
      <Text style={styles.handle} numberOfLines={1}>
        {profile.handle}
      </Text>
      <Pressable
        hitSlop={14}
        accessibilityRole="button"
        accessibilityLabel={`Privacy: ${privacy}. Tap to make ${isPrivate ? "public" : "private"}`}
        onPress={() => onChangePrivacy(isPrivate ? "public" : "private")}
      >
        <Image source={isPrivate ? require("../assets/images/lock.svg") : require("../assets/images/lock-open.svg")} style={styles.lock} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 40,
    marginLeft: SCREEN_MARGIN,
    marginRight: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  photo: {
    width: 40,
    height: 39,
    borderRadius: 20,
  },
  photoEmpty: {
    backgroundColor: colors.avatar,
  },
  avatar: {
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarQuiet: {
    backgroundColor: colors.surface,
  },
  initials: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.ink,
  },
  initialsQuiet: {
    color: colors.muted,
  },
  handle: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16.094,
    color: colors.ink,
  },
  lock: {
    width: 12.279,
    height: 15.349,
  },
});
