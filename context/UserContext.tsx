import { db, supabase } from "@/class/SupabaseDB";
import { Session } from "@supabase/supabase-js";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

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
  session: null | Session;
}

const UserContext = createContext<UserContext | undefined>(undefined);

const UserContextProvider = ({ children, session }: Props) => {
  const [user, setUser] = useState<User | null | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // Create a function to handle inserts
  const handleInserts = (payload: any) => {
    console.log("Change received!", payload);
  };

  const setOnlinePresence = async () => {
    const liveEvent = supabase.channel("live-event"); // set your topic here
    const presenceTrackStatus = await liveEvent.track({
      user: user?.userId,
      online_at: new Date().toISOString(),
    });
    console.log("presenceTrackStatus: ", presenceTrackStatus);
  };

  const getProfile = async () => {
    try {
      setIsLoading(true);

      if (session === null) throw new Error("No session");

      const { data, error } = await db
        .getProfiles()
        .select("username")
        .eq("id", session.user.id)
        .single();

      if (error) throw Error(error.message);

      setOnlinePresence();
      setUser({
        ...data,
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

  if (isLoading) return <p>Loading...</p>;

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
