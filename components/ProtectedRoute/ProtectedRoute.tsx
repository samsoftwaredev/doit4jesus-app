import { useRouter } from 'next/navigation';
import { type JSX, ReactElement, useEffect, useState } from 'react';

import { supabase } from '@/classes/SupabaseDB';
import { NAV_MAIN_LINKS } from '@/constants/nav';
import { useUserContext } from '@/context/UserContext';

interface Props {
  children: JSX.Element | ReactElement<any, any>;
}

const ProtectedRoute = ({ children }: Props) => {
  const router = useRouter();
  const { user } = useUserContext();
  const [isSessionVerified, setIsSessionVerified] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!active) return;

        if (error || !data.session) {
          setIsSessionVerified(false);
          router.push(NAV_MAIN_LINKS.login.link);
          return;
        }

        setIsSessionVerified(true);
      } catch (err) {
        if (!active) return;
        setIsSessionVerified(false);
        router.push(NAV_MAIN_LINKS.login.link);
      }
    };

    verifySession();
    return () => {
      active = false;
    };
  }, []);

  if (isSessionVerified === null) return null;

  if (!isSessionVerified || !user) return null;

  return children;
};

export default ProtectedRoute;
