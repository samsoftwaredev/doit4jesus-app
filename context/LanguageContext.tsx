import enJSON from 'locales/en.json';
import esJSON from 'locales/es.json';
import {
  type JSX,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { LANG } from '@/interfaces';

const STORAGE_KEY = 'language';

interface LanguageContext {
  /** Unique id of the item */
  t: typeof enJSON | typeof esJSON;
  lang: LANG;
  changeLang: Function;
  setLang: (lang: LANG) => void;
}

interface Props {
  children: JSX.Element | JSX.Element[];
  type?: LANG;
}

const LanguageContext = createContext<LanguageContext | undefined>(undefined);

const LanguageContextProvider = ({ children }: Props) => {
  const [lang, setLangState] = useState<LANG>(LANG.es);
  const t = lang === LANG.en ? enJSON : esJSON;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LANG | null;
      if (stored === LANG.en || stored === LANG.es) {
        setLangState(stored);
      }
    } catch {
      // localStorage unavailable (SSR / privacy mode)
    }
  }, []);

  const setLang = (newLang: LANG) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // localStorage unavailable
    }
  };

  const changeLang = () => {
    const newLang = lang === LANG.en ? LANG.es : LANG.en;
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider
      value={{
        t,
        lang,
        changeLang,
        setLang,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a ContextProvider');
  }
  return context;
};

export { LanguageContextProvider, useLanguageContext };
