import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { OnlineUser, User } from "@/interfaces";
import { RealtimeChannel, RealtimePresenceState } from "@supabase/supabase-js";
import { normalizeOnlineUsers } from "normalize";
import { useUserContext } from "./UserContext";

interface PresenceContext {
  users: OnlineUser[] | undefined;
  setChannel: Dispatch<SetStateAction<RealtimeChannel | undefined>>;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const PresenceContext = createContext<PresenceContext | undefined>(undefined);

const PresenceContextProvider = ({ children }: Props) => {
  const { user: currentUser } = useUserContext();
  let onlineUsers: RealtimePresenceState<{}> = {};
  const [users, setUsers] = useState<OnlineUser[] | undefined>();
  const [channel, setChannel] = useState<RealtimeChannel | undefined>();

  const flattenArr = (data: any) =>
    normalizeOnlineUsers(Object.values(data).flat(2));

  const untrackPresence = async () => {
    return await channel!.untrack();
  };

  const subscribeToPresence = async () => {
    try {
      await channel!
        .on("presence", { event: "sync" }, () => {
          onlineUsers = channel!.presenceState();
          setUsers(flattenArr(onlineUsers));
        })
        .on("presence", { event: "join" }, ({ key, newPresences }) => {
          onlineUsers[key] = newPresences; // add user to list
          setUsers(flattenArr(onlineUsers));
        })
        .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
          delete onlineUsers[key]; // remove user from list
          setUsers(flattenArr(onlineUsers));
        })
        .subscribe();
    } catch (error) {
      console.error(error);
      await untrackPresence();
    }
  };

  const trackPresence = async () => {
    subscribeToPresence();
    await channel!.track({
      userId: currentUser?.userId,
      online_at: new Date().toISOString(),
      picture_url: currentUser?.pictureUrl,
      full_name: `${currentUser?.firstName} ${currentUser?.lastName}`,
    });
  };

  useEffect(() => {
    if (channel) trackPresence();
    return () => {
      if (channel) untrackPresence();
    };
  }, [channel]);

  return (
    <PresenceContext.Provider value={{ users, setChannel }}>
      {children}
    </PresenceContext.Provider>
  );
};

const usePresenceContext = () => {
  const context = useContext(PresenceContext);
  if (context === undefined) {
    throw new Error("usePresenceContext must be used within a ContextProvider");
  }
  return context;
};

export { PresenceContextProvider, usePresenceContext };
