import { ReactNode, useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useFonts } from "expo-font";
import { router, Stack, usePathname, useRootNavigationState } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { JournalProvider, useJournal } from "../lib/journal";
import { PHONE, useIsFramed } from "../lib/screen";
import { colors } from "../lib/theme";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "AlteHaasGrotesk-Regular": require("../assets/fonts/AlteHaasGroteskRegular.ttf"),
    "AlteHaasGrotesk-Bold": require("../assets/fonts/AlteHaasGroteskBold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <JournalProvider>
      <StatusBar style="light" />
      <PhoneFrame>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
          {/* The diary is home once onboarding is done, so swiping back can't return to sign-up. */}
          <Stack.Screen name="(tabs)/diary/index" options={{ gestureEnabled: false }} />
          {/* Swiping back from a saved entry would land on the finished form, so its back arrow goes to the diary instead. */}
          <Stack.Screen name="entry/[id]" options={{ gestureEnabled: false }} />
        </Stack>
        <RestartOnReload />
      </PhoneFrame>
    </JournalProvider>
  );
}

// The demo's data lives in memory, so reloading the web page mid-flow would leave an empty screen. Start over at welcome instead.
function RestartOnReload() {
  const { started } = useJournal();
  const pathname = usePathname();
  const navigationReady = !!useRootNavigationState()?.key;

  useEffect(() => {
    if (navigationReady && !started && pathname !== "/" && pathname !== "/welcome") router.replace("/welcome");
  }, [navigationReady, started, pathname]);

  return null;
}

// The web demo on a laptop: the app sits in a phone-sized frame in the middle of the page. Phones get it full screen.
function PhoneFrame({ children }: { children: ReactNode }) {
  const framed = useIsFramed();
  const { height } = useWindowDimensions();
  if (!framed) return <>{children}</>;

  return (
    <View style={styles.page}>
      <View style={[styles.phone, { height: Math.min(PHONE.height, height - 48) + FRAME_BORDER * 2 }]}>{children}</View>
    </View>
  );
}

// Added outside the phone width so screens still get the full 393pt.
const FRAME_BORDER = 1;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b0b0c",
  },
  phone: {
    width: PHONE.width + FRAME_BORDER * 2,
    borderRadius: 44,
    borderWidth: FRAME_BORDER,
    borderColor: "#2a2a2a",
    overflow: "hidden",
    backgroundColor: colors.background,
  },
});
