import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import type { TFunction } from "i18next";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, BackHandler, Pressable, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

import { LanguageSelector } from "@/components";
import { useAchievement } from "@/features/achievements";
import { useCurrentProfile } from "@/features/profile";
import { ProfileApiError, updateCurrentUserProfile } from "@/features/profile/profile.api";
import type { CurrentUserProfile, UpdateCurrentUserProfile } from "@/features/profile/profile.types";
import { logDevelopmentError } from "@/lib/development-logger";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { CountrySelector } from "./CountrySelector";
import { validateFullName } from "./name-validation";
import { completeLanguageOnboarding, hasCompletedLanguageOnboarding } from "./onboarding-language";
import { completeOnboarding, OnboardingApiError, validateUsername } from "./onboarding.api";
import type { OnboardingStep, ProfileSetupState, UsernameValidation } from "./onboarding.types";
import { getResumeStep } from "./onboarding.types";
import { ProfileSetupLayout } from "./ProfileSetupLayout";

type UsernameStatus = "available" | "checking" | "idle" | "invalid" | "unavailable" | "error";
type OnboardingFlowStep = "language" | OnboardingStep;

/** Projects persisted profile fields into the editable onboarding form without reminder preferences. */
function stateFromProfile(profile: CurrentUserProfile): ProfileSetupState {
  return {
    countryCode: profile.countryCode,
    countryName: profile.countryName,
    displayName: profile.displayName ?? "",
    gender: profile.gender,
    username: profile.username ?? "",
  };
}

/** Converts backend username validation reasons into localized guidance. */
function usernameReasonMessage(t: TFunction, reason: string | null) {
  switch (reason) {
    case "INVALID_LENGTH":
      return t("onboarding.username.invalidLength");
    case "INVALID_CHARACTERS":
      return t("onboarding.username.invalidCharacters");
    case "PROHIBITED_TERM":
      return t("onboarding.username.prohibited");
    case "USERNAME_TAKEN":
      return t("onboarding.username.taken");
    default:
      return t("onboarding.username.invalidDefault");
  }
}

/** Localizes the stable English validation messages returned by the name validator. */
function translatedNameValidationMessage(t: TFunction, message: string): string {
  switch (message) {
    case "Enter your first and last name.":
      return t("onboarding.name.validation.empty");
    case "Your name must be 80 characters or fewer.":
      return t("onboarding.name.validation.length");
    case "Your name cannot contain numbers.":
      return t("onboarding.name.validation.numbers");
    case "Enter both your first and last name, separated by a space.":
      return t("onboarding.name.validation.space");
    case "Enter one first name and one last name, separated by a space.":
      return t("onboarding.name.validation.parts");
    default:
      return t("onboarding.name.validation.characters");
  }
}

