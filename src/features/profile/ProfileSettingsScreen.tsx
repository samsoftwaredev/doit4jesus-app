import Feather from "@expo/vector-icons/Feather";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PageHeader } from "@/components";
import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { Button } from "@/components/ui";
import { APP_CONFIG } from "@/config/app-config";
import { useAuth } from "@/features/auth";
import {
  deleteCurrentUserProfile,
  fetchCurrentUserProfile,
  updateCurrentUserProfile,
  type CurrentUserProfile,
  type Gender,
} from "@/features/profile";
import { supabase } from "@/lib/supabase";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useAppTheme } from "@/theme/AppThemeProvider";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
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
  const countryCode = profile.countryCode ?? "";
  const country = countryNames[countryCode] ?? profile.countryName ?? countryCode;
  return country || "Country unavailable";
}

/** Renders profile management and settings within the shared atmosphere. */
export function ProfileSettingsScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { configurationError } = useAuth();
  const { colorScheme, preference } = useAppTheme();
  const { gutter, isTablet } = useResponsiveLayout();
  const [profile, setProfile] = useState<CurrentUserProfile>();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingProfile, setIsDeletingProfile] = useState(false);
  const signOutInFlightRef = useRef(false);
  const deleteProfileInFlightRef = useRef(false);
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
      setProfileError(error instanceof Error ? error.message : t("profile.errors.load"));
    } finally {
      setIsLoadingProfile(false);
    }
  }, [t]);

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
      setToastMessage(t("profile.errors.generic"));
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const openExternalUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      setToastMessage(t("profile.errors.link"));
    }
  };

  const signOut = async () => {
    if (signOutInFlightRef.current || deleteProfileInFlightRef.current) return;
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
      setToastMessage(t("profile.errors.generic"));
      setIsSigningOut(false);
    }
  };

  const showDeleteProfileConfirmation = () => {
    if (isDeletingProfile || isSigningOut) return;

    Alert.alert(t("profile.deleteConfirmation.title"), t("profile.deleteConfirmation.description"), [
      { style: "cancel", text: t("common.cancel") },
      {
        style: "destructive",
        text: t("profile.deleteAccount"),
        onPress: () => void deleteProfile(),
      },
    ]);
  };

  const deleteProfile = async () => {
    if (deleteProfileInFlightRef.current || isSigningOut) return;
    if (configurationError) {
      setToastMessage(configurationError);
      return;
    }

    deleteProfileInFlightRef.current = true;
    setIsDeletingProfile(true);
    try {
      await deleteCurrentUserProfile();
    } catch {
      deleteProfileInFlightRef.current = false;
      setIsDeletingProfile(false);
      setToastMessage(t("profile.errors.delete"));
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (!error) return;

      setToastMessage(t("profile.errors.signedOutAfterDelete"));
    } catch {
      setToastMessage(t("profile.errors.signedOutAfterDelete"));
    } finally {
      deleteProfileInFlightRef.current = false;
      setIsDeletingProfile(false);
    }
  };

  const rawLocation = profile ? formatProfileLocation(profile) : "";
  const location =
    rawLocation === "Country unavailable" || !rawLocation ? t("profile.countryUnavailable") : rawLocation;
  const appVersion = Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "—";
  const resolvedScheme = t(`profile.appearanceValue.${colorScheme}`);
  const appearanceSummary =
    preference === "system"
      ? t("profile.appearanceValue.system", { scheme: resolvedScheme })
      : t(`profile.appearanceValue.${preference}`);

  return (
    <AtmosphericSafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            maxWidth: isTablet ? 760 : 700,
            paddingBottom: insets.bottom + theme.spacing[8],
            paddingHorizontal: gutter,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader description={t("profile.description")} title={t("profile.title")} />

        <ProfileToast message={toastMessage} onDismiss={() => setToastMessage(undefined)} />

        {isLoadingProfile ? <ProfileSkeleton /> : null}

        {profileError && !isLoadingProfile ? (
          <View accessibilityRole="alert" style={styles.errorCard}>
            <Text style={styles.errorTitle}>{t("profile.errors.load")}</Text>
            <Text style={styles.errorCopy}>{t("profile.errors.loadCopy")}</Text>
            <Button onPress={() => void loadProfile()} size="sm" style={styles.errorAction} variant="secondary">
              {t("profile.tryAgain")}
            </Button>
          </View>
        ) : null}

        {profile && !isLoadingProfile ? (
          <>
            <ProfileHeroCard
              location={location}
              onAvatarPress={() => setSaintSelectorVisible(true)}
              profile={profile}
            />

            <SettingsSection title={t("profile.profile")}>
              <SettingsRow
                icon="user"
                label={t("profile.name")}
                onPress={() => setNameEditorVisible(true)}
                value={profile.displayName ?? t("profile.notSet")}
              />
              <SettingsRow
                icon="users"
                label={t("profile.gender")}
                onPress={() => setGenderSelectorVisible(true)}
                value={profile.gender === "male" ? t("profile.male") : t("profile.female")}
              />
              <SettingsRow icon="map-pin" isLast label={t("profile.country")} value={location} />
            </SettingsSection>
          </>
        ) : null}

        <SettingsSection title={t("profile.appearanceSection")}>
          <SettingsRow
            icon="sun"
            isLast
            label={t("profile.appearance")}
            onPress={() => router.push("/settings")}
            value={appearanceSummary}
          />
        </SettingsSection>

        <SettingsSection title={t("profile.support")}>
          <SettingsRow
            icon="headphones"
            isLast
            label={t("profile.contactSupport")}
            onPress={() =>
              void openExternalUrl(
                `mailto:${APP_CONFIG.supportEmail}?subject=${encodeURIComponent("Do It for Jesus Support")}`,
              )
            }
          />
        </SettingsSection>

        <SettingsSection title={t("profile.about")}>
          <SettingsRow icon="info" label={t("profile.aboutUs")} onPress={() => router.push("/about")} />
          <SettingsRow
            external
            icon="shield"
            label={t("profile.privacyPolicy")}
            onPress={() => void openExternalUrl(APP_CONFIG.privacyPolicyUrl)}
          />
          <SettingsRow
            external
            icon="file-text"
            label={t("profile.terms")}
            onPress={() => void openExternalUrl(APP_CONFIG.termsOfServiceUrl)}
          />
          <SettingsRow icon="info" isLast label={t("profile.appVersion")} value={appVersion} />
        </SettingsSection>

        <SettingsSection title={t("profile.account")}>
          <SettingsRow
            destructive
            icon="trash-2"
            label={t("profile.deleteAccount")}
            onPress={showDeleteProfileConfirmation}
            showChevron={!isDeletingProfile}
            value={isDeletingProfile ? t("profile.deleting") : undefined}
          />
          <SettingsRow
            destructive
            icon="log-out"
            isLast
            label={t("profile.signOut")}
            onPress={signOut}
            showChevron={!isSigningOut}
            value={isSigningOut ? t("profile.signingOut") : undefined}
          />
        </SettingsSection>
      </ScrollView>

      {profile ? (
        <>
          <EditNameSheet
            isSaving={isUpdating}
            onDismiss={() => setNameEditorVisible(false)}
            onSave={async (displayName) => {
              const saved = await updateProfile({ displayName }, t("profile.success.name"));
              if (saved) setNameEditorVisible(false);
            }}
            value={profile.displayName ?? ""}
            visible={nameEditorVisible}
          />
          <GenderSelector
            isSaving={isUpdating}
            onDismiss={() => setGenderSelectorVisible(false)}
            onSelect={async (gender) => {
              const saved = await updateProfile({ gender }, t("profile.success.gender"));
              if (saved) setGenderSelectorVisible(false);
            }}
            selectedGender={profile.gender ?? "male"}
            visible={genderSelectorVisible}
          />
          <SaintAvatarSelector
            onDismiss={() => setSaintSelectorVisible(false)}
            onSelect={(saintAvatarId) => updateProfile({ saintAvatarId }, t("profile.success.avatar"))}
            selectedSaintAvatarId={profile.saintAvatarId}
            visible={saintSelectorVisible}
          />
        </>
      ) : null}
    </AtmosphericSafeAreaView>
  );
}

