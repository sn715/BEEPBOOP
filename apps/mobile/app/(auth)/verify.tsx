import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { OnboardingScreen, PrimaryButton } from "../../components/ui";
import { formatDuration } from "../../lib/camera-roll";
import { useJournal } from "../../lib/journal";
import { colors, fonts } from "../../lib/theme";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

// The demo doesn't check the code. Any 6 digits move on.
export default function VerifyScreen() {
  const { profile } = useJournal();
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const { phone } = profile;
  const displayPhone = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;

  return (
    <OnboardingScreen
      title="enter the code"
      subtitle={`sent to ${displayPhone}.`}
      onBack={() => router.back()}
      footer={<PrimaryButton label="verify" disabled={code.length < CODE_LENGTH} onPress={() => router.push("/name")} />}
    >
      <View style={styles.code}>
        {Array.from({ length: CODE_LENGTH }, (_, index) => (
          <View key={index} style={[styles.digit, index === code.length && styles.digitActive]}>
            <Text style={styles.digitText}>{code[index] ?? ""}</Text>
          </View>
        ))}
        <TextInput
          accessibilityLabel="Verification code"
          autoFocus
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          maxLength={CODE_LENGTH}
          caretHidden
          value={code}
          onChangeText={(text) => setCode(text.replace(/\D/g, ""))}
          style={styles.hiddenInput}
        />
      </View>

      {secondsLeft > 0 ? (
        <Text style={styles.resend}>resend in {formatDuration(secondsLeft)}</Text>
      ) : (
        <Pressable accessibilityRole="button" onPress={() => setSecondsLeft(RESEND_SECONDS)}>
          <Text style={[styles.resend, styles.resendActive]}>resend code</Text>
        </Pressable>
      )}
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  code: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  digit: {
    width: 52,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  digitActive: {
    borderColor: colors.ink,
  },
  digitText: {
    fontFamily: fonts.regular,
    fontSize: 24,
    color: colors.ink,
  },
  hiddenInput: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  resend: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  resendActive: {
    color: colors.ink,
  },
});
