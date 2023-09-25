import { createContext, useContext, useState } from "react";
import { INTERFACE_LANGUAGES } from "@/interfaces";

interface AudioContextType {
  /** Unique id of the item */
  language: INTERFACE_LANGUAGES;
  setLanguage: Function;
}

interface Props {
  children: JSX.Element | JSX.Element[];
  type?: INTERFACE_LANGUAGES;
}

const LanguageContext = createContext<AudioContextType | undefined>(undefined);

const LanguageContextProvider = ({
  children,
  type = INTERFACE_LANGUAGES.en,
}: Props) => {
  const [language, setLanguage] = useState<INTERFACE_LANGUAGES>(type);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguageContext must be used within a ContextProvider");
  }
  return context;
};

export { LanguageContextProvider, useLanguageContext };
