import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { Avatar } from "../../components/ProfileRow";
import { Label, OnboardingScreen, PrimaryButton, SearchBox, TertiaryButton } from "../../components/ui";
import { useJournal } from "../../lib/journal";
import { colors, fonts } from "../../lib/theme";

// Sample people. Nothing here reads real contacts or sends an invite.
const ON_BRIDGE = [
  { name: "Maya Reyes", handle: "@mayar", artist: "Kali Uchis" },
  { name: "Jordan Lee", handle: "@jordanl", artist: "Djo" },
  { name: "Priya Shah", handle: "@priyas", artist: "Ryan Beatty" },
];
const CONTACTS = ["Ava Kim", "Ben Torres", "Chloe Nguyen"];

export default function FriendsScreen() {
  const { profile } = useJournal();
  const [search, setSearch] = useState("");
  const [tapped, setTapped] = useState<string[]>([]);

  const query = search.trim().toLowerCase();
  const onBridge = ON_BRIDGE.filter(({ name, handle }) => `${name} ${handle}`.toLowerCase().includes(query));
  const contacts = CONTACTS.filter((name) => name.toLowerCase().includes(query));
  const done = (name: string) => tapped.includes(name);
  const tap = (name: string) =>
    setTapped((current) => (current.includes(name) ? current.filter((other) => other !== name) : [...current, name]));
  const next = () => router.push("/done");

  return (
    <OnboardingScreen
      title="find your friends"
      subtitle="your diary stays private until you add someone."
      onBack={() => router.back()}
      footer={
        <>
          <PrimaryButton label="continue" onPress={next} />
          <TertiaryButton label="skip for now" onPress={next} />
        </>
      }
    >
      <SearchBox placeholder="search contacts or @handle" value={search} onChangeText={setSearch} />

      {onBridge.length > 0 && (
        <View style={styles.section}>
          <Label>on bridge · {onBridge.length}</Label>
          {onBridge.map(({ name, handle, artist }) => (
            <View key={name} style={styles.person}>
              <Avatar name={name} />
              <View style={styles.personText}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.detail}>{profile.artists.includes(artist) ? `also saw ${artist}` : handle}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${done(name) ? "Added" : "Add"} ${name}`}
                onPress={() => tap(name)}
                style={[styles.add, done(name) && styles.added]}
              >
                <Text style={[styles.addText, done(name) && styles.addedText]}>{done(name) ? "added" : "add"}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {contacts.length > 0 && (
        <View style={styles.section}>
          <Label>invite to bridge</Label>
          {contacts.map((name) => (
            <View key={name} style={styles.person}>
              <Avatar name={name} quiet />
              <View style={styles.personText}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.detail}>in your contacts</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${done(name) ? "Invited" : "Invite"} ${name}`}
                onPress={() => tap(name)}
                style={styles.invite}
              >
                <Text style={[styles.inviteText, done(name) && styles.invitedText]}>{done(name) ? "invited" : "invite"}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 4,
  },
  person: {
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  personText: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.regular,
    fontSize: 17,
    lineHeight: 24,
    color: colors.ink,
  },
  detail: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
  },
  add: {
    height: 44,
    minWidth: 72,
    paddingHorizontal: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  added: {
    borderColor: colors.outline,
  },
  addText: {
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.ink,
  },
  addedText: {
    color: colors.muted,
  },
  invite: {
    height: 44,
    minWidth: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  inviteText: {
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.muted,
  },
  invitedText: {
    color: colors.ink,
  },
});
