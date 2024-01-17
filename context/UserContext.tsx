import { supabase } from "@/class/SupabaseDB";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { NAV_APP_LINKS, NAV_MAIN_LINKS } from "../constants";

interface UserContext {
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
}

interface User {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  genderMale?: boolean;
  dateOfBirth?: string;
  picture?: string;
  isConfirmed?: boolean;
}

interface Props {
  children: JSX.Element | JSX.Element[];
  session: null | Session | undefined;
}

const UserContext = createContext<UserContext | undefined>(undefined);

const UserContextProvider = ({ children, session }: Props) => {
  const navigate = useRouter();
  const [user, setUser] = useState<User | null | undefined>();

  const getProfile = async (sessionUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`username`)
        .eq("id", sessionUser.id)
        .single();

      if (error) {
        throw Error(error.message);
      } else if (data) {
        setUser({
          userId: sessionUser.id,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      if (error instanceof Error) {
        let noUserId = error.message === "No user id";
        if (noUserId) return;
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (session !== undefined) {
      if (session) getProfile(session.user);
      else setUser(null);
    }
  }, [session]);

  if (user === undefined) return <p>Loading...</p>;

  // if user is not authenticated and navigates to /app
  if (user === null && window.location.pathname.includes("/app")) {
    navigate.push(NAV_MAIN_LINKS.login.link);
    return <p>Redirecting</p>;
  }

  if (user && window.location.pathname.includes("/register")) {
    navigate.push(NAV_APP_LINKS.app.link);
    return <p>Loading...</p>;
  }

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
