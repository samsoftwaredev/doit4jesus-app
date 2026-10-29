import { getProfileAccessState } from "./profile-access";
import type { CurrentUserProfile } from "./profile.types";

const profile = {
  legalAcceptance: { required: false },
  profileSetup: { complete: false },
} as CurrentUserProfile;

describe("authenticated profile access", () => {
  it("blocks protected routes while the profile is loading", () => {
    expect(getProfileAccessState({ error: null, isLoading: true, profile: null })).toBe("loading");
  });

  it("routes incomplete profiles exclusively to onboarding", () => {
    expect(getProfileAccessState({ error: null, isLoading: false, profile })).toBe("onboarding");
  });

  it("routes a new account to legal acceptance before onboarding", () => {
    expect(
      getProfileAccessState({
        error: null,
        isLoading: false,
        profile: { ...profile, legalAcceptance: { ...profile.legalAcceptance, required: true } },
      }),
    ).toBe("legal");
  });

  it("allows the application only for server-complete profiles", () => {
    expect(
      getProfileAccessState({
        error: null,
        isLoading: false,
        profile: { ...profile, profileSetup: { ...profile.profileSetup, complete: true } },
      }),
    ).toBe("complete");
  });

  it("keeps the app protected when profile loading fails", () => {
    expect(getProfileAccessState({ error: "offline", isLoading: false, profile: null })).toBe("error");
  });
});
