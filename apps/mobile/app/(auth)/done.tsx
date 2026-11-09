import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton, sharedStyles, TertiaryButton } from "../../components/ui";
import { useJournal } from "../../lib/journal";
import { colors, fonts, SCREEN_MARGIN } from "../../lib/theme";

const CARDS = [
  { artist: "Playboi Carti", source: require("../../assets/images/thumb-carti.png"), left: 12, top: 40, rotate: "8deg" },
  { artist: "Kali Uchis", source: require("../../assets/images/thumb-kali.png"), left: 170, top: 4, rotate: "-6deg" },
  { artist: "Ryan Beatty", source: require("../../assets/images/thumb-ryan.png"), left: 88, top: 0, rotate: "2deg" },
];

export default function DoneScreen() {
  const insets = useSafeAreaInsets();
  const { profile, startDraft } = useJournal();
  const firstName = profile.name.trim().split(/\s+/)[0]?.toLowerCase();

  const goToDiary = () => {
    if (router.canDismiss()) router.dismissAll();
    router.replace("/diary");
  };

  return (
    <View style={[sharedStyles.screen, { paddingTop: insets.top }]}>
      <View style={styles.body}>
        <Image source={require("../../assets/images/logo.svg")} style={styles.logo} />
        <Text style={sharedStyles.headline}>you're in, {firstName}.</Text>
        <Text style={sharedStyles.subtitle}>
          start with the last show you went to. pick the photos and video from that night and we will help fill in the rest.
        </Text>
        <View style={styles.stack}>
          {CARDS.map(({ artist, source, left, top, rotate }) => (
            <View key={artist} style={[styles.card, { left, top, transform: [{ rotate }] }]}>
              <Image source={source} contentFit="cover" style={styles.cardPhoto} />
              <Text style={styles.cardLabel}>{artist}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[sharedStyles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <PrimaryButton
          label="add your first show"
          onPress={() => {
            startDraft();
            goToDiary();
            router.push("/entry/media-select");
          }}
        />
        <TertiaryButton label="look around first" onPress={goToDiary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: SCREEN_MARGIN,
    gap: 20,
  },
  logo: {
    width: 78.922,
    height: 48,
  },
  stack: {
    height: 230,
  },
  card: {
    position: "absolute",
    padding: 8,
    paddingBottom: 12,
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.surface,
  },
  cardPhoto: {
    width: 150,
    height: 150,
  },
  cardLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
});
