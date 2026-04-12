import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'doit4jesus_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeContextProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const ThemeContextProvider = ({ children }: Props) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') {
      setMode(stored);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
