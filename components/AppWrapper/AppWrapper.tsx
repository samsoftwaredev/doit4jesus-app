import ProtectedRoute from "../ProtectedRoute";
import { useUserContext } from "@/context/UserContext";
import { usePathname } from "next/navigation";
import { NAV_APP_LINKS } from "@/constants/nav";
import { COMPANY } from "@/constants/company";
import AccountSetup from "@/components/Sections/AccountSetup";
import Meta from "../Meta";
import { useAudioContext } from "@/context/AudioContext";
import { useEffect } from "react";

interface Props {
  children: any;
}

const AppWrapper = ({ children }: Props) => {
  const { user } = useUserContext();
  const { setHideMusicPlayer } = useAudioContext();
  const pathname = usePathname();
  const isAuth = !!user;

  useEffect(() => {
    if (!isAuth) {
      // hide music player if user is not auth
      setHideMusicPlayer(true);
    } else if (!user.dateOfBirth && isAuth) {
      // hide music player if user is setting up account
      setHideMusicPlayer(true);
    } else {
      setHideMusicPlayer(false);
    }
  }, [!!user]);

  if (
    isAuth &&
    !user?.dateOfBirth &&
    pathname.includes(NAV_APP_LINKS.dashboard.link)
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
