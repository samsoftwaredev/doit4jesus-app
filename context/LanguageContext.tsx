import enJSON from 'locales/en.json';
import esJSON from 'locales/es.json';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import {
  type JSX,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { LANG } from '@/interfaces';

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
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const t = lang === LANG.en ? enJSON : esJSON;
  const newLang = params.get('locale')
    ? (params.get('locale') as LANG)
    : LANG.en;

  const alreadyInPath = () => {
    const currentPathname = window.location.pathname;
    return pathname === currentPathname;
  };

  useEffect(() => {
    if (newLang === LANG.en || newLang === LANG.es) {
      setLangState(newLang);
      if (!alreadyInPath()) {
        router.replace(`/${newLang}${pathname}`);
      }
    } else {
      setLangState(LANG.en);
      router.replace(`/${LANG.en}${pathname}`);
    }
  }, []);

  const setLang = (newLang: LANG) => {
    setLangState(newLang);
    if (!alreadyInPath()) {
      router.replace(`/${newLang}${pathname}`);
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