/** Renders ProfileSkeleton with styles resolved from the active appearance. */
function ProfileSkeleton() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  return (
    <>
      <View accessibilityLabel={t("profile.loading")} style={styles.skeletonHero}>
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

/** Presents a keyboard-safe display-name editor that remains centered on large viewports. */
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
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState(value);
  const trimmedName = displayName.trim();
  const canSave = trimmedName.length >= 2 && trimmedName.length <= 80 && trimmedName !== value;

  useEffect(() => {
    if (visible) setDisplayName(value);
  }, [value, visible]);

  return (
    <Modal animationType="fade" onRequestClose={onDismiss} transparent visible={visible}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalBackdrop}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text accessibilityRole="header" style={styles.dialogTitle}>
            {t("profile.editName.title")}
          </Text>
          <Text style={styles.dialogCopy}>{t("profile.editName.description")}</Text>
          <TextInput
            accessibilityLabel={t("profile.editName.displayName")}
            autoCapitalize="words"
            autoFocus
            maxLength={80}
            onChangeText={setDisplayName}
            placeholder={t("profile.editName.placeholder")}
            placeholderTextColor={theme.colors.text.subtle}
            style={styles.textInput}
            value={displayName}
          />
          <View style={styles.dialogActions}>
            <Button disabled={isSaving} onPress={onDismiss} size="sm" variant="ghost">
              {t("common.cancel")}
            </Button>
            <Button
              disabled={!canSave || isSaving}
              loading={isSaving}
              onPress={() => void onSave(trimmedName)}
              size="sm"
              style={styles.saveButton}
              variant="warning"
            >
              {t("common.save")}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/** Presents the compact gender choice dialog with accessible selected state. */
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
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  return (
    <Modal animationType="fade" onRequestClose={onDismiss} transparent visible={visible}>
      <View style={styles.modalBackdrop}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text accessibilityRole="header" style={styles.dialogTitle}>
            {t("profile.gender")}
          </Text>
          <View style={styles.choiceList}>
            {(["male", "female"] as const).map((gender) => {
              const selected = selectedGender === gender;
              const label = gender === "male" ? t("profile.male") : t("profile.female");
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
          <Button disabled={isSaving} fullWidth onPress={onDismiss} style={styles.closeSheetButton} variant="ghost">
            {t("common.cancel")}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styleSheet = createThemedStyles((theme) => ({
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
  content: { alignSelf: "center", width: "100%" },
  dialog: {
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.strong,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    padding: theme.spacing[5],
    maxWidth: 560,
    width: "100%",
  },
  dialogActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[2],
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
  pressed: {
    opacity: theme.opacity.pressed,
  },
  errorAction: { marginTop: theme.spacing[3] },
  safeArea: {
    backgroundColor: theme.colors.background.primary,
    flex: 1,
  },
  saveButton: {
    minWidth: 84,
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
}));
