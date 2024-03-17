import ProtectedRoute from "../ProtectedRoute";
import { useUserContext } from "@/context/UserContext";
import { usePathname } from "next/navigation";
import { NAV_APP_LINKS } from "@/constants/nav";
import { COMPANY } from "@/constants/company";
import AccountSetup from "@/sections/AccountSetup";
import Meta from "../Meta";

interface Props {
  children: any;
}

const AppWrapper = ({ children }: Props) => {
  const { user } = useUserContext();
  const pathname = usePathname();
  const isAuth = !!user;

  if (
    isAuth &&
    !user?.dateOfBirth &&
    pathname.includes(NAV_APP_LINKS.app.link)
  ) {
    return (
      <ProtectedRoute>
        <>
          <Meta pageTitle={COMPANY.name} />
          <AccountSetup />
        </>
      </ProtectedRoute>
    );
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default AppWrapper;
