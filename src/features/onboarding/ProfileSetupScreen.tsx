import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, BackHandler, Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { useCurrentProfile } from "@/features/profile";
import { ProfileApiError, updateCurrentUserProfile } from "@/features/profile/profile.api";
import type { CurrentUserProfile, UpdateCurrentUserProfile } from "@/features/profile/profile.types";
import { theme } from "@/theme/tokens";

import { CityAutocomplete } from "./CityAutocomplete";
import type { CitySelection } from "./CityAutocomplete";
import { CountrySelector } from "./CountrySelector";
import {
  completeOnboarding,
  getNotificationPreferences,
  OnboardingApiError,
  updateNotificationPreferences,
  validateUsername,
} from "./onboarding.api";
import type {
  NotificationPreferences,
  OnboardingStep,
  ProfileSetupState,
  UsernameValidation,
} from "./onboarding.types";
import { getResumeStep } from "./onboarding.types";
import { ProfileSetupLayout } from "./ProfileSetupLayout";

type UsernameStatus = "available" | "checking" | "idle" | "invalid" | "unavailable" | "error";

function stateFromProfile(
  profile: CurrentUserProfile,
  notificationPreferences: NotificationPreferences | null,
): ProfileSetupState {
  return {
    cityId: profile.cityId,
    cityName: profile.cityName,
    countryCode: profile.countryCode,
    countryName: profile.countryName,
    displayName: profile.displayName ?? "",
    gender: profile.gender,
    notificationPreferences,
    state: profile.state,
    username: profile.username ?? "",
  };
}

function samePreferences(a: NotificationPreferences, b: NotificationPreferences) {
  return (
    a.confessionReminder === b.confessionReminder &&
    a.dailyRosaryReminder === b.dailyRosaryReminder &&
    a.eucharisticAdoration === b.eucharisticAdoration
  );
}

function usernameReasonMessage(reason: string | null) {
  switch (reason) {
    case "INVALID_LENGTH":
      return "Choose a username with a valid length.";
    case "INVALID_CHARACTERS":
      return "Use only the characters allowed for usernames.";
    case "PROHIBITED_TERM":
      return "Choose a different username.";
    case "USERNAME_TAKEN":
      return "That username is already taken.";
    default:
      return "That username isn't valid.";
  }
}

