import { db, supabase } from "@/class/SupabaseDB";
import { Session } from "@supabase/supabase-js";
import { normalizeUserProfile } from "normalize/dbTables";
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
import { NAV_APP_LINKS, NAV_MAIN_LINKS } from "../constants";

interface UserContext {
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
  getProfile: (session: Session | null) => void;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const UserContext = createContext<UserContext | undefined>(undefined);

const UserContextProvider = ({ children }: Props) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const getProfile = async (userSession: Session | null) => {
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
      setUser({
        ...userDataNormalized,
        userId: userSession.user.id,
      });
      router.push(NAV_APP_LINKS.app.link);
    } catch (error) {
      setUser(null);
      router.push(NAV_MAIN_LINKS.login.link);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSession = async () => {
    let errorMessage = "No session";
    setIsLoading(true);
    await supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        if (session) getProfile(session);
        else throw new Error(errorMessage);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getSession();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        getProfile(session);
      } else if (event === "SIGNED_OUT") {
        getProfile(null);
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
    [user]
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
