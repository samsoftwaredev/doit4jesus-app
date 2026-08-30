import { validateFullName } from "./name-validation";

describe("validateFullName", () => {
  it("accepts a first and last name and normalizes extra whitespace", () => {
    expect(validateFullName("  María   O'Brien  ")).toEqual({ normalizedName: "María O'Brien", valid: true });
  });

  it.each([
    ["", "Enter your first and last name."],
    ["John", "Enter both your first and last name, separated by a space."],
    ["John 3 Doe", "Your name cannot contain numbers."],
    ["John Paul Doe", "Enter one first name and one last name, separated by a space."],
    ["John @Doe", "Use letters only. Hyphens and apostrophes are allowed."],
  ])("explains why %p is invalid", (name, message) => {
    expect(validateFullName(name)).toEqual({ message, valid: false });
  });
});
