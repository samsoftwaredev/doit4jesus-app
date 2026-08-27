import Feather from "@expo/vector-icons/Feather";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Linking } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { APP_CONFIG } from "@/config/app-config";
import { useAuth } from "@/features/auth";
import {
  fetchCurrentUserProfile,
  type CurrentUserProfile,
  type Gender,
  updateCurrentUserProfile,
} from "@/features/profile";
import { supabase } from "@/lib/supabase";
import { theme } from "@/theme/tokens";

import { ProfileHeroCard } from "./components/ProfileHeroCard";
import { ProfileToast } from "./components/ProfileToast";
import { SaintAvatarSelector } from "./components/SaintAvatarSelector";
import { SettingsRow } from "./components/SettingsRow";
import { SettingsSection } from "./components/SettingsSection";

const countryNames: Record<string, string> = {
  US: "USA",
};

export function formatProfileLocation(profile: CurrentUserProfile): string {
  const country = countryNames[profile.countryCode] ?? profile.countryCode;
  const parts = [profile.cityName, profile.state, country].filter((value): value is string => Boolean(value?.trim()));

  return parts.join(", ") || "Location unavailable";
}

export function ProfileSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { configurationError } = useAuth();
  const [profile, setProfile] = useState<CurrentUserProfile>();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const signOutInFlightRef = useRef(false);
  const [nameEditorVisible, setNameEditorVisible] = useState(false);
  const [genderSelectorVisible, setGenderSelectorVisible] = useState(false);
  const [saintSelectorVisible, setSaintSelectorVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();

  const loadProfile = useCallback(async () => {
    setProfileError(undefined);
    setIsLoadingProfile(true);

    try {
      setProfile(await fetchCurrentUserProfile());
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "We couldn't load your profile.");
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const updateProfile = async (
    update: Parameters<typeof updateCurrentUserProfile>[0],
    successMessage: string,
  ): Promise<boolean> => {
    if (!profile || isUpdating) return false;

    setIsUpdating(true);
    try {
      const updatedProfile = await updateCurrentUserProfile(update);
      setProfile(updatedProfile);
      setToastMessage(successMessage);
      return true;
    } catch {
      setToastMessage("Something went wrong. Please try again.");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const openExternalUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      setToastMessage("We couldn't open that link. Please try again.");
    }
  };

  const showSignOutConfirmation = () => {
    if (isSigningOut) return;

    Alert.alert("Sign Out?", "Are you sure you want to sign out of Do It for Jesus?", [
      { style: "cancel", text: "Cancel" },
      {
        style: "destructive",
        text: "Sign Out",
        onPress: () => void signOut(),
      },
    ]);
  };

  const signOut = async () => {
    if (signOutInFlightRef.current) return;
    if (configurationError) {
      setToastMessage(configurationError);
      return;
    }

    signOutInFlightRef.current = true;
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) return;

      signOutInFlightRef.current = false;
      setToastMessage(error.message);
      setIsSigningOut(false);
    } catch {
      signOutInFlightRef.current = false;
      setToastMessage("Something went wrong. Please try again.");
      setIsSigningOut(false);
    }
  };

  const location = profile ? formatProfileLocation(profile) : "Location unavailable";
  const appVersion = Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "—";

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + theme.spacing[8] }]}
        showsVerticalScrollIndicator={false}
      >
        <Text accessibilityRole="header" style={styles.pageTitle}>
          Profile &amp; Settings
        </Text>

        <ProfileToast message={toastMessage} onDismiss={() => setToastMessage(undefined)} />

        {isLoadingProfile ? <ProfileSkeleton /> : null}

        {profileError && !isLoadingProfile ? (
          <View accessibilityRole="alert" style={styles.errorCard}>
            <Text style={styles.errorTitle}>We couldn't load your profile.</Text>
            <Text style={styles.errorCopy}>Your support and account settings are still available below.</Text>
            <Pressable accessibilityRole="button" onPress={() => void loadProfile()} style={styles.retryButton}>
              <Text style={styles.retryLabel}>Try Again</Text>
            </Pressable>
          </View>
        ) : null}

        {profile && !isLoadingProfile ? (
          <>
            <ProfileHeroCard
              location={location}
              onAvatarPress={() => setSaintSelectorVisible(true)}
              profile={profile}
            />

            <SettingsSection title="PROFILE">
              <SettingsRow
                icon="user"
                label="Name"
                onPress={() => setNameEditorVisible(true)}
                value={profile.displayName}
              />
              <SettingsRow
                icon="users"
                label="Gender"
                onPress={() => setGenderSelectorVisible(true)}
                value={profile.gender === "male" ? "Male" : "Female"}
              />
              <SettingsRow icon="map-pin" isLast label="Location" value={location} />
            </SettingsSection>
          </>
        ) : null}

        <SettingsSection title="SUPPORT">
          <SettingsRow
            icon="headphones"
            isLast
            label="Contact Support"
            onPress={() =>
              void openExternalUrl(
                `mailto:${APP_CONFIG.supportEmail}?subject=${encodeURIComponent("Do It for Jesus Support")}`,
              )
            }
          />
        </SettingsSection>

        <SettingsSection title="ABOUT">
          <SettingsRow icon="info" label="About Us" onPress={() => router.push("/about")} />
          <SettingsRow
            external
            icon="shield"
            label="Privacy Policy"
            onPress={() => void openExternalUrl(APP_CONFIG.privacyPolicyUrl)}
          />
          <SettingsRow
            external
            icon="file-text"
            label="Terms of Service"
            onPress={() => void openExternalUrl(APP_CONFIG.termsOfServiceUrl)}
          />
          <SettingsRow icon="info" isLast label="App Version" value={appVersion} />
        </SettingsSection>

        <SettingsSection title="ACCOUNT">
          <SettingsRow
            destructive
            icon="log-out"
            isLast
            label="Sign Out"
            onPress={showSignOutConfirmation}
            showChevron={!isSigningOut}
            value={isSigningOut ? "Signing out…" : undefined}
          />
        </SettingsSection>
      </ScrollView>

      {profile ? (
        <>
          <EditNameSheet
            isSaving={isUpdating}
            onDismiss={() => setNameEditorVisible(false)}
            onSave={async (displayName) => {
              const saved = await updateProfile({ displayName }, "Name updated");
              if (saved) setNameEditorVisible(false);
            }}
            value={profile.displayName}
            visible={nameEditorVisible}
          />
          <GenderSelector
            isSaving={isUpdating}
            onDismiss={() => setGenderSelectorVisible(false)}
            onSelect={async (gender) => {
              const saved = await updateProfile({ gender }, "Gender updated");
              if (saved) setGenderSelectorVisible(false);
            }}
            selectedGender={profile.gender}
            visible={genderSelectorVisible}
          />
          <SaintAvatarSelector
            onDismiss={() => setSaintSelectorVisible(false)}
            onSelect={(saintAvatarId) => updateProfile({ saintAvatarId }, "Profile picture updated")}
            selectedSaintAvatarId={profile.saintAvatarId}
            visible={saintSelectorVisible}
          />
        </>
      ) : null}
    </SafeAreaView>
  );
}

