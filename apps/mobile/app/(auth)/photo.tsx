import { Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

import { OnboardingScreen, PlusIcon, PrimaryButton, TertiaryButton } from "../../components/ui";
import { useJournal } from "../../lib/journal";
import { colors } from "../../lib/theme";

export default function PhotoScreen() {
  const { profile, updateProfile } = useJournal();

  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) updateProfile({ photoUri: result.assets[0].uri });
  };

  const next = () => router.push("/artists");

  return (
    <OnboardingScreen
      title="add a photo"
      subtitle="so friends know whose diary they are looking at."
      onBack={() => router.back()}
      footer={
        profile.photoUri ? (
          <>
            <PrimaryButton label="continue" onPress={next} />
            <TertiaryButton label="choose a different photo" onPress={choosePhoto} />
          </>
        ) : (
          <>
            <PrimaryButton label="choose photo" onPress={choosePhoto} />
            <TertiaryButton label="skip for now" onPress={next} />
          </>
        )
      }
    >
      <Pressable accessibilityRole="button" accessibilityLabel="Choose photo" onPress={choosePhoto} style={styles.circle}>
        {profile.photoUri ? (
          <Image source={{ uri: profile.photoUri }} contentFit="cover" style={StyleSheet.absoluteFill} />
        ) : (
          <PlusIcon />
        )}
      </Pressable>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 160,
    height: 160,
    marginTop: 32,
    alignSelf: "center",
    borderRadius: 80,
    overflow: "hidden",
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
});
