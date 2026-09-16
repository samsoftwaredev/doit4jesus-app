import { resources } from "@/localization/resources";

type TranslationNode = string | { readonly [key: string]: TranslationNode };

/** Returns every leaf key in a translation tree using stable dot notation. */
function collectLeafKeys(node: TranslationNode, prefix = ""): string[] {
  if (typeof node === "string") return [prefix];
  return Object.entries(node).flatMap(([key, value]) => collectLeafKeys(value, prefix ? `${prefix}.${key}` : key));
}

/** Returns the interpolation variables used by an i18next message. */
function collectPlaceholders(message: string): string[] {
  return Array.from(message.matchAll(/{{\s*([^},\s]+)[^}]*}}/g), (match) => match[1]).sort();
}

/** Resolves a dot-notated leaf from a translation tree. */
function getLeaf(node: TranslationNode, path: string): string {
  const value = path.split(".").reduce<TranslationNode>((current, key) => {
    if (typeof current === "string") throw new Error(`Translation path ${path} ended before ${key}`);
    return current[key];
  }, node);

  if (typeof value !== "string") throw new Error(`Translation path ${path} is not a message`);
  return value;
}

describe("translation resources", () => {
  const english = resources.en.translation as TranslationNode;
  const spanish = resources.es.translation as TranslationNode;

  it("keeps English and Spanish translation keys in structural parity", () => {
    expect(collectLeafKeys(spanish).sort()).toEqual(collectLeafKeys(english).sort());
  });

  it("keeps interpolation variables aligned and every message non-empty", () => {
    for (const key of collectLeafKeys(english)) {
      const englishMessage = getLeaf(english, key);
      const spanishMessage = getLeaf(spanish, key);

      expect(englishMessage.trim()).not.toBe("");
      expect(spanishMessage.trim()).not.toBe("");
      expect(collectPlaceholders(spanishMessage)).toEqual(collectPlaceholders(englishMessage));
    }
  });
});
