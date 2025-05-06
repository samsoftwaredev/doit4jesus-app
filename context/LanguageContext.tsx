import enJSON from 'locales/en.json';
import esJSON from 'locales/es.json';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect } from 'react';

import { LANG } from '@/interfaces';

interface LanguageContext {
  /** Unique id of the item */
  t: typeof enJSON | typeof esJSON;
  lang: LANG;
  changeLang: Function;
}

interface Props {
  children: JSX.Element | JSX.Element[];
  type?: LANG;
}

const LanguageContext = createContext<LanguageContext | undefined>(undefined);

const LanguageContextProvider = ({ children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = router;
  const t = locale === LANG.en ? enJSON : esJSON;
  const language = locale === LANG.en ? LANG.es : LANG.en;

  const changeLanguage = () => {
    const newLang = router.locale === LANG.en ? LANG.es : LANG.en;
    router.push(pathname, pathname, { locale: newLang });
  };

  useEffect(() => {
    const newLang = router.locale === LANG.es ? LANG.es : LANG.en;
    router.push(pathname, pathname, { locale: newLang });
  }, [pathname]);

  return (
    <LanguageContext.Provider
      value={{
        t,
        lang: language,
        changeLang: changeLanguage,
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
