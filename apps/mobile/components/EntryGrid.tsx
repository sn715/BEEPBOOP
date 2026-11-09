import { ReactNode, useRef, useState } from "react";
import { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors, fonts, SCREEN_MARGIN } from "../lib/theme";
import { Divider, TextInputHandle } from "./ui";

export const ARTIST_ROW_HEIGHT = 66;
export const VENUE_ROW_HEIGHT = 62;
const VALUE_TOP = 29;
const VALUE_HEIGHT = 22;

// The ruled artist / venue / date grid. Cells go in as children, so the form and the saved entry share one layout.
export function EntryGrid({ artist, venue, date, children }: { artist: ReactNode; venue: ReactNode; date: ReactNode; children: ReactNode }) {
  return (
    <>
      <Divider soft />
      <View style={{ height: ARTIST_ROW_HEIGHT }}>{artist}</View>
      <Divider soft />
      <View style={[styles.venueRow, { height: VENUE_ROW_HEIGHT }]}>
        <View style={styles.venueCell}>{venue}</View>
        <View style={styles.verticalLine} />
        <View style={styles.dateCell}>{date}</View>
      </View>
      <Divider soft />
      {children}
    </>
  );
}

// A large label on its own when empty, and a small label above the value once filled.
function CellLabel({ label, filled, active, rowHeight }: { label: string; filled: boolean; active: boolean; rowHeight: number }) {
  return (
    <Text
      pointerEvents="none"
      style={[
        styles.label,
        filled ? styles.labelFilled : [styles.labelEmpty, { top: (rowHeight - 20) / 2 }],
        !filled && active && styles.labelActive,
      ]}
    >
      {label}
    </Text>
  );
}

export function GridText({ label, value, rowHeight }: { label: string; value: string; rowHeight: number }) {
  return (
    <View style={styles.cell}>
      <CellLabel label={label} filled active={false} rowHeight={rowHeight} />
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

type GridInputProps = Omit<ComponentProps<typeof TextInput>, "style" | "value"> & { label: string; value: string; rowHeight: number };

export function GridInput({ label, value, rowHeight, ...input }: GridInputProps) {
  const inputRef = useRef<TextInputHandle>(null);
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;

  return (
    <Pressable style={styles.cell} accessible={false} onPress={() => inputRef.current?.focus()}>
      <CellLabel label={label} filled={filled} active={focused} rowHeight={rowHeight} />
      <TextInput
        {...input}
        ref={inputRef}
        value={value}
        accessibilityLabel={label}
        selectionColor={colors.ink}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, { top: filled ? VALUE_TOP : (rowHeight - VALUE_HEIGHT) / 2 }]}
      />
    </Pressable>
  );
}

export function GridButton({ label, value, active, rowHeight, onPress }: { label: string; value: string | null; active: boolean; rowHeight: number; onPress: () => void }) {
  return (
    <Pressable
      style={styles.cell}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      onPress={onPress}
    >
      <CellLabel label={label} filled={!!value} active={active} rowHeight={rowHeight} />
      {value && (
        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  venueRow: {
    flexDirection: "row",
  },
  venueCell: {
    flex: 203,
  },
  dateCell: {
    flex: 190,
  },
  verticalLine: {
    width: 0.67,
    backgroundColor: colors.lineSoft,
  },
  cell: {
    flex: 1,
  },
  label: {
    position: "absolute",
    left: SCREEN_MARGIN,
    right: 8,
    fontFamily: fonts.regular,
    color: colors.fieldLabel,
    textTransform: "uppercase",
  },
  labelEmpty: {
    fontSize: 15,
    lineHeight: 20,
  },
  labelFilled: {
    top: 8,
    fontSize: 12,
    lineHeight: 16,
  },
  labelActive: {
    color: colors.ink,
  },
  value: {
    position: "absolute",
    top: VALUE_TOP,
    left: SCREEN_MARGIN,
    right: 8,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: VALUE_HEIGHT,
    color: colors.ink,
  },
  input: {
    position: "absolute",
    left: SCREEN_MARGIN,
    right: 8,
    height: VALUE_HEIGHT,
    padding: 0,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.ink,
  },
});
