import { StyleSheet, Text } from "react-native";
import { router } from "expo-router";

import { Field, OnboardingScreen, PrimaryButton } from "../../components/ui";
import { useJournal } from "../../lib/journal";
import { colors, fonts } from "../../lib/theme";

const toDigits = (text: string) => text.replace(/^\+?1\s*/, "").replace(/\D/g, "").slice(0, 10);

const formatPhone = (digits: string) => {
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `+1 (${digits}`;
  if (digits.length <= 6) return `+1 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

// The demo doesn't send a text. Any 10-digit number moves on.
export default function PhoneScreen() {
  const { profile, updateProfile } = useJournal();

  return (
    <OnboardingScreen
      title="what's your number?"
      subtitle="we'll text you a code to sign in."
      onBack={() => router.back()}
      footer={
        <>
          <Text style={styles.terms}>
            by continuing you agree to the <Text style={styles.termsLink}>terms and privacy policy</Text>.
          </Text>
          <PrimaryButton label="send code" disabled={profile.phone.length < 10} onPress={() => router.push("/verify")} />
        </>
      }
    >
      <Field
        label="phone"
        placeholder="+1 (310) 555-0192"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        autoFocus
        value={formatPhone(profile.phone)}
        onChangeText={(text) => updateProfile({ phone: toDigits(text) })}
        style={styles.field}
      />
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: 8,
  },
  terms: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
  },
  termsLink: {
    textDecorationLine: "underline",
  },
});
