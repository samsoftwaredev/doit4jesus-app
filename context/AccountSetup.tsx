import { createContext, useContext } from "react";
import { useUserContext } from "./UserContext";
import { AccountSetup as AccountSetupSection } from "@/sections";
import { usePathname } from "next/navigation";
import { NAV_APP_LINKS } from "../constants";

interface AccountSetupContext {}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const AccountSetupContext = createContext<AccountSetupContext | undefined>(
  undefined
);

const AccountSetupContextProvider = ({ children }: Props) => {
  const { user } = useUserContext();
  const pathname = usePathname();
  const isAuth = !!user;

  if (
    isAuth &&
    !user?.dateOfBirth &&
    pathname.includes(NAV_APP_LINKS.app.link)
  ) {
    return <AccountSetupSection />;
  }

  return (
    <AccountSetupContext.Provider value={{}}>
      {children}
    </AccountSetupContext.Provider>
  );
};

const useAccountSetupContext = () => {
  const context = useContext(AccountSetupContext);
  if (context === undefined) {
    throw new Error(
      "useAccountSetupContext must be used within a ContextProvider"
    );
  }
  return context;
};

export { AccountSetupContextProvider, useAccountSetupContext };
