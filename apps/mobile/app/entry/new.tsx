import { useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ClipStrip } from "../../components/ClipStrip";
import { DateWheel } from "../../components/DateWheel";
import { ARTIST_ROW_HEIGHT, EntryGrid, GridButton, GridInput, VENUE_ROW_HEIGHT } from "../../components/EntryGrid";
import { ProfileRow } from "../../components/ProfileRow";
import { Divider, NavBar, sharedStyles } from "../../components/ui";
import { formatFullDate, useJournal } from "../../lib/journal";
import { colors, fonts, SCREEN_MARGIN } from "../../lib/theme";

export default function NewEntryScreen() {
  const insets = useSafeAreaInsets();
  const { draft, updateDraft, saveDraft, nextEntryNumber } = useJournal();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerDate, setPickerDate] = useState(draft.date ?? new Date());

  const closePicker = () => {
    updateDraft({ date: pickerDate });
    setPickerOpen(false);
  };

  const save = () => {
    const id = saveDraft();
    router.dismissTo("/diary");
    router.push(`/entry/${id}`);
  };

  const hasReview = draft.review.length > 0;

  return (
    <View style={[sharedStyles.screen, { paddingTop: insets.top }]}>
      <NavBar
        title="journal"
        onBack={() => router.back()}
        action={{ label: "Save", disabled: draft.artist.trim().length === 0, onPress: save }}
      />
      <Divider />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View style={styles.profile}>
          <ProfileRow privacy={draft.privacy} onChangePrivacy={(privacy) => updateDraft({ privacy })} />
        </View>
        <ClipStrip clips={draft.clips} />
        <View style={styles.gridGap} />

        <EntryGrid
          artist={
            <GridInput
              label="artist"
              rowHeight={ARTIST_ROW_HEIGHT}
              value={draft.artist}
              onChangeText={(artist) => updateDraft({ artist })}
              autoCapitalize="sentences"
              autoCorrect={false}
            />
          }
          venue={
            <GridInput
              label="venue"
              rowHeight={VENUE_ROW_HEIGHT}
              value={draft.venue}
              onChangeText={(venue) => updateDraft({ venue })}
              autoCapitalize="sentences"
              autoCorrect={false}
            />
          }
          date={
            <GridButton
              label="date"
              rowHeight={VENUE_ROW_HEIGHT}
              value={draft.date ? formatFullDate(draft.date) : null}
              active={pickerOpen}
              onPress={() => {
                Keyboard.dismiss();
                setPickerOpen(true);
              }}
            />
          }
        >
          <View style={styles.entry}>
            <Text style={hasReview ? styles.entryTitleFilled : styles.entryTitle}>
              {hasReview ? `Entry #${nextEntryNumber}` : `ENTRY #${nextEntryNumber}`}
            </Text>
            <TextInput
              accessibilityLabel="Thoughts from the night"
              placeholder="THOUGHTS FROM THE NIGHT?"
              placeholderTextColor={colors.fieldLabel}
              selectionColor={colors.ink}
              value={draft.review}
              onChangeText={(review) => updateDraft({ review })}
              autoCapitalize="sentences"
              multiline
              scrollEnabled={false}
              style={styles.review}
            />
          </View>
        </EntryGrid>
      </ScrollView>

      {pickerOpen && (
        <>
          <Pressable style={StyleSheet.absoluteFill} accessibilityLabel="Close date picker" onPress={closePicker} />
          <View style={[styles.picker, { paddingBottom: insets.bottom }]}>
            <DateWheel value={pickerDate} onChange={setPickerDate} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    paddingTop: 18,
    paddingBottom: 17,
  },
  gridGap: {
    height: 18.6,
  },
  entry: {
    paddingHorizontal: SCREEN_MARGIN,
    paddingTop: 17,
    gap: 14,
  },
  entryTitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 20,
    color: colors.fieldLabel,
  },
  entryTitleFilled: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 20,
    color: colors.ink,
  },
  review: {
    minHeight: 180,
    padding: 0,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.ink,
    textAlignVertical: "top",
  },
  picker: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 282,
    backgroundColor: colors.background,
    justifyContent: "center",
  },
});
