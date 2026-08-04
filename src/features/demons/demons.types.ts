export type DemonAffinityType = "primary" | "secondary" | string;

export interface DemonVirtueAffinity {
  affinityType: DemonAffinityType;
  virtueCode: string;
}

export interface DemonCatalogItem {
  category: string;
  code: string;
  description: string;
  id: string;
  maxHp: number;
  name: string;
  title: string;
  virtueAffinities: ReadonlyArray<DemonVirtueAffinity>;
}

export interface DemonBattleDemon extends DemonCatalogItem {
  safetyNote: string | null;
  sillyPersonality: string;
}

export interface DemonAttack {
  code: string;
  description: string;
  name: string;
  targetVirtueCode: string;
  virtueDecrease: number;
}

export interface DemonDefense {
  challenge: string;
  code: string;
  demonDamage: number;
  name: string;
  rewardVirtueCode: string;
  virtueIncrease: number;
}

export interface DemonDefeatReward {
  virtueCode: string;
  virtueIncrease: number;
  xpReward: number;
}

export interface DemonBattleDetails {
  attacks: ReadonlyArray<DemonAttack>;
  defeatReward: DemonDefeatReward;
  defenses: ReadonlyArray<DemonDefense>;
  demon: DemonBattleDemon;
}
