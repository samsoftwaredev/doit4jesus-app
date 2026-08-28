import { getResumeStep, onboardingStepMap } from "./onboarding.types";

describe("onboarding step mapping", () => {
  it("centralizes every server field alias", () => {
    expect(onboardingStepMap).toMatchObject({
      city: 5,
      cityId: 5,
      country: 4,
      countryCode: 4,
      displayName: 1,
      gender: 3,
      name: 1,
      notifications: 6,
      username: 2,
    });
  });

  it("uses nextStep before missing fields and resumes at City", () => {
    expect(
      getResumeStep({ complete: false, completedAt: null, missingFields: ["displayName"], nextStep: "city" }),
    ).toBe(5);
  });

  it("recognizes the backend's name alias for the first onboarding screen", () => {
    expect(getResumeStep({ complete: false, completedAt: null, missingFields: ["city"], nextStep: "name" })).toBe(1);
  });

  it("uses the first missing field and treats no missing fields as All Set", () => {
    expect(getResumeStep({ complete: false, completedAt: null, missingFields: ["countryCode"], nextStep: null })).toBe(
      4,
    );
    expect(getResumeStep({ complete: false, completedAt: null, missingFields: [], nextStep: null })).toBe(7);
  });
});
