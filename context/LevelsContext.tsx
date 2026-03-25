import {
  type JSX,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { type XPLevelConfig } from '@/interfaces/spiritualXp';
import { fetchLevelsConfig } from '@/services/levelsApi';
import { levelAssetsByBadgeKey } from '@/utils/levelAssets';
import {
  type CurrentLevel,
  type Level,
  getCurrentLevelFromList,
} from '@/utils/levels';

interface LevelsContextShape {
  levels: Level[];
  getCurrentLevel: (numRosaryCompleted: number) => CurrentLevel;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const LevelsContext = createContext<LevelsContextShape | undefined>(undefined);

const mergeDbLevelsWithAssets = (dbLevels: XPLevelConfig[]): Level[] => {
  const sorted = [...dbLevels].sort((a, b) => a.level - b.level);

  return sorted.map((row) => {
    const badgeKey = row.badgeKey ?? '';
    const assets = levelAssetsByBadgeKey[badgeKey] ?? {
      image: '',
      color: 'white',
    };

    return {
      image: assets.image,
      color: assets.color,
      label: row.title || `Level ${row.level}`,
      requirement: Number.isFinite(row.minXp) ? row.minXp : 0,
      value: badgeKey || `level_${row.level}`,
    };
  });
};

const LevelsProvider = ({ children }: Props) => {
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    let active = true;

    const loadLevels = async () => {
      try {
        const dbLevels = await fetchLevelsConfig();
        if (!active || dbLevels.length === 0) return;
        setLevels(mergeDbLevelsWithAssets(dbLevels));
      } catch (error) {
        console.error('LevelsContext: failed to load levels:', error);
      }
    };

    loadLevels();
    return () => {
      active = false;
    };
  }, []);

  const getCurrentLevel = useCallback(
    (numRosaryCompleted: number): CurrentLevel => {
      return getCurrentLevelFromList(levels, numRosaryCompleted);
    },
    [levels],
  );

  const value = useMemo(
    () => ({
      levels,
      getCurrentLevel,
    }),
    [levels, getCurrentLevel],
  );

  return (
    <LevelsContext.Provider value={value}>{children}</LevelsContext.Provider>
  );
};

const useLevelsContext = (): LevelsContextShape => {
  const context = useContext(LevelsContext);
  if (!context) {
    throw new Error('useLevelsContext must be used within a ContextProvider');
  }
  return context;
};

export { LevelsProvider, useLevelsContext };
