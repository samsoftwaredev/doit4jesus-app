import { createContext, useContext, useEffect, useState } from "react";
import { OnlineUser, User } from "@/interfaces";
import { RealtimePresenceState } from "@supabase/supabase-js";
import { supabase } from "../class";
import { normalizeOnlineUsers } from "normalize";

interface PresenceContext {
  users: OnlineUser[] | undefined;
}

interface Props {
  children: JSX.Element | JSX.Element[];
  user: User;
}

const PresenceContext = createContext<PresenceContext | undefined>(undefined);
const liveEvent = supabase.channel("live-event"); // set your topic here

const PresenceContextProvider = ({ children, user }: Props) => {
  let onlineUsers: RealtimePresenceState<{}> = {};
  const [users, setUsers] = useState<OnlineUser[] | undefined>();

  const flattenArr = (data: any) =>
    normalizeOnlineUsers(Object.values(data).flat(2));

  const untrackPresence = async () => {
    return await liveEvent.untrack();
  };

  const subscribeToPresence = async () => {
    try {
      await liveEvent
        .on("presence", { event: "sync" }, () => {
          onlineUsers = liveEvent.presenceState();
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
    await liveEvent.track({
      userId: user?.userId,
      online_at: new Date().toISOString(),
      picture_url: user?.pictureUrl,
      full_name: `${user?.firstName} ${user?.lastName}`,
    });
  };

  useEffect(() => {
    trackPresence();
    return () => {
      untrackPresence();
    };
  }, []);

  return (
    <PresenceContext.Provider value={{ users }}>
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
