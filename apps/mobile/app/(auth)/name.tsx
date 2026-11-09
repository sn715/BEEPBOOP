import { StyleSheet } from "react-native";
import { router } from "expo-router";

import { Field, OnboardingScreen, PrimaryButton } from "../../components/ui";
import { useJournal } from "../../lib/journal";

export default function NameScreen() {
  const { profile, updateProfile } = useJournal();

  const onContinue = () => {
    const name = profile.name.trim();
    updateProfile({
      name,
      // Suggest a handle from the name the first time through.
      handle: profile.handle || name.toLowerCase().replace(/[^a-z0-9]/g, ""),
    });
    router.push("/handle");
  };

  return (
    <OnboardingScreen
      title="what should we call you?"
      subtitle="this is how friends see you."
      onBack={() => router.back()}
      footer={<PrimaryButton label="continue" disabled={profile.name.trim().length === 0} onPress={onContinue} />}
    >
      <Field
        label="name"
        placeholder="your name"
        autoCapitalize="words"
        autoCorrect={false}
        textContentType="name"
        autoFocus
        value={profile.name}
        onChangeText={(name) => updateProfile({ name })}
        style={styles.field}
      />
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: 8,
  },
});
