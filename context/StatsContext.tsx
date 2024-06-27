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
    let shouldTrackRosaryProgress = true;
    let joinedRosaryWithFriends: string[] = [];
    const onlineUsersIds = onlineUsers
      ?.filter(({ userId }) => userId !== user.userId)
      .map(({ userId }) => userId);

    const todaysDateFormatted = formatDate();
    const completedRosary = user.stats.joinedRosary?.filter(
      (stats) => formatDate(stats.date) === todaysDateFormatted
    );
    // check if user completed today's rosary
    if (!!completedRosary === true && completedRosary.length > 0) {
      joinedRosaryWithFriends =
        onlineUsersIds?.filter((friendUserId) =>
          completedRosary.find((stats) =>
            stats.userId === null ? false : stats.userId !== friendUserId
          )
        ) ?? [];
      shouldTrackRosaryProgress = joinedRosaryWithFriends.length > 0;
    }

    if (shouldTrackRosaryProgress === false) return null;

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

    if (data) {
      toast.success("⭐God Bless. You completed the rosary!⭐", {
        toastId: "rosary completed to save stats",
      });

      const joinedRosary = [
        ...user.stats.joinedRosary,
        ...(onlineUsersIds?.map((userId) => ({
          userId,
          date: todaysDateFormatted,
        })) ?? []),
      ];

      setUser({
        ...user,
        stats: {
          ...user.stats,
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
