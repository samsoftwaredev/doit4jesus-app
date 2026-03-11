import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-toastify';

import { db, supabase } from '@/classes/SupabaseDB';
import { Loading } from '@/components';
import { NAV_MAIN_LINKS } from '@/constants';
import { User } from '@/interfaces';
import { normalizeUserProfile } from '@/utils';

interface UserContext {
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
  getProfile: (session: Session | null) => Promise<User | undefined>;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const UserContext = createContext<UserContext | undefined>(undefined);

const updateProfileGoogle = async (userSession: Session, userProfile: any) => {
  if (userProfile?.first_name === null) {
    try {
      const { error } = await db
        .getProfiles()
        .update({
          first_name: userSession.user.user_metadata.name,
          picture_url: userSession.user.user_metadata.picture,
        })
        .eq('id', userSession.user.id)
        .select();

      if (error) {
        console.error('Error updating Google profile:', error);
        toast.error('Unable to update profile');
      }
    } catch (error) {
      console.error('Exception updating Google profile:', error);
      toast.error('Unable to update profile');
    }
  }
};

const UserContextProvider = ({ children }: Props) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const getProfile = async (
    userSession: Session | null,
  ): Promise<User | undefined> => {
    setIsLoading(true);
    try {
      if (!userSession) {
        console.error('getProfile: No user session provided');
        throw Error('No session');
      }

      const { data: userProfile, error: profileErr } = await db
        .getProfiles()
        .select('*')
        .eq('id', userSession.user.id)
        .single();

      if (profileErr) {
        console.error('Error fetching user profile:', {
          userId: userSession.user.id,
          error: profileErr,
        });
        throw Error(profileErr.message);
      }

      if (userSession.user.app_metadata.provider === 'google') {
        updateProfileGoogle(userSession, userProfile);
      }

      const { data: rosaryStats, error: statsErr } = await db
        .getRosaryStats()
        .select('*')
        .eq('user_id', userSession.user.id);

      if (statsErr) {
        console.error('Error fetching rosary stats:', {
          userId: userSession.user.id,
          error: statsErr,
        });
        throw Error(statsErr.message);
      }

      const userDataNormalized = normalizeUserProfile(userProfile, rosaryStats);
      const userData = {
        ...userDataNormalized,
        fullName: `${userDataNormalized.firstName} ${userDataNormalized.lastName}`,
        userId: userSession.user.id,
      };
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('getProfile failed:', error);
      setUser(null);
      router.push(NAV_MAIN_LINKS.login.link);
    } finally {
      setIsLoading(false);
    }
  };

  const getSession = async () => {
    setIsLoading(true);
    try {
      const res = await supabase.auth.getSession();
      if (res.data.session) getProfile(res.data.session);
      else throw new Error('No session');
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSession();
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
