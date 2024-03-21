import { db, supabase } from "classes/SupabaseDB";
import { Session } from "@supabase/supabase-js";
import { normalizeUserProfile } from "@/utils";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "../interfaces";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
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

const UserContextProvider = ({ children }: Props) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const getProfile = async (
    userSession: Session | null
  ): Promise<User | undefined> => {
    setIsLoading(true);
    try {
      if (!userSession) throw Error("No session");
      const { data, error } = await db
        .getProfiles()
        .select("*")
        .eq("id", userSession.user.id)
        .single();

      if (error) throw Error(error.message);

      const userDataNormalized = normalizeUserProfile(data);
      const userData = {
        ...userDataNormalized,
        userId: userSession.user.id,
      };
      setUser(userData);
      return userData;
    } catch (error) {
      setUser(null);
      router.push(NAV_MAIN_LINKS.login.link);
      console.error(error);
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
    [user]
  );

  if (isLoading) return <Loading isPage={true} />;

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
