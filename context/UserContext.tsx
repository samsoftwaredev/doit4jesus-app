import { supabase } from "@/class/SupabaseDB";
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
import { NAV_MAIN_LINKS } from "../constants";

interface UserContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
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
let ignore = false;

const UserContextProvider = ({ children, session }: Props) => {
  const navigate = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, seIsLoading] = useState(true);

  const getProfile = async () => {
    seIsLoading(true);
    try {
      if (!user) throw Error("No user id");

      const { data, error } = await supabase
        .from("profiles")
        .select(`username, gender, firstName, lastName`)
        .eq("id", user!.userId)
        .single();

      debugger;
      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setUser({
            ...data,
            userId: user!.userId,
            genderMale: data.gender === "male",
          });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        let noUserId = error.message !== "No user id";
        if (noUserId) console.error(error);
      }
    }
    seIsLoading(false);
  };

  useEffect(() => {
    getProfile();
    return () => {
      ignore = true;
    };
  }, [session]);

  if (isLoading) return <p>Loading...</p>;

  if (session === null && user === null) {
    // if user is in /app navigate away
    if (window.location.pathname.includes("/app")) {
      navigate.push(NAV_MAIN_LINKS.login.link);
      return <p>Loading...</p>;
    }
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
