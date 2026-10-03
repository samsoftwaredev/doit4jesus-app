const commonPasswordPhrases = ["password", "qwerty", "letmein", "welcome", "admin"];

/**
 * Returns whether a password contains a plainly predictable phrase or a repeated,
 * ascending, or descending run of four characters. This is client-side guidance;
 * the authentication service remains the authority for its configured policy.
 */
export function isWeakPassword(value: string): boolean {
  const normalizedValue = value.toLowerCase();

  if (commonPasswordPhrases.some((phrase) => normalizedValue.includes(phrase))) return true;

  let ascendingRun = 1;
  let descendingRun = 1;
  let repeatedRun = 1;

  for (let index = 1; index < normalizedValue.length; index += 1) {
    const previousCharacter = normalizedValue[index - 1];
    const character = normalizedValue[index];
    const characterDifference = character.charCodeAt(0) - previousCharacter.charCodeAt(0);
    const canFormSequence = areCharactersInSameSequenceGroup(previousCharacter, character);

    ascendingRun = canFormSequence && characterDifference === 1 ? ascendingRun + 1 : 1;
    descendingRun = canFormSequence && characterDifference === -1 ? descendingRun + 1 : 1;
    repeatedRun = characterDifference === 0 ? repeatedRun + 1 : 1;

    if (ascendingRun >= 4 || descendingRun >= 4 || repeatedRun >= 4) return true;
  }

  return false;
}

/** Returns whether both characters belong to the same ASCII letter or digit sequence. */
function areCharactersInSameSequenceGroup(previousCharacter: string, character: string): boolean {
  return (
    (isAsciiDigit(previousCharacter) && isAsciiDigit(character)) ||
    (isAsciiLetter(previousCharacter) && isAsciiLetter(character))
  );
}

/** Returns whether a single character is an ASCII decimal digit. */
function isAsciiDigit(value: string): boolean {
  return value >= "0" && value <= "9";
}

/** Returns whether a single character is an ASCII lowercase letter. */
function isAsciiLetter(value: string): boolean {
  return value >= "a" && value <= "z";
}
