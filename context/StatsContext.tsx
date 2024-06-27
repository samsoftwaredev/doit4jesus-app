import { createContext, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";
import { supabase } from "../classes";
import { useAudioContext } from "./AudioContext";
import { usePresenceContext } from "./PresenceContext";
import { formatDate } from "../utils";

interface Props {
  children: JSX.Element | JSX.Element[];
}

const StatsContext = createContext<undefined>(undefined);

const StatsContextProvider = ({ children }: Props) => {
  const { setCallbackOnCompleteVideo, audioProgress } = useAudioContext();
  const { users: onlineUsers } = usePresenceContext();
  const { user, setUser } = useUserContext();

  const registerRosaryCompleted = async () => {
    if (!user?.userId) return null;
    const onlineUsersIds = onlineUsers?.map(({ userId }) => userId) || [];
    const todaysRosaryCompleted = user.stats.todaysRosaryCompleted === false;
    const { data, error } = await supabase.functions.invoke(
      "rosary-completed",
      { body: { onlineUsers: onlineUsersIds } }
    );

    if (error) {
      console.log(error);
      toast.error("Unable to store rosary count", {
        toastId: "unable to save stats",
      });
    }

    if (data && todaysRosaryCompleted === false) {
      toast.success("⭐God Bless. You completed the rosary!⭐", {
        toastId: "rosary completed to save stats",
      });

      const joinedRosary = [
        ...user.stats.joinedRosary,
        ...(onlineUsersIds?.map((userId) => ({
          userId,
          date: formatDate(),
        })) ?? []),
      ];

      setUser({
        ...user,
        stats: {
          ...user.stats,
          todaysRosaryCompleted: true,
          rosaryTotalCount: user.stats.rosaryTotalCount + 1,
          joinedRosary,
        },
      });
    }
  };

  useEffect(() => {
    setCallbackOnCompleteVideo(() => {
      registerRosaryCompleted();
    });
  }, [audioProgress]);

  return (
    <StatsContext.Provider value={undefined}>{children}</StatsContext.Provider>
  );
};

const useStatsContext = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error("useStatsContext must be used within a ContextProvider");
  }
  return context;
};

export { StatsContextProvider, useStatsContext };
