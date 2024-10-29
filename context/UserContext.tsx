import { db, supabase } from "classes/SupabaseDB";
import { Session } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Loading } from "@/components";
import { normalizeUserProfile } from "@/utils";

import { User } from "../interfaces";
import { NAV_MAIN_LINKS } from "../constants";

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
    const { error } = await db
      .getProfiles()
      .update({
        first_name: userSession.user.user_metadata.name,
        picture_url: userSession.user.user_metadata.picture,
      })
      .eq("id", userSession.user.id)
      .select();
    if (error) toast.error("Unable to update profile");
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
      if (!userSession) throw Error("No session");
      const { data: userProfile, error: profileErr } = await db
        .getProfiles()
        .select("*")
        .eq("id", userSession.user.id)
        .single();

      if (userSession.user.app_metadata.provider === "google") {
        updateProfileGoogle(userSession, userProfile);
      }

      if (profileErr) throw Error(profileErr.message);

      const { data: rosaryStats, error: statsErr } = await db
        .getRosaryStats()
        .select("*")
        .eq("user_id", userSession.user.id);

      if (statsErr) throw Error(statsErr.message);

      const userDataNormalized = normalizeUserProfile(userProfile, rosaryStats);
      const userData = {
        ...userDataNormalized,
        userId: userSession.user.id,
      };
      setUser(userData);
      return userData;
    } catch (error) {
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
      else throw new Error("No session");
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
    throw new Error("useUserContext must be used within a ContextProvider");
  }
  return context;
};

export { UserContextProvider, useUserContext };
