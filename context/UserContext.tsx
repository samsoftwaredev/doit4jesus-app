import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import {
  Dispatch,
  type JSX,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

/** Shape of the value exposed by UserContext. */
interface UserContext {
  /** Current user profile. `null` = signed out, `undefined` = not yet determined. */
  user: User | null | undefined;
  /** Manually override the user state (e.g. after a profile update). */
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
  /** Fetch and store the user profile for the given Supabase session. */
  setSession: (session: Session | null) => void;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const UserContext = createContext<UserContext | undefined>(undefined);

/**
 * Provides authentication state and user profile data to the component tree.
 *
 * - Listens to Supabase auth state changes (sign-in, sign-out, session init).
 * - Fetches the user profile on initial session or sign-in.
 * - Redirects to the appropriate page based on auth state and current path.
 * - Shows a full-screen loading indicator while the session is being resolved.
 */
const UserContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null | undefined>();
  const [session, setSession] = useState<Session | null>(null);
  const [whyLoading, setWhyLoading] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /**
   * Fetch the user's profile, rosary stats, and streak from the API,
   * then normalize and store them in state.
   *
   * @param userSession - The active Supabase session. Throws if null.
   * @returns The normalized user data, or `undefined` on failure.
   */
  const getProfile = async (
    userSession: Session | null,
  ): Promise<User | undefined> => {
    setIsLoading(true);
    setWhyLoading('Fetching your profile...');
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
    if (session) {
      getProfile(session);
    }
  }, [session]);
  // Subscribe to Supabase auth state changes and handle sign-in / sign-out flows.
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (event === 'SIGNED_OUT') {
          setWhyLoading('Redirecting to login...');
          setUser(null);
          setIsLoading(false);
          router.push(NAV_MAIN_LINKS.login.link);
          return;
        }

        if (
          (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') &&
          newSession
        ) {
          // Skip re-fetching if we already have the user profile loaded
          if (event === 'SIGNED_IN' && user) {
            setIsLoading(false);
            return;
          }
          setWhyLoading('Fetching your blessings...');
          await setSession(newSession);

          const path = window.location.pathname;
          if (path === NAV_MAIN_LINKS.login.link) {
            router.push(NAV_APP_LINKS.dashboard.link);
          } else if (path === NAV_MAIN_LINKS.signup.link) {
            router.push(NEW_USER_REDIRECT);
          } else if (!path.startsWith(NAV_APP_LINKS.app.link)) {
            router.push(NAV_APP_LINKS.dashboard.link);
          }
          setIsLoading(false);
        }

        if (event === 'INITIAL_SESSION' && !newSession) {
          setWhyLoading('Initializing...');
          setIsLoading(false);
        }
      },
    );
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  // Heartbeat: update last_seen every 60s so other users can detect who's online.
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateLastSeen = useCallback(async () => {
    if (!user?.userId) return;
    try {
      await supabase
        .from('profiles')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', user.userId);
    } catch (err) {
      // Best-effort — don't break the app if this fails
      console.error('Heartbeat update failed:', err);
    }
  }, [user?.userId]);

  useEffect(() => {
    if (!user?.userId) return;

    // Fire immediately then repeat every 60s
    updateLastSeen();
    heartbeatRef.current = setInterval(updateLastSeen, 60_000);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [user?.userId, updateLastSeen]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      setSession,
    }),
    [user, setUser, setSession],
  );

  if (isLoading) return <Loading description={whyLoading} />;

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/**
 * Hook to access the current user and auth helpers.
 * Must be used within a `<UserContextProvider>`.
 *
 * @throws {Error} If called outside of a UserContextProvider.
 */
const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a ContextProvider');
  }
  return context;
};

export { UserContextProvider, useUserContext };
