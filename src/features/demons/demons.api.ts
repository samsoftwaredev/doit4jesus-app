import type { DemonCatalogItem, DemonVirtueAffinity } from "./demons.types";

const demonCatalogUrl = process.env.EXPO_PUBLIC_API_URL + "/api/v1/demons";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new Error(`The demons catalog returned an invalid ${field}.`);
  }

  return value;
}

function readNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`The demons catalog returned an invalid ${field}.`);
  }

  return value;
}

function parseVirtueAffinities(
  value: unknown,
): ReadonlyArray<DemonVirtueAffinity> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((affinity) => {
    if (!isRecord(affinity)) {
      throw new Error(
        "The demons catalog returned an invalid virtue affinity.",
      );
    }

    return {
      affinityType: readString(affinity.affinity_type, "virtue affinity type"),
      virtueCode: readString(affinity.virtue_code, "virtue affinity code"),
    };
  });
}

function parseDemonCatalog(value: unknown): ReadonlyArray<DemonCatalogItem> {
  if (!isRecord(value) || !Array.isArray(value.data)) {
    throw new Error("The demons catalog returned an unexpected response.");
  }

  return value.data.map((entry) => {
    if (!isRecord(entry) || !isRecord(entry.demon)) {
      throw new Error("The demons catalog returned an invalid demon.");
    }

    const demon = entry.demon;

    return {
      category: readString(demon.category, "demon category"),
      description: readString(demon.description, "demon description"),
      id: readString(demon.id, "demon ID"),
      maxHp: readNumber(demon.max_hp, "demon max HP"),
      name: readString(demon.name, "demon name"),
      title: readString(demon.title, "demon title"),
      virtueAffinities: parseVirtueAffinities(entry.virtueAffinities),
    };
  });
}

export async function fetchDemonCatalog(): Promise<
  ReadonlyArray<DemonCatalogItem>
> {
  const accessToken = process.env.EXPO_PUBLIC_DEMONS_CATALOG_TOKEN;

  if (!accessToken) {
    throw new Error(
      "Set EXPO_PUBLIC_DEMONS_CATALOG_TOKEN before loading the demons catalog.",
    );
  }

  const response = await fetch(demonCatalogUrl, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "GET",
  });
  const payload: unknown = await response.json();

  if (!response.ok) {
    throw new Error(`Unable to load the demons catalog (${response.status}).`);
  }

  return parseDemonCatalog(payload);
}
