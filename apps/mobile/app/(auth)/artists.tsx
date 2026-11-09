import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { OnboardingScreen, PrimaryButton, SearchBox, TertiaryButton } from "../../components/ui";
import { useJournal } from "../../lib/journal";
import { colors, fonts } from "../../lib/theme";

const ARTISTS = [
  "Ryan Beatty",
  "Kali Uchis",
  "Playboi Carti",
  "Sabrina Carpenter",
  "Djo",
  "Lorde",
  "Tate McRae",
  "Phoebe Bridgers",
  "SZA",
  "Laufey",
  "Clairo",
  "Doechii",
];

export default function ArtistsScreen() {
  const { profile, updateProfile } = useJournal();
  const [search, setSearch] = useState("");

  const toggle = (artist: string) =>
    updateProfile({
      artists: profile.artists.includes(artist)
        ? profile.artists.filter((current) => current !== artist)
        : [...profile.artists, artist],
    });

  const matches = ARTISTS.filter((artist) => artist.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <OnboardingScreen
      title="who have you seen live?"
      subtitle="pick a few. next, we'll find your friends, starting with anyone who saw them too."
      onBack={() => router.back()}
      footer={
        <>
          <PrimaryButton label="continue" disabled={profile.artists.length === 0} onPress={() => router.push("/friends")} />
          <TertiaryButton
            label="skip for now"
            onPress={() => {
              updateProfile({ artists: [] });
              router.push("/friends");
            }}
          />
        </>
      }
    >
      <SearchBox placeholder="search artists" value={search} onChangeText={setSearch} />
      <View style={styles.chips}>
        {matches.map((artist) => {
          const on = profile.artists.includes(artist);
          return (
            <Pressable
              key={artist}
              accessibilityRole="button"
              accessibilityLabel={artist}
              accessibilityState={{ selected: on }}
              onPress={() => toggle(artist)}
              style={[styles.chip, on && styles.chipOn]}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{artist}</Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: colors.surface,
    justifyContent: "center",
  },
  chipOn: {
    borderColor: colors.ink,
    backgroundColor: colors.surfaceRaised,
  },
  chipText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.muted,
  },
  chipTextOn: {
    color: colors.ink,
  },
});
