import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton, sharedStyles, TertiaryButton } from "../../components/ui";
import { useJournal } from "../../lib/journal";
import { useScreenWidth } from "../../lib/screen";
import { colors, fonts, SCREEN_MARGIN } from "../../lib/theme";

const COLLAGE = [
  require("../../assets/images/thumb-ryan.png"),
  require("../../assets/images/thumb-kali.png"),
  require("../../assets/images/thumb-carti.png"),
  require("../../assets/images/thumb-sabrina.png"),
  require("../../assets/images/thumb-djo.png"),
  require("../../assets/images/thumb-lorde.png"),
  require("../../assets/images/thumb-tate.png"),
  require("../../assets/images/collage-stage.png"),
  require("../../assets/images/thumb-ryan.png"),
];
const GAP = 3;

export default function WelcomeScreen() {
  const width = useScreenWidth();
  const insets = useSafeAreaInsets();
  const { startNewAccount, loadSampleAccount } = useJournal();

  const tile = (width - GAP * 2) / 3;
  const collageHeight = tile * 3 + GAP * 2;

  return (
    <View style={sharedStyles.screen}>
      <View style={{ height: Math.min(collageHeight, 400), overflow: "hidden" }}>
        <View style={styles.collage}>
          {COLLAGE.map((source, index) => (
            <Image key={index} source={source} contentFit="cover" style={{ width: tile, height: tile }} />
          ))}
        </View>
        <LinearGradient
          // Dark at the top so the status bar stays readable, fading to the background at the bottom.
          colors={["rgba(0,0,0,0.75)", "rgba(0,0,0,0)", "rgba(0,0,0,0)", colors.background]}
          locations={[0, 0.22, 0.4, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.lockup}>
          <Image source={require("../../assets/images/logo.svg")} style={styles.logo} />
          <Text style={styles.wordmark}>bridge</Text>
        </View>
        <Text style={sharedStyles.headline}>a journal for live music.</Text>
        <Text style={sharedStyles.subtitle}>
          log the shows you go to, keep the photos and video, and remember how the night actually felt.
        </Text>
      </View>

      <View style={[sharedStyles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <PrimaryButton
          label="get started"
          onPress={() => {
            startNewAccount();
            router.push("/phone");
          }}
        />
        <TertiaryButton
          label="i already have an account"
          onPress={() => {
            loadSampleAccount();
            router.replace("/diary");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  collage: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  body: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: SCREEN_MARGIN,
    gap: 16,
  },
  lockup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  logo: {
    width: 39.461,
    height: 24,
  },
  wordmark: {
    fontFamily: fonts.regular,
    fontSize: 28,
    color: colors.ink,
  },
});
