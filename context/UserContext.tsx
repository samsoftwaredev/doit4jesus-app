import { db } from "@/class/SupabaseDB";
import { RealtimePresenceState, Session } from "@supabase/supabase-js";
import { normalizeUserProfile } from "normalize/dbTables";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../interfaces";
import Loading from "@/components/Loading";

interface UserContext {
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
}

interface Props {
  children: JSX.Element | JSX.Element[];
  session: null | Session;
}

const UserContext = createContext<UserContext | undefined>(undefined);

const UserContextProvider = ({ children, session }: Props) => {
  const [user, setUser] = useState<User | null | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const getProfile = async () => {
    try {
      setIsLoading(true);

      if (session === null) throw new Error("No session");

      const { data, error } = await db
        .getProfiles()
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw Error(error.message);

      const userDataNormalized = normalizeUserProfile(data);
      setUser({
        ...userDataNormalized,
        userId: session.user.id,
      });
    } catch (error) {
      setUser(null);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, [session]);

  if (isLoading) return <Loading />;

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a ContextProvider");
  }
  return context;
};

export { UserContextProvider, useUserContext };