function ProfileSkeleton() {
  return (
    <>
      <View accessibilityLabel="Loading profile" style={styles.skeletonHero}>
        <View style={styles.skeletonAvatar} />
        <View style={styles.skeletonName} />
        <View style={styles.skeletonLocation} />
      </View>
      <View style={styles.skeletonSection}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonGroup}>
          <View style={styles.skeletonRow} />
          <View style={styles.skeletonRow} />
          <View style={[styles.skeletonRow, styles.skeletonLastRow]} />
        </View>
      </View>
    </>
  );
}

function EditNameSheet({
  isSaving,
  onDismiss,
  onSave,
  value,
  visible,
}: {
  isSaving: boolean;
  onDismiss: () => void;
  onSave: (displayName: string) => Promise<void>;
  value: string;
  visible: boolean;
}) {
  const [displayName, setDisplayName] = useState(value);
  const trimmedName = displayName.trim();
  const canSave = trimmedName.length >= 2 && trimmedName.length <= 80 && trimmedName !== value;

  useEffect(() => {
    if (visible) setDisplayName(value);
  }, [value, visible]);

  return (
    <Modal animationType="fade" onRequestClose={onDismiss} transparent visible={visible}>
      <View style={styles.modalBackdrop}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text accessibilityRole="header" style={styles.dialogTitle}>
            Edit Name
          </Text>
          <Text style={styles.dialogCopy}>Choose the name your friends see in Do It for Jesus.</Text>
          <TextInput
            accessibilityLabel="Display name"
            autoCapitalize="words"
            autoFocus
            maxLength={80}
            onChangeText={setDisplayName}
            placeholder="Your name"
            placeholderTextColor={theme.colors.text.subtle}
            style={styles.textInput}
            value={displayName}
          />
          <View style={styles.dialogActions}>
            <Pressable accessibilityRole="button" disabled={isSaving} onPress={onDismiss} style={styles.actionButton}>
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSave || isSaving }}
              disabled={!canSave || isSaving}
              onPress={() => void onSave(trimmedName)}
              style={({ pressed }) => [
                styles.saveButton,
                (!canSave || isSaving) && styles.disabled,
                pressed && canSave && !isSaving && styles.pressed,
              ]}
            >
              <Text style={styles.saveLabel}>{isSaving ? "Saving…" : "Save"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function GenderSelector({
  isSaving,
  onDismiss,
  onSelect,
  selectedGender,
  visible,
}: {
  isSaving: boolean;
  onDismiss: () => void;
  onSelect: (gender: Gender) => Promise<void>;
  selectedGender: Gender;
  visible: boolean;
}) {
  return (
    <Modal animationType="fade" onRequestClose={onDismiss} transparent visible={visible}>
      <View style={styles.modalBackdrop}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text accessibilityRole="header" style={styles.dialogTitle}>
            Gender
          </Text>
          <View style={styles.choiceList}>
            {(["male", "female"] as const).map((gender) => {
              const selected = selectedGender === gender;
              const label = gender === "male" ? "Male" : "Female";
              return (
                <Pressable
                  accessibilityLabel={label}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isSaving, selected }}
                  disabled={isSaving}
                  key={gender}
                  onPress={() => void onSelect(gender)}
                  style={({ pressed }) => [styles.choice, pressed && !isSaving && styles.pressed]}
                >
                  <Text style={styles.choiceLabel}>{label}</Text>
                  {selected ? (
                    <Feather
                      accessible={false}
                      color={theme.colors.gold.pale}
                      name="check"
                      size={theme.sizes.iconSmall}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
          <Pressable accessibilityRole="button" disabled={isSaving} onPress={onDismiss} style={styles.closeSheetButton}>
            <Text style={styles.cancelLabel}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  cancelLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.secondary,
  },
  choice: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 56,
    paddingHorizontal: theme.spacing[1],
  },
  choiceLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
  },
  choiceList: {
    marginTop: theme.spacing[3],
  },
  closeSheetButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
  },
  content: {
    alignSelf: "center",
    maxWidth: 700,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[5],
    width: "100%",
  },
  dialog: {
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.strong,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    padding: theme.spacing[5],
    width: "100%",
  },
  dialogActions: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: theme.spacing[4],
  },
  dialogCopy: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[1],
  },
  dialogTitle: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
  },
  disabled: {
    opacity: theme.opacity.disabled,
  },
  errorCard: {
    backgroundColor: theme.colors.semantic.warningSurface,
    borderColor: theme.colors.semantic.warningBorder,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    marginTop: theme.spacing[2],
    padding: theme.spacing[4],
  },
  errorCopy: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  errorTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: theme.colors.background.overlay,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing[4],
  },
  pageTitle: {
    ...theme.typography.heading2,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamilies.devotional,
    textAlign: "center",
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  retryButton: {
    alignSelf: "flex-start",
    marginTop: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
    justifyContent: "center",
  },
  retryLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.gold.pale,
  },
  safeArea: {
    backgroundColor: theme.colors.background.primary,
    flex: 1,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: theme.colors.gold.pale,
    borderRadius: theme.radii.pill,
    justifyContent: "center",
    marginLeft: theme.spacing[2],
    minHeight: theme.sizes.touchTarget,
    minWidth: 84,
    paddingHorizontal: theme.spacing[4],
  },
  saveLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.inverse,
  },
  skeletonAvatar: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.pill,
    height: 112,
    width: 112,
  },
  skeletonGroup: {
    backgroundColor: theme.colors.surface.navy,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    overflow: "hidden",
  },
  skeletonHero: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.navy,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    marginTop: theme.spacing[2],
    padding: theme.spacing[5],
  },
  skeletonLastRow: {
    borderBottomWidth: 0,
  },
  skeletonLocation: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.xs,
    height: theme.spacing[3],
    marginTop: theme.spacing[2],
    width: 148,
  },
  skeletonName: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.xs,
    height: theme.spacing[5],
    marginTop: theme.spacing[4],
    width: 160,
  },
  skeletonRow: {
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    height: 64,
  },
  skeletonSection: {
    marginTop: theme.spacing[6],
  },
  skeletonTitle: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.xs,
    height: theme.spacing[2],
    marginBottom: theme.spacing[2],
    width: 68,
  },
  textInput: {
    ...theme.typography.body,
    backgroundColor: theme.colors.background.deep,
    borderColor: theme.colors.border.interactive,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    color: theme.colors.text.primary,
    marginTop: theme.spacing[4],
    minHeight: theme.sizes.inputHeight,
    paddingHorizontal: theme.spacing[3],
  },
});
