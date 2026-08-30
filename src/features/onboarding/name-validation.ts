const namePartPattern = String.raw`\p{L}+(?:[’'-]\p{L}+)*`;
const fullNamePattern = new RegExp(String.raw`^${namePartPattern}\s+${namePartPattern}$`, "u");

export type FullNameValidation = { normalizedName: string; valid: true } | { message: string; valid: false };

export function validateFullName(value: string): FullNameValidation {
  const trimmedName = value.trim();

  if (!trimmedName) {
    return { message: "Enter your first and last name.", valid: false };
  }

  if (trimmedName.length > 80) {
    return { message: "Your name must be 80 characters or fewer.", valid: false };
  }

  if (/\d/u.test(trimmedName)) {
    return { message: "Your name cannot contain numbers.", valid: false };
  }

  if (!/\s/u.test(trimmedName)) {
    return { message: "Enter both your first and last name, separated by a space.", valid: false };
  }

  if (trimmedName.split(/\s+/u).length !== 2) {
    return { message: "Enter one first name and one last name, separated by a space.", valid: false };
  }

  if (!fullNamePattern.test(trimmedName)) {
    return { message: "Use letters only. Hyphens and apostrophes are allowed.", valid: false };
  }

  return { normalizedName: trimmedName.replace(/\s+/gu, " "), valid: true };
}
