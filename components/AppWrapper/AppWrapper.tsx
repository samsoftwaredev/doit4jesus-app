import { AccountSetupContextProvider } from "@/context/AccountSetup";
import ProtectedRoute from "../ProtectedRoute";
import { PresenceContextProvider } from "@/context/PresenceContext";

interface Props {
  children: JSX.Element | JSX.Element[];
}

const AppWrapper = ({ children }: Props) => {
  return (
    <ProtectedRoute>
      <AccountSetupContextProvider>
        <PresenceContextProvider>{children}</PresenceContextProvider>
      </AccountSetupContextProvider>
    </ProtectedRoute>
  );
};

export default AppWrapper;
