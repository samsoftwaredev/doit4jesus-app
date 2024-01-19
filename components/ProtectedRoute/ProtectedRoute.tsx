import { NAV_MAIN_LINKS } from "@/constants/nav";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
  const navigate = useRouter();
  const { user } = useUserContext();
  const isNotAuth = user === null;

  useEffect(() => {
    if (isNotAuth) navigate.push(NAV_MAIN_LINKS.login.link);
  }, []);

  if (isNotAuth) return null;

  return children;
};

export default ProtectedRoute;
