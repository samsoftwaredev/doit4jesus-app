import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';

import { NAV_MAIN_LINKS } from '@/constants/nav';
import { useUserContext } from '@/context/UserContext';

interface Props {
  children: JSX.Element | ReactElement<any, any>;
}

const ProtectedRoute = ({ children }: Props) => {
  const router = useRouter();
  const { user } = useUserContext();
  const isAuth = !!user;

  useEffect(() => {
    // if user is not auth, redirect user to login screen
    if (!isAuth) router.push(NAV_MAIN_LINKS.login.link);
  }, []);

  if (!isAuth) return null;

  return children;
};

export default ProtectedRoute;
