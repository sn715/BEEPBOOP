import { StyleSheet, Text } from "react-native";
import { router } from "expo-router";

import { Field, OnboardingScreen, PrimaryButton } from "../../components/ui";
import { useJournal } from "../../lib/journal";
import { colors, fonts } from "../../lib/theme";

const MIN_LENGTH = 3;

// There's no backend to check against, so any handle of 3 or more characters counts as available.
export default function HandleScreen() {
  const { profile, updateProfile } = useJournal();
  const valid = profile.handle.length >= MIN_LENGTH;

  return (
    <OnboardingScreen
      title="pick a handle"
      subtitle="friends search for you by this. you can change it later."
      onBack={() => router.back()}
      footer={<PrimaryButton label="continue" disabled={!valid} onPress={() => router.push("/photo")} />}
    >
      <Field
        label="username"
        placeholder="@yourname"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        value={profile.handle ? `@${profile.handle}` : ""}
        onChangeText={(text) => updateProfile({ handle: text.toLowerCase().replace(/[^a-z0-9_.]/g, "") })}
        style={styles.field}
      />
      <Text style={styles.status}>{valid ? "available" : `at least ${MIN_LENGTH} characters`}</Text>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: 8,
  },
  status: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
});
