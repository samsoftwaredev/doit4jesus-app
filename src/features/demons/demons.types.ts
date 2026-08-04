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