/** Renders this feature with colors from the currently resolved app appearance. */
export function ProfileSetupScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const router = useRouter();
  const { language, setLanguage } = useAppLanguage();
  const { profile, replaceProfile } = useCurrentProfile();
  const { queueAchievement } = useAchievement();
  const completionInFlightRef = useRef(false);
  const languageHydratedUserRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isLoadingLanguageStep, setIsLoadingLanguageStep] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState<OnboardingFlowStep>("language");
  const [usernameResult, setUsernameResult] = useState<UsernameValidation | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [usernameValidationAttempt, setUsernameValidationAttempt] = useState(0);
  const [form, setForm] = useState<ProfileSetupState>(() =>
    profile
      ? stateFromProfile(profile)
      : {
          countryCode: null,
          countryName: null,
          displayName: "",
          gender: null,
          username: "",
        },
  );

  useEffect(() => {
    if (!profile || languageHydratedUserRef.current === profile.userId) return;
    let active = true;
    const userId = profile.userId;
    const resumeStep = getResumeStep(profile.profileSetup);
    setIsLoadingLanguageStep(true);

    void hasCompletedLanguageOnboarding(userId).then((completed) => {
      if (!active) return;
      languageHydratedUserRef.current = userId;
      setStep(completed ? resumeStep : "language");
      setIsLoadingLanguageStep(false);
    });

    return () => {
      active = false;
    };
  }, [profile]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (step !== "language" && step > 1) {
        setError(null);
        setStep((current) => (current === "language" ? current : (Math.max(1, current - 1) as OnboardingStep)));
      } else if (step === 1) {
        setError(null);
        setStep("language");
      }
      return true;
    });
    return () => subscription.remove();
  }, [step]);

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
          logDevelopmentError("validating an onboarding username", requestError);
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

  if (!profile || isLoadingLanguageStep) return null;

  const nameValidation = validateFullName(form.displayName);
  const showNameValidation = Boolean(form.displayName.trim()) && !nameValidation.valid;
  const nameValidationMessage = nameValidation.valid
    ? undefined
    : translatedNameValidationMessage(t, nameValidation.message);

  /** Applies a saved profile to both the global cache and the editable onboarding form. */
  const syncProfile = (updatedProfile: CurrentUserProfile) => {
    replaceProfile(updatedProfile);
    setForm((current) => ({
      ...current,
      countryCode: updatedProfile.countryCode,
      countryName: updatedProfile.countryName,
      displayName: updatedProfile.displayName ?? "",
      gender: updatedProfile.gender,
      username: updatedProfile.username ?? "",
    }));
  };

  /** Advances to the next editable onboarding step after clearing any prior error. */
  const advance = (nextStep: OnboardingStep) => {
    setError(null);
    setStep(nextStep);
  };

  /** Saves one editable profile field and advances only after the server accepts it. */
  const saveProfile = async (
    update: UpdateCurrentUserProfile,
    nextStep: OnboardingStep,
    options: { username?: boolean } = {},
  ) => {
    setError(null);
    setIsSaving(true);
    try {
      const updatedProfile = await updateCurrentUserProfile(update);
      syncProfile(updatedProfile);
      advance(nextStep);
    } catch (requestError) {
      logDevelopmentError("saving an onboarding profile step", requestError);
      if (options.username && requestError instanceof ProfileApiError && requestError.status === 409) {
        setError(t("onboarding.errors.usernameConflict"));
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
        setError(t("onboarding.errors.usernameRejected"));
      } else {
        setError(t("onboarding.errors.profileSave"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  /** Validates and persists the current step, completing onboarding from the final country step. */
  const next = async () => {
    if (isSaving || isCompleting) return;

    switch (step) {
      case "language":
        await completeLanguageOnboarding(profile.userId);
        advance(getResumeStep(profile.profileSetup));
        return;
      case 1: {
        if (!nameValidation.valid) {
          setError(translatedNameValidationMessage(t, nameValidation.message));
          return;
        }
        const displayName = nameValidation.normalizedName;
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
          setError(t("onboarding.username.required"));
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
          setError(t("onboarding.gender.required"));
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
          setError(t("onboarding.country.required"));
          return;
        }
        if (form.countryCode === profile.countryCode) {
          await enterMission();
          return;
        }
        setError(null);
        setIsSaving(true);
        try {
          const updatedProfile = await updateCurrentUserProfile({ countryCode: form.countryCode });
          syncProfile(updatedProfile);
          await enterMission({ ...form, countryCode: updatedProfile.countryCode ?? form.countryCode });
        } catch (requestError) {
          logDevelopmentError("saving the onboarding profile", requestError);
          if (!completionInFlightRef.current) {
            setError(requestError instanceof Error ? requestError.message : t("onboarding.errors.profileSave"));
          }
        } finally {
          setIsSaving(false);
        }
        return;
      }
    }
  };

  /** Completes the reduced onboarding contract and queues the Home celebration exactly once. */
  const enterMission = async (completionForm: ProfileSetupState = form) => {
    if (completionInFlightRef.current) return;
    const finalNameValidation = validateFullName(completionForm.displayName);
    const username = completionForm.username.trim();
    if (!finalNameValidation.valid) {
      setError(translatedNameValidationMessage(t, finalNameValidation.message));
      return;
    }
    const displayName = finalNameValidation.normalizedName;
    if (!username || !completionForm.gender || !completionForm.countryCode) {
      setError(t("onboarding.errors.review"));
      return;
    }

    completionInFlightRef.current = true;
    setError(null);
    setIsCompleting(true);
    try {
      const result = await completeOnboarding({
        countryCode: completionForm.countryCode,
        displayName,
        gender: completionForm.gender,
        username,
      });
      replaceProfile(result.profile);
      setForm(stateFromProfile(result.profile));

      if (!result.profile.profileSetup.complete) {
        setError(t("onboarding.errors.incomplete"));
        return;
      }
      queueAchievement({ type: "onboarding-complete" });
      router.replace("/");
    } catch (error) {
      logDevelopmentError("completing onboarding", error);
      setError(t("onboarding.errors.completion"));
    } finally {
      completionInFlightRef.current = false;
      setIsCompleting(false);
    }
  };

  /** Returns to the preceding onboarding step while preserving the current form values. */
  const goBack = () => {
    setError(null);
    setStep((current) => {
      if (current === "language") return current;
      if (current === 1) return "language";
      return (current - 1) as OnboardingStep;
    });
  };

  const shared = {
    error,
    nextLoading: isSaving || isCompleting,
    onBack: step === "language" ? undefined : goBack,
    onNext: () => void next(),
    step: step === "language" ? 1 : step + 1,
  };

  switch (step) {
    case "language":
      return (
        <ProfileSetupLayout
          {...shared}
          description={t("language.description")}
          icon="translate"
          nextLabel={t("common.continue")}
          title={t("language.title")}
        >
          <LanguageSelector language={language} onChange={(nextLanguage) => void setLanguage(nextLanguage)} />
        </ProfileSetupLayout>
      );
    case 1:
      return (
        <ProfileSetupLayout
          {...shared}
          description={t("onboarding.name.description")}
          icon="account-outline"
          nextDisabled={!nameValidation.valid}
          title={t("onboarding.name.title")}
        >
          <ProfileSetupTextField
            accessibilityLabel={t("onboarding.name.accessibilityLabel")}
            autoCapitalize="words"
            helper={t("onboarding.name.helper")}
            invalid={showNameValidation}
            label={t("onboarding.name.label")}
            maxLength={80}
            onChangeText={(displayName) => {
              setError(null);
              setForm((current) => ({ ...current, displayName }));
            }}
            placeholder={t("onboarding.name.placeholder")}
            validationMessage={showNameValidation ? nameValidationMessage : undefined}
            value={form.displayName}
          />
        </ProfileSetupLayout>
      );
    case 2:
      return (
        <ProfileSetupLayout
          {...shared}
          description={t("onboarding.username.description")}
          icon="account-search-outline"
          nextDisabled={form.username.trim() !== profile.username && usernameStatus !== "available"}
          title={t("onboarding.username.title")}
        >
          <ProfileSetupTextField
            accessibilityLabel={t("onboarding.username.accessibilityLabel")}
            autoCapitalize="none"
            autoCorrect={false}
            helper={t("onboarding.username.helper")}
            label={t("onboarding.username.label")}
            onChangeText={(username) => {
              setError(null);
              setUsernameResult(null);
              setUsernameStatus("idle");
              setForm((current) => ({ ...current, username }));
            }}
            placeholder={t("onboarding.username.label")}
            value={form.username}
          />
          <UsernameFeedback result={usernameResult} status={usernameStatus} />
          {usernameResult?.suggestions.length ? (
            <View style={styles.suggestions}>
              <Text style={styles.suggestionsTitle}>{t("onboarding.username.suggestions")}</Text>
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
          description={t("onboarding.gender.description")}
          icon="shield-crown-outline"
          nextDisabled={!form.gender}
          title={t("onboarding.gender.title")}
        >
          <View accessibilityRole="radiogroup" style={styles.genderOptions}>
            <GenderOption
              icon="shield-sword-outline"
              label={t("onboarding.gender.knight")}
              onPress={() => {
                setError(null);
                setForm((current) => ({ ...current, gender: "male" }));
              }}
              selected={form.gender === "male"}
            />
            <GenderOption
              icon="crown-outline"
              label={t("onboarding.gender.princess")}
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
          description={t("onboarding.country.description")}
          icon="earth"
          nextDisabled={!form.countryCode}
          title={t("onboarding.country.title")}
        >
          <CountrySelector
            onSelect={(country) => {
              setError(null);
              setForm((current) => ({
                ...current,
                countryCode: country.code,
                countryName: country.name,
              }));
            }}
            selectedCode={form.countryCode}
            selectedName={form.countryName}
          />
        </ProfileSetupLayout>
      );
  }
}

/** Renders ProfileSetupTextField with styles resolved from the active appearance. */
function ProfileSetupTextField({
  helper,
  invalid = false,
  label,
  validationMessage,
  ...props
}: React.ComponentProps<typeof TextInput> & {
  helper: string;
  invalid?: boolean;
  label: string;
  validationMessage?: string;
}) {
  const styles = useThemedStyles(styleSheet);
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor={theme.colors.text.subtle}
        style={[styles.textInput, invalid && styles.textInputInvalid]}
        {...props}
      />
      <Text style={styles.helper}>{helper}</Text>
      {validationMessage ? (
        <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.fieldValidationMessage}>
          {validationMessage}
        </Text>
      ) : null}
    </View>
  );
}

/** Renders UsernameFeedback with styles resolved from the active appearance. */
function UsernameFeedback({ result, status }: { result: UsernameValidation | null; status: UsernameStatus }) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const message =
    status === "checking"
      ? t("onboarding.username.checking")
      : status === "available"
        ? t("onboarding.username.available")
        : status === "unavailable"
          ? t("onboarding.username.taken")
          : status === "invalid"
            ? usernameReasonMessage(t, result?.reason ?? null)
            : status === "error"
              ? t("onboarding.username.error")
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

/** Renders GenderOption with styles resolved from the active appearance. */
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
  const styles = useThemedStyles(styleSheet);
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

const styleSheet = createThemedStyles((theme) => ({
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
  fieldValidationMessage: { ...theme.typography.bodySmall, color: theme.colors.text.danger },
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
  textInputInvalid: { borderColor: theme.colors.semantic.danger },
  usernameFeedback: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2] },
}));
