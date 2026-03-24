import enJSON from 'locales/en.json';
import esJSON from 'locales/es.json';
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
  const [lang, setLangState] = useState<LANG>(LANG.en);
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  const t = lang === LANG.en ? enJSON : esJSON;

  const setLang = (newLang: LANG) => {
    setLangState(newLang);
    // Update the URL with the new locale
    // Next.js handles the routing automatically based on the i18n config
    router.push({ pathname, query }, asPath, { locale: newLang });
  };

  useEffect(() => {
    if (locale === LANG.en || locale === LANG.es) {
      setLang(locale);
    }
  }, []);

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
