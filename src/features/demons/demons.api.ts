import type {
  DemonAttack,
  DemonBattleDetails,
  DemonBattleDemon,
  DemonCatalogItem,
  DemonDefeatReward,
  DemonDefense,
  DemonVirtueAffinity,
} from "./demons.types";

const demonApiPath = "/api/v1/demons";

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

function readNullableString(value: unknown, field: string): string | null {
  if (value === null) {
    return null;
  }

  return readString(value, field);
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

function parseDemonCatalogItem(
  demon: Record<string, unknown>,
  virtueAffinities: unknown,
): DemonCatalogItem {
  return {
    category: readString(demon.category, "demon category"),
    code: readString(demon.code, "demon code"),
    description: readString(demon.description, "demon description"),
    id: readString(demon.id, "demon ID"),
    maxHp: readNumber(demon.max_hp, "demon max HP"),
    name: readString(demon.name, "demon name"),
    title: readString(demon.title, "demon title"),
    virtueAffinities: parseVirtueAffinities(virtueAffinities),
  };
}

function parseDemonCatalog(value: unknown): ReadonlyArray<DemonCatalogItem> {
  if (!isRecord(value) || !Array.isArray(value.data)) {
    throw new Error("The demons catalog returned an unexpected response.");
  }

  return value.data.map((entry) => {
    if (!isRecord(entry) || !isRecord(entry.demon)) {
      throw new Error("The demons catalog returned an invalid demon.");
    }

    return parseDemonCatalogItem(entry.demon, entry.virtueAffinities);
  });
}

function parseAttacks(value: unknown): ReadonlyArray<DemonAttack> {
  if (!Array.isArray(value)) {
    throw new Error("The demon returned invalid attacks.");
  }

  return value.map((attack) => {
    if (!isRecord(attack)) {
      throw new Error("The demon returned an invalid attack.");
    }

    return {
      code: readString(attack.code, "attack code"),
      description: readString(attack.description, "attack description"),
      name: readString(attack.name, "attack name"),
      targetVirtueCode: readString(
        attack.target_virtue_code,
        "attack target virtue code",
      ),
      virtueDecrease: readNumber(
        attack.virtue_decrease,
        "attack virtue decrease",
      ),
    };
  });
}

function parseDefenses(value: unknown): ReadonlyArray<DemonDefense> {
  if (!Array.isArray(value)) {
    throw new Error("The demon returned invalid defenses.");
  }

  return value.map((defense) => {
    if (!isRecord(defense)) {
      throw new Error("The demon returned an invalid defense.");
    }

    return {
      challenge: readString(defense.challenge, "defense challenge"),
      code: readString(defense.code, "defense code"),
      demonDamage: readNumber(defense.demon_damage, "defense demon damage"),
      name: readString(defense.name, "defense name"),
      rewardVirtueCode: readString(
        defense.reward_virtue_code,
        "defense reward virtue code",
      ),
      virtueIncrease: readNumber(
        defense.virtue_increase,
        "defense virtue increase",
      ),
    };
  });
}

function parseDefeatReward(value: unknown): DemonDefeatReward {
  if (!isRecord(value)) {
    throw new Error("The demon returned an invalid defeat reward.");
  }

  return {
    virtueCode: readString(value.virtue_code, "reward virtue code"),
    virtueIncrease: readNumber(value.virtue_increase, "reward virtue increase"),
    xpReward: readNumber(value.xp_reward, "reward XP"),
  };
}

function parseDemonBattleDetails(value: unknown): DemonBattleDetails {
  if (!isRecord(value) || !isRecord(value.data)) {
    throw new Error("The demon returned an unexpected battle response.");
  }

  const data = value.data;
  const demonResponse = data.demon;

  if (!isRecord(demonResponse)) {
    throw new Error("The demon returned an invalid battle demon.");
  }

  const baseDemon = parseDemonCatalogItem(
    demonResponse,
    data.virtueAffinities,
  );
  const demon: DemonBattleDemon = {
    ...baseDemon,
    safetyNote: readNullableString(demonResponse.safety_note, "demon safety note"),
    sillyPersonality: readString(
      demonResponse.silly_personality,
      "demon personality",
    ),
  };

  return {
    attacks: parseAttacks(data.attacks),
    defeatReward: parseDefeatReward(data.defeatReward),
    defenses: parseDefenses(data.defenses),
    demon,
  };
}

function getDemonApiUrl(demonCode?: string): string {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("Set EXPO_PUBLIC_API_URL before loading demons.");
  }

  const catalogUrl = `${apiUrl}${demonApiPath}`;

  return demonCode ? `${catalogUrl}/${encodeURIComponent(demonCode)}` : catalogUrl;
}

async function fetchDemonPayload(url: string): Promise<unknown> {
  const accessToken = process.env.EXPO_PUBLIC_DEMONS_CATALOG_TOKEN;

  if (!accessToken) {
    throw new Error(
      "Set EXPO_PUBLIC_DEMONS_CATALOG_TOKEN before loading demons.",
    );
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Unable to load demon data (${response.status}).`);
  }

  return response.json() as Promise<unknown>;
}

export async function fetchDemonCatalog(): Promise<
  ReadonlyArray<DemonCatalogItem>
> {
  const payload = await fetchDemonPayload(getDemonApiUrl());

  return parseDemonCatalog(payload);
}

export async function fetchDemonBattleDetails(
  demonCode: string,
): Promise<DemonBattleDetails> {
  const payload = await fetchDemonPayload(getDemonApiUrl(demonCode));

  return parseDemonBattleDetails(payload);
}
