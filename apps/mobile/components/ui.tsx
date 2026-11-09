import { ComponentProps, ReactNode, Ref, useState } from "react";
import { KeyboardAvoidingView, Pressable, ScrollView, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fonts, SCREEN_MARGIN } from "../lib/theme";

export type TextInputHandle = React.ComponentRef<typeof TextInput>;

export function Divider({ soft }: { soft?: boolean }) {
  return <View style={soft ? styles.dividerSoft : styles.divider} />;
}

export function Label({ children, style }: { children: ReactNode; style?: ComponentProps<typeof Text>["style"] }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

type NavBarProps = {
  title?: string;
  onBack?: () => void;
  action?: { label: string; onPress: () => void; disabled?: boolean };
  right?: ReactNode;
};

// The one top bar: chunky back arrow on the left, an uppercase title in the middle, and the screen's next step on the right.
export function NavBar({ title, onBack, action, right }: NavBarProps) {
  return (
    <View style={styles.navBar}>
      {title ? <Text style={styles.navTitle}>{title}</Text> : null}
      {onBack ? (
        <Pressable hitSlop={16} accessibilityRole="button" accessibilityLabel="Back" onPress={onBack} style={styles.navSide}>
          <Image source={require("../assets/images/arrow-back.svg")} style={styles.navArrow} />
        </Pressable>
      ) : (
        <View style={styles.navSide} />
      )}
      {action ? (
        <Pressable
          hitSlop={16}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          accessibilityState={{ disabled: !!action.disabled }}
          disabled={action.disabled}
          onPress={action.onPress}
          style={[styles.navSide, styles.navSideRight, action.disabled && styles.navDisabled]}
        >
          <Image source={require("../assets/images/arrow-next.svg")} style={styles.navArrow} />
        </Pressable>
      ) : null}
      {right ? <View style={[styles.navSide, styles.navSideRight]}>{right}</View> : null}
    </View>
  );
}

export function PrimaryButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.primary, disabled && styles.primaryDisabled]}
    >
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function TertiaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.tertiary}>
      <Text style={styles.tertiaryText}>{label}</Text>
    </Pressable>
  );
}

export function PlusIcon() {
  return (
    <View style={styles.plus}>
      <View style={styles.plusHorizontal} />
      <View style={styles.plusVertical} />
    </View>
  );
}

// Label above in mono, never as a placeholder. Focus puts a ring on the box.
type FieldProps = Omit<ComponentProps<typeof TextInput>, "style"> & {
  label: string;
  inputRef?: Ref<TextInputHandle>;
  style?: StyleProp<ViewStyle>;
};

export function Field({ label, inputRef, style, multiline, ...input }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.field, style]}>
      <Label>{label}</Label>
      <TextInput
        {...input}
        ref={inputRef}
        multiline={multiline}
        scrollEnabled={multiline ? false : undefined}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        selectionColor={colors.ink}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.fieldBox, multiline && styles.fieldMultiline, focused && styles.fieldFocused]}
      />
    </View>
  );
}

export function FieldButton({ label, value, placeholder, focused, onPress, style }: { label: string; value: string | null; placeholder: string; focused?: boolean; onPress: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.field, style]}>
      <Label>{label}</Label>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={value ? `${label}, ${value}` : label}
        onPress={onPress}
        style={[styles.fieldBox, styles.fieldButtonBox, focused && styles.fieldFocused]}
      >
        <Text style={[styles.fieldValue, !value && styles.mutedText]} numberOfLines={1}>
          {value ?? placeholder}
        </Text>
      </Pressable>
    </View>
  );
}

export function SearchBox(props: { placeholder: string; value: string; onChangeText: (text: string) => void }) {
  return (
    <View style={styles.search}>
      <Image source={require("../assets/images/icon-search.svg")} style={styles.searchIcon} />
      <TextInput
        {...props}
        accessibilityLabel={props.placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={colors.muted}
        selectionColor={colors.ink}
        style={styles.searchInput}
      />
    </View>
  );
}

// The shared onboarding layout: nav bar, big title, scrolling body and buttons pinned to the bottom.
export function OnboardingScreen({ title, subtitle, onBack, footer, children }: { title: string; subtitle: string; onBack: () => void; footer: ReactNode; children?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView behavior="padding" style={[styles.screen, { paddingTop: insets.top }]}>
      <NavBar onBack={onBack} />
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.onboardingBody}>
        <Text style={styles.headline}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {children}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>{footer}</View>
    </KeyboardAvoidingView>
  );
}

export const sharedStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: "hidden",
  },
  headline: {
    fontFamily: fonts.bold,
    fontSize: 52,
    lineHeight: 56,
    letterSpacing: -1,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 17,
    lineHeight: 25,
    color: colors.muted,
  },
  footer: {
    paddingTop: 16,
    paddingHorizontal: SCREEN_MARGIN,
    alignItems: "center",
    gap: 8,
  },
});

const styles = StyleSheet.create({
  screen: sharedStyles.screen,
  headline: sharedStyles.headline,
  subtitle: sharedStyles.subtitle,
  footer: sharedStyles.footer,
  divider: {
    height: 0.5,
    backgroundColor: colors.line,
  },
  dividerSoft: {
    height: 0.67,
    backgroundColor: colors.lineSoft,
  },
  mutedText: {
    color: colors.muted,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
    textTransform: "uppercase",
  },
  navBar: {
    height: 58.5,
    paddingLeft: 25,
    paddingRight: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.ink,
    textTransform: "uppercase",
  },
  navSide: {
    minWidth: 56,
  },
  navSideRight: {
    alignItems: "flex-end",
  },
  navArrow: {
    width: 11,
    height: 16,
  },
  navDisabled: {
    opacity: 0.35,
  },
  primary: {
    width: 240,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryDisabled: {
    opacity: 0.35,
  },
  primaryText: {
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.background,
  },
  tertiary: {
    width: 240,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  tertiaryText: {
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.muted,
  },
  plus: {
    width: 24,
    height: 24,
  },
  plusHorizontal: {
    position: "absolute",
    top: 11,
    width: 24,
    height: 2,
    backgroundColor: colors.muted,
  },
  plusVertical: {
    position: "absolute",
    left: 11,
    width: 2,
    height: 24,
    backgroundColor: colors.muted,
  },
  field: {
    gap: 8,
  },
  fieldBox: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: colors.surface,
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.ink,
  },
  fieldMultiline: {
    height: undefined,
    minHeight: 160,
    paddingTop: 14,
    paddingBottom: 14,
    textAlignVertical: "top",
  },
  fieldFocused: {
    borderColor: colors.ink,
  },
  fieldButtonBox: {
    justifyContent: "center",
  },
  fieldValue: {
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.ink,
  },
  search: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchIcon: {
    width: 16,
    height: 16,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.ink,
  },
  onboardingBody: {
    paddingTop: 40,
    paddingHorizontal: SCREEN_MARGIN,
    paddingBottom: 20,
    gap: 16,
  },
});
