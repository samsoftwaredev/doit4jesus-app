import type { XPLevelConfig } from '@/interfaces/spiritualXp';

type LevelsApiResponse = {
  levels: Array<{
    level: number;
    title: string;
    min_xp: number;
    badge_key: string | null;
  }>;
};

export const fetchLevelsConfig = async (): Promise<XPLevelConfig[]> => {
  const response = await fetch('/api/xp/levels');
  if (!response.ok) {
    throw new Error(`Failed to fetch levels: ${response.status}`);
  }

  const body = (await response.json()) as LevelsApiResponse;
  const rows = body.levels ?? [];

  return rows.map((row) => ({
    level: row.level,
    title: row.title,
    minXp: row.min_xp,
    badgeKey: row.badge_key,
  }));
};
