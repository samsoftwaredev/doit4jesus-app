import { getResumeStep, onboardingStepMap } from "./onboarding.types";

describe("onboarding step mapping", () => {
  it("centralizes every server field alias", () => {
    expect(onboardingStepMap).toMatchObject({
      country: 4,
      countryCode: 4,
      displayName: 1,
      gender: 3,
      name: 1,
      username: 2,
    });
    expect(onboardingStepMap).not.toHaveProperty("notifications");
  });

  it("uses nextStep before missing fields and resumes at the final country step", () => {
    expect(
      getResumeStep({ complete: false, completedAt: null, missingFields: ["displayName"], nextStep: "country" }),
    ).toBe(4);
  });

  it("recognizes the backend's name alias for the first onboarding screen", () => {
    expect(getResumeStep({ complete: false, completedAt: null, missingFields: ["country"], nextStep: "name" })).toBe(1);
  });

  it("uses the first missing field and treats no missing fields as the final country step", () => {
    expect(getResumeStep({ complete: false, completedAt: null, missingFields: ["countryCode"], nextStep: null })).toBe(
      4,
    );
    expect(getResumeStep({ complete: false, completedAt: null, missingFields: [], nextStep: null })).toBe(4);
  });
});