export function ProfileSetupScreen() {
  const router = useRouter();
  const {
    notificationPreferences: cachedPreferences,
    profile,
    replaceNotificationPreferences,
    replaceProfile,
  } = useCurrentProfile();
  const completionInFlightRef = useRef(false);
  const preferenceRequestInFlightRef = useRef(false);
  const savedPreferencesRef = useRef<NotificationPreferences | null>(cachedPreferences);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [preferenceLoadAttempt, setPreferenceLoadAttempt] = useState(0);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);
  const [step, setStep] = useState<OnboardingStep>(() => (profile ? getResumeStep(profile.profileSetup) : 1));
  const [usernameResult, setUsernameResult] = useState<UsernameValidation | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [usernameValidationAttempt, setUsernameValidationAttempt] = useState(0);
  const [form, setForm] = useState<ProfileSetupState>(() =>
    profile
      ? stateFromProfile(profile, cachedPreferences)
      : {
          cityId: null,
          cityName: null,
          countryCode: null,
          countryName: null,
          displayName: "",
          gender: null,
          notificationPreferences: cachedPreferences,
          state: null,
          username: "",
        },
  );

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (step > 1) {
        setError(null);
        setStep((current) => Math.max(1, current - 1) as OnboardingStep);
      }
      return true;
    });
    return () => subscription.remove();
  }, [step]);

  useEffect(() => {
    if (!profile || step < 6 || form.notificationPreferences || preferenceRequestInFlightRef.current) return;
    let active = true;
    preferenceRequestInFlightRef.current = true;
    setIsLoadingPreferences(true);
    setPreferencesError(null);

    void getNotificationPreferences()
      .then((preferences) => {
        if (!active) return;
        savedPreferencesRef.current = preferences;
        replaceNotificationPreferences(preferences);
        setForm((current) => ({ ...current, notificationPreferences: preferences }));
      })
      .catch(() => {
        if (active) setPreferencesError("We couldn't load your notification preferences. Try again.");
      })
      .finally(() => {
        preferenceRequestInFlightRef.current = false;
        if (active) setIsLoadingPreferences(false);
      });

    return () => {
      active = false;
    };
  }, [form.notificationPreferences, preferenceLoadAttempt, profile, replaceNotificationPreferences, step]);

  useEffect(() => {
    if (step !== 2 || !profile) return;
    const candidate = form.username.trim();
    if (!candidate) {
      setUsernameResult(null);
      setUsernameStatus("idle");
      return;
    }
    if (candidate === profile.username) {
      setUsernameResult(null);
      setUsernameStatus("available");
      return;
    }

    setUsernameStatus("checking");
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      void validateUsername(candidate, controller.signal)
        .then((result) => {
          if (controller.signal.aborted || form.username.trim() !== candidate) return;
          setUsernameResult(result);
          setUsernameStatus(
            result.valid && result.available
              ? "available"
              : result.reason === "USERNAME_TAKEN" || (result.valid && !result.available)
                ? "unavailable"
                : "invalid",
          );
        })
        .catch((requestError) => {
          if (controller.signal.aborted) return;
          if (requestError instanceof OnboardingApiError && requestError.suggestions.length > 0) {
            setUsernameResult({
              available: false,
              normalizedUsername: candidate,
              reason: requestError.reason ?? null,
              suggestions: requestError.suggestions,
              username: candidate,
              valid: false,
            });
          }
          setUsernameStatus("error");
        });
    }, 1000);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [form.username, profile, step, usernameValidationAttempt]);

  if (!profile) return null;

  const syncProfile = (updatedProfile: CurrentUserProfile, clearCity = false) => {
    replaceProfile(updatedProfile);
    setForm((current) => ({
      ...current,
      cityId: clearCity ? null : updatedProfile.cityId,
      cityName: clearCity ? null : updatedProfile.cityName,
      countryCode: updatedProfile.countryCode,
      countryName: updatedProfile.countryName,
      displayName: updatedProfile.displayName ?? "",
      gender: updatedProfile.gender,
      state: clearCity ? null : updatedProfile.state,
      username: updatedProfile.username ?? "",
    }));
  };

  const advance = (nextStep: OnboardingStep) => {
    setError(null);
    setStep(nextStep);
  };

  const saveProfile = async (
    update: UpdateCurrentUserProfile,
    nextStep: OnboardingStep,
    options: { clearCity?: boolean; username?: boolean } = {},
  ) => {
    setError(null);
    setIsSaving(true);
    try {
      const updatedProfile = await updateCurrentUserProfile(update);
      syncProfile(updatedProfile, options.clearCity);
      advance(nextStep);
    } catch (requestError) {
      if (options.username && requestError instanceof ProfileApiError && requestError.status === 409) {
        setError("That username was just taken. Choose another suggestion and try again.");
        setUsernameStatus("unavailable");
        if (requestError.suggestions.length > 0) {
          setUsernameResult({
            available: false,
            normalizedUsername: form.username.trim(),
            reason: "USERNAME_TAKEN",
            suggestions: requestError.suggestions,
            username: form.username.trim(),
            valid: true,
          });
        }
        setUsernameValidationAttempt((attempt) => attempt + 1);
      } else if (options.username && requestError instanceof ProfileApiError && requestError.status === 422) {
        setError("That username was rejected. Choose another username and try again.");
      } else {
        setError("We couldn't save your information. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const next = async () => {
    if (isSaving || isCompleting) return;

    switch (step) {
      case 1: {
        const displayName = form.displayName.trim();
        if (!displayName || displayName.length > 80) {
          setError("Enter your name.");
          return;
        }
        if (displayName === profile.displayName) {
          advance(2);
          return;
        }
        await saveProfile({ displayName }, 2);
        return;
      }
      case 2: {
        const username = form.username.trim();
        if (!username || (username !== profile.username && usernameStatus !== "available")) {
          setError("Choose an available username.");
          return;
        }
        if (username === profile.username) {
          advance(3);
          return;
        }
        await saveProfile({ username }, 3, { username: true });
        return;
      }
      case 3:
        if (!form.gender) {
          setError("Select Knight or Princess.");
          return;
        }
        if (form.gender === profile.gender) {
          advance(4);
          return;
        }
        await saveProfile({ gender: form.gender }, 4);
        return;
      case 4: {
        if (!form.countryCode) {
          setError("Select a country.");
          return;
        }
        if (form.countryCode === profile.countryCode) {
          advance(5);
          return;
        }
        await saveProfile({ countryCode: form.countryCode }, 5, { clearCity: true });
        return;
      }
      case 5:
        if (!form.cityId || !form.countryCode) {
          setError("Select a city from the results.");
          return;
        }
        if (form.cityId === profile.cityId && form.countryCode === profile.countryCode) {
          advance(6);
          return;
        }
        await saveProfile({ cityId: form.cityId }, 6);
        return;
      case 6: {
        const preferences = form.notificationPreferences;
        if (!preferences) {
          setError("Load your notification preferences before continuing.");
          return;
        }
        if (savedPreferencesRef.current && samePreferences(preferences, savedPreferencesRef.current)) {
          advance(7);
          return;
        }
        setError(null);
        setIsSaving(true);
        try {
          const saved = await updateNotificationPreferences(preferences);
          savedPreferencesRef.current = saved;
          replaceNotificationPreferences(saved);
          setForm((current) => ({ ...current, notificationPreferences: saved }));
          advance(7);
        } catch {
          setError("We couldn't save your notification preferences. Please try again.");
        } finally {
          setIsSaving(false);
        }
        return;
      }
      case 7:
        await enterMission();
        return;
    }
  };

  const enterMission = async () => {
    if (completionInFlightRef.current) return;
    const preferences = form.notificationPreferences;
    const displayName = form.displayName.trim();
    const username = form.username.trim();
    if (!displayName || !username || !form.gender || !form.countryCode || !form.cityId || !preferences) {
      setError("Review your setup answers before entering the mission.");
      return;
    }

    completionInFlightRef.current = true;
    setError(null);
    setIsCompleting(true);
    try {
      const result = await completeOnboarding({
        cityId: form.cityId,
        countryCode: form.countryCode,
        displayName,
        gender: form.gender,
        notificationPreferences: preferences,
        username,
      });
      replaceProfile(result.profile);
      replaceNotificationPreferences(result.notificationPreferences);
      setForm(stateFromProfile(result.profile, result.notificationPreferences));

      if (!result.profile.profileSetup.complete) {
        setError("Your setup is still incomplete. Review your answers and try again.");
        return;
      }
      router.replace("/");
    } catch {
      setError("We couldn't complete your setup. Your previous answers are still saved. Please try again.");
    } finally {
      completionInFlightRef.current = false;
      setIsCompleting(false);
    }
  };

  const goBack = () => {
    setError(null);
    setStep((current) => Math.max(1, current - 1) as OnboardingStep);
  };

  const selectedCity: CitySelection | null =
    form.cityId && form.cityName && form.countryCode
      ? {
          countryCode: form.countryCode,
          id: form.cityId,
          name: form.cityName,
          regionName: form.state,
        }
      : null;

  const shared = {
    error,
    nextLoading: isSaving || isCompleting,
    onBack: step > 1 ? goBack : undefined,
    onNext: () => void next(),
    step,
  };

  switch (step) {
    case 1:
      return (
        <ProfileSetupLayout
          {...shared}
          description="We’ll use this for formal communications."
          icon="account-outline"
          nextDisabled={!form.displayName.trim()}
          title="What’s your name?"
        >
          <ProfileSetupTextField
            accessibilityLabel="Display Name"
            autoCapitalize="words"
            helper="e.g. John Bosco"
            label="Display Name"
            maxLength={80}
            onChangeText={(displayName) => {
              setError(null);
              setForm((current) => ({ ...current, displayName }));
            }}
            placeholder="Your name"
            value={form.displayName}
          />
        </ProfileSetupLayout>
      );
    case 2:
      return (
        <ProfileSetupLayout
          {...shared}
          description="This is how your friends will find you."
          icon="account-search-outline"
          nextDisabled={form.username.trim() !== profile.username && usernameStatus !== "available"}
          title="Choose your username"
        >
          <ProfileSetupTextField
            accessibilityLabel="Username"
            autoCapitalize="none"
            autoCorrect={false}
            helper="e.g. WarriorForChrist"
            label="Username"
            onChangeText={(username) => {
              setError(null);
              setUsernameResult(null);
              setUsernameStatus("idle");
              setForm((current) => ({ ...current, username }));
            }}
            placeholder="Username"
            value={form.username}
          />
          <UsernameFeedback result={usernameResult} status={usernameStatus} />
          {usernameResult?.suggestions.length ? (
            <View style={styles.suggestions}>
              <Text style={styles.suggestionsTitle}>Suggestions</Text>
              <View style={styles.chips}>
                {usernameResult.suggestions.map((suggestion) => (
                  <Pressable
                    accessibilityRole="button"
                    key={suggestion}
                    onPress={() => {
                      setError(null);
                      setUsernameResult(null);
                      setUsernameStatus("idle");
                      setForm((current) => ({ ...current, username: suggestion }));
                    }}
                    style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
                  >
                    <Text style={styles.chipLabel}>{suggestion}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
        </ProfileSetupLayout>
      );
    case 3:
      return (
        <ProfileSetupLayout
          {...shared}
          description="This will personalize your experience."
          icon="shield-crown-outline"
          nextDisabled={!form.gender}
          title="Who do you identify as?"
        >
          <View accessibilityRole="radiogroup" style={styles.genderOptions}>
            <GenderOption
              icon="shield-sword-outline"
              label="Knight"
              onPress={() => {
                setError(null);
                setForm((current) => ({ ...current, gender: "male" }));
              }}
              selected={form.gender === "male"}
            />
            <GenderOption
              icon="crown-outline"
              label="Princess"
              onPress={() => {
                setError(null);
                setForm((current) => ({ ...current, gender: "female" }));
              }}
              selected={form.gender === "female"}
            />
          </View>
        </ProfileSetupLayout>
      );
    case 4:
      return (
        <ProfileSetupLayout
          {...shared}
          description="Compete for your country."
          icon="earth"
          nextDisabled={!form.countryCode}
          title="Which country will you represent?"
        >
          <CountrySelector
            onSelect={(country) => {
              setError(null);
              setForm((current) => ({
                ...current,
                cityId: country.code === current.countryCode ? current.cityId : null,
                cityName: country.code === current.countryCode ? current.cityName : null,
                countryCode: country.code,
                countryName: country.name,
                state: country.code === current.countryCode ? current.state : null,
              }));
            }}
            selectedCode={form.countryCode}
            selectedName={form.countryName}
          />
        </ProfileSetupLayout>
      );
    case 5:
      return (
        <ProfileSetupLayout
          {...shared}
          description="We’ll show churches near you."
          icon="map-marker-outline"
          nextDisabled={!form.cityId || !form.countryCode}
          title="Which city are you in?"
        >
          {form.countryCode ? (
            <CityAutocomplete
              countryCode={form.countryCode}
              countryName={form.countryName}
              key={form.countryCode}
              onSelect={(city) => {
                setError(null);
                setForm((current) => ({
                  ...current,
                  cityId: city?.id ?? null,
                  cityName: city?.name ?? null,
                  state: city?.regionName ?? null,
                }));
              }}
              selectedCity={selectedCity}
            />
          ) : (
            <Text accessibilityRole="alert" style={styles.inlineError}>
              Go back and select a country first.
            </Text>
          )}
        </ProfileSetupLayout>
      );
    case 6:
      return (
        <ProfileSetupLayout
          {...shared}
          description="We’ll remind you of what matters most."
          error={error ?? preferencesError}
          icon="bell-outline"
          nextDisabled={!form.notificationPreferences || Boolean(preferencesError)}
          title="Stay close to Jesus"
        >
          {isLoadingPreferences ? (
            <View accessibilityLabel="Loading notification preferences" style={styles.loadingPreferences}>
              <ActivityIndicator color={theme.colors.brand.primaryLight} />
              <Text style={styles.loadingCopy}>Loading your preferences…</Text>
            </View>
          ) : null}
          {preferencesError && !isLoadingPreferences ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setPreferenceLoadAttempt((attempt) => attempt + 1)}
              style={styles.retryButton}
            >
              <Text style={styles.retryLabel}>Try Again</Text>
            </Pressable>
          ) : null}
          {form.notificationPreferences ? (
            <View style={styles.preferenceList}>
              <NotificationPreferenceRow
                copy="Daily Rosary"
                label="Daily Rosary Reminder"
                onValueChange={(value) => updatePreference(setForm, "dailyRosaryReminder", value)}
                value={form.notificationPreferences.dailyRosaryReminder}
              />
              <NotificationPreferenceRow
                copy="Examination of conscience"
                label="Confession Reminder"
                onValueChange={(value) => updatePreference(setForm, "confessionReminder", value)}
                value={form.notificationPreferences.confessionReminder}
              />
              <NotificationPreferenceRow
                copy="Find time with Jesus"
                label="Eucharistic Adoration"
                onValueChange={(value) => updatePreference(setForm, "eucharisticAdoration", value)}
                value={form.notificationPreferences.eucharisticAdoration}
              />
            </View>
          ) : null}
        </ProfileSetupLayout>
      );
    case 7:
      return (
        <ProfileSetupLayout
          {...shared}
          description="Let’s grow in faith, compete in holiness, and change the world for Jesus!"
          error={error ?? preferencesError}
          icon="shield-cross"
          nextDisabled={!form.notificationPreferences || Boolean(preferencesError)}
          nextLabel="Enter the Mission"
          title="You’re all set!"
        >
          <View style={styles.missionCard}>
            <MaterialCommunityIcons color={theme.rosary.colors.goldBright} name="earth" size={theme.sizes.iconHero} />
            <Text style={styles.missionCopy}>Your profile is ready for the mission.</Text>
            {isLoadingPreferences ? <ActivityIndicator color={theme.colors.brand.primaryLight} /> : null}
            {preferencesError && !isLoadingPreferences ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => setPreferenceLoadAttempt((attempt) => attempt + 1)}
                style={styles.retryButton}
              >
                <Text style={styles.retryLabel}>Try Again</Text>
              </Pressable>
            ) : null}
          </View>
        </ProfileSetupLayout>
      );
  }
}

function ProfileSetupTextField({
  helper,
  label,
  ...props
}: React.ComponentProps<typeof TextInput> & { helper: string; label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput placeholderTextColor={theme.colors.text.subtle} style={styles.textInput} {...props} />
      <Text style={styles.helper}>{helper}</Text>
    </View>
  );
}

function UsernameFeedback({ result, status }: { result: UsernameValidation | null; status: UsernameStatus }) {
  const message =
    status === "checking"
      ? "Checking username…"
      : status === "available"
        ? "Username is available."
        : status === "unavailable"
          ? "Username is already taken."
          : status === "invalid"
            ? usernameReasonMessage(result?.reason ?? null)
            : status === "error"
              ? "We couldn't check this username. Try again."
              : null;
  if (!message) return null;
  const success = status === "available";
  return (
    <View accessibilityLiveRegion="polite" style={styles.usernameFeedback}>
      {status === "checking" ? (
        <ActivityIndicator color={theme.colors.brand.primaryLight} size="small" />
      ) : (
        <Feather
          color={success ? theme.colors.text.success : theme.colors.text.danger}
          name={success ? "check-circle" : "alert-circle"}
          size={theme.sizes.iconSmall}
        />
      )}
      <Text style={[styles.feedbackText, success ? styles.successText : styles.errorText]}>{message}</Text>
    </View>
  );
}

function GenderOption({
  icon,
  label,
  onPress,
  selected,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.genderOption, selected && styles.selectedGender, pressed && styles.pressed]}
    >
      <View style={styles.genderIcon}>
        <MaterialCommunityIcons
          color={selected ? theme.rosary.colors.goldBright : theme.colors.icon.secondary}
          name={icon}
          size={theme.sizes.iconLarge}
        />
      </View>
      <Text style={styles.genderLabel}>{label}</Text>
      <View style={[styles.radio, selected && styles.selectedRadio]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

function NotificationPreferenceRow({
  copy,
  label,
  onValueChange,
  value,
}: {
  copy: string;
  label: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
}) {
  return (
    <View style={styles.preferenceRow}>
      <View style={styles.preferenceCopy}>
        <Text style={styles.preferenceTitle}>{label}</Text>
        <Text style={styles.preferenceDescription}>{copy}</Text>
      </View>
      <Switch
        accessibilityLabel={label}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        onValueChange={onValueChange}
        thumbColor={theme.colors.text.white}
        trackColor={{ false: theme.colors.semantic.disabled, true: theme.colors.brand.primary }}
        value={value}
      />
    </View>
  );
}

function updatePreference(
  setForm: React.Dispatch<React.SetStateAction<ProfileSetupState>>,
  key: keyof NotificationPreferences,
  value: boolean,
) {
  setForm((current) =>
    current.notificationPreferences
      ? { ...current, notificationPreferences: { ...current.notificationPreferences, [key]: value } }
      : current,
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.interactive,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    minHeight: theme.sizes.touchTarget,
    justifyContent: "center",
    paddingHorizontal: theme.spacing[3],
  },
  chipLabel: { ...theme.typography.labelSmall, color: theme.colors.text.secondary },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2] },
  errorText: { color: theme.colors.text.danger },
  feedbackText: { ...theme.typography.bodySmall, flex: 1 },
  field: { gap: theme.spacing[1.5] },
  fieldLabel: { ...theme.typography.label, color: theme.colors.text.secondary },
  genderIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.background.deep,
    borderRadius: theme.radii.pill,
    height: theme.spacing[12],
    justifyContent: "center",
    width: theme.spacing[12],
  },
  genderLabel: { ...theme.typography.heading3, color: theme.colors.text.primary, flex: 1 },
  genderOption: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.navyDeep,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    gap: theme.spacing[4],
    minHeight: 88,
    padding: theme.spacing[4],
  },
  genderOptions: { gap: theme.spacing[3] },
  helper: { ...theme.typography.caption, color: theme.colors.text.muted },
  inlineError: { ...theme.typography.body, color: theme.colors.text.danger, textAlign: "center" },
  loadingCopy: { ...theme.typography.bodySmall, color: theme.colors.text.muted },
  loadingPreferences: { alignItems: "center", gap: theme.spacing[3], paddingVertical: theme.spacing[6] },
  missionCard: {
    alignItems: "center",
    backgroundColor: "rgba(230, 186, 100, 0.08)",
    borderColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    gap: theme.spacing[3],
    padding: theme.spacing[6],
  },
  missionCopy: { ...theme.typography.bodyMedium, color: theme.colors.text.secondary, textAlign: "center" },
  preferenceCopy: { flex: 1, minWidth: 0 },
  preferenceDescription: { ...theme.typography.caption, color: theme.colors.text.muted, marginTop: theme.spacing[0.5] },
  preferenceList: {
    backgroundColor: theme.colors.surface.navyDeep,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    overflow: "hidden",
  },
  preferenceRow: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    gap: theme.spacing[3],
    minHeight: 76,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  preferenceTitle: { ...theme.typography.bodyMedium, color: theme.colors.text.primary },
  pressed: { opacity: theme.opacity.pressed },
  radio: {
    alignItems: "center",
    borderColor: theme.colors.border.interactive,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.spacing[5],
    justifyContent: "center",
    width: theme.spacing[5],
  },
  radioDot: {
    backgroundColor: theme.rosary.colors.goldBright,
    borderRadius: theme.radii.pill,
    height: theme.spacing[2.5],
    width: theme.spacing[2.5],
  },
  retryButton: { alignItems: "center", minHeight: theme.sizes.touchTarget, justifyContent: "center" },
  retryLabel: { ...theme.typography.bodyMedium, color: theme.colors.text.link },
  selectedGender: { backgroundColor: theme.colors.surface.green, borderColor: theme.rosary.colors.gold },
  selectedRadio: { borderColor: theme.rosary.colors.goldBright },
  successText: { color: theme.colors.text.success },
  suggestions: { gap: theme.spacing[2] },
  suggestionsTitle: { ...theme.typography.labelSmall, color: theme.colors.text.muted, textTransform: "uppercase" },
  textInput: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface.navyDeep,
    borderColor: theme.colors.border.interactive,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    color: theme.colors.text.primary,
    minHeight: theme.sizes.inputHeightLarge,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  usernameFeedback: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2] },
});
