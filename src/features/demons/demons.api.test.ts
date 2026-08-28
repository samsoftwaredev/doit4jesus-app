import { fetchDemonBattleDetails, fetchDemonCatalog } from "./demons.api";

jest.mock("@/lib/supabase", () => ({
  getSupabaseAccessToken: jest.fn(async () => "test-token"),
}));

const demon = {
  category: "temptation",
  code: "ACEDIA",
  description: "Draws the heart toward spiritual laziness.",
  id: "demon-1",
  max_hp: 100,
  name: "Acedia",
  title: "The Noonday Demon",
};

describe("demons API", () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.example.test";
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_API_URL;
  });

  it("loads the authenticated demon catalog", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({
        data: [
          {
            demon,
            virtueAffinities: [{ affinity_type: "primary", virtue_code: "DILIGENCE" }],
          },
        ],
      }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(fetchDemonCatalog()).resolves.toEqual([
      expect.objectContaining({
        code: "ACEDIA",
        virtueAffinities: [{ affinityType: "primary", virtueCode: "DILIGENCE" }],
      }),
    ]);
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.test/api/v1/demons", {
      headers: { Accept: "application/json", Authorization: "Bearer test-token" },
      method: "GET",
    });
  });

  it("loads battle details and maps all attack, defense, and reward fields", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({
        data: {
          attacks: [
            {
              code: "DISTRACT",
              description: "Distracts the mind.",
              name: "Distraction",
              target_virtue_code: "FOCUS",
              virtue_decrease: 2,
            },
          ],
          defeatReward: { virtue_code: "DILIGENCE", virtue_increase: 3, xp_reward: 25 },
          defenses: [
            {
              challenge: "Pray a decade.",
              code: "PRAY",
              demon_damage: 10,
              name: "Prayer",
              reward_virtue_code: "DILIGENCE",
              virtue_increase: 1,
            },
          ],
          demon: { ...demon, safety_note: null, silly_personality: "Grumbles about mornings." },
          virtueAffinities: [],
        },
      }),
      ok: true,
    })) as unknown as typeof fetch;

    await expect(fetchDemonBattleDetails("ACEDIA/1")).resolves.toMatchObject({
      attacks: [{ code: "DISTRACT", virtueDecrease: 2 }],
      defeatReward: { virtueCode: "DILIGENCE", xpReward: 25 },
      defenses: [{ code: "PRAY", demonDamage: 10 }],
      demon: { safetyNote: null, sillyPersonality: "Grumbles about mornings." },
    });
  });

  it("handles empty affinities and rejects malformed, unavailable, or failed responses", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ data: [{ demon, virtueAffinities: null }] }),
      ok: true,
    })) as unknown as typeof fetch;
    await expect(fetchDemonCatalog()).resolves.toEqual([expect.objectContaining({ virtueAffinities: [] })]);

    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ data: [{}] }),
      ok: true,
    })) as unknown as typeof fetch;
    await expect(fetchDemonCatalog()).rejects.toThrow("invalid demon");

    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 503 })) as unknown as typeof fetch;
    await expect(fetchDemonCatalog()).rejects.toThrow("503");

    delete process.env.EXPO_PUBLIC_API_URL;
    await expect(fetchDemonCatalog()).rejects.toThrow("Set EXPO_PUBLIC_API_URL");
  });
});
