import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import {
  Dispatch,
  type JSX,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { supabase } from '@/classes/SupabaseDB';
import { Loading } from '@/components';
import {
  NAV_APP_LINKS,
  NAV_MAIN_LINKS,
  NEW_USER_REDIRECT,
} from '@/constants/nav';
import { User } from '@/interfaces';
import { fetchProfile } from '@/services/profileApi';
import { normalizeUserProfile } from '@/utils/normalizers';

interface UserContext {
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
  getProfile: (session: Session | null) => Promise<User | undefined>;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const UserContext = createContext<UserContext | undefined>(undefined);

const UserContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getProfile = async (
    userSession: Session | null,
  ): Promise<User | undefined> => {
    setIsLoading(true);
    try {
      if (!userSession) {
        console.error('getProfile: No user session provided');
        throw new Error('No session');
      }

      const { profile, rosaryStats, currentStreak } = await fetchProfile();

      const userDataNormalized = normalizeUserProfile(profile, rosaryStats);
      const userData = {
        ...userDataNormalized,
        fullName: `${userDataNormalized.firstName} ${userDataNormalized.lastName}`,
        userId: userSession.user.id,
        stats: {
          ...userDataNormalized.stats,
          currentStreak,
        },
      };
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('getProfile failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
        router.push(NAV_MAIN_LINKS.login.link);
        return;
      }

      if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && session) {
        await getProfile(session);

        const path = window.location.pathname;
        if (path === NAV_MAIN_LINKS.login.link) {
          router.push(NAV_APP_LINKS.dashboard.link);
        } else if (path === NAV_MAIN_LINKS.signup.link) {
          router.push(NEW_USER_REDIRECT);
        } else if (!path.startsWith(NAV_APP_LINKS.app.link)) {
          router.push(NAV_APP_LINKS.dashboard.link);
        }
      }

      if (event === 'INITIAL_SESSION' && !session) {
        setIsLoading(false);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      getProfile,
    }),
    [user, setUser],
  );

  if (isLoading) return <Loading />;

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a ContextProvider');
  }
  return context;
};

export { UserContextProvider, useUserContext };
