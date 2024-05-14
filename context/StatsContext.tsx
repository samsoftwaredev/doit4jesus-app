import { createContext, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";
import { db } from "../classes";
import dayjs from "dayjs";
import { useAudioContext } from "./AudioContext";

interface Props {
  children: JSX.Element | JSX.Element[];
}

const StatsContext = createContext<undefined>(undefined);

const StatsContextProvider = ({ children }: Props) => {
  const { setCallbackOnCompleteVideo, audioProgress } = useAudioContext();
  const { user, setUser } = useUserContext();

  const registerRosaryCompleted = async () => {
    if (!user?.userId) return null;
    // check if user completed today's rosary
    const todaysDate = dayjs();
    const todaysDateFormatted = todaysDate.format("MM/DD/YYYY");
    const found = user.stats.rosaryGraph?.find(
      (date) => dayjs(date).format("MM/DD/YYYY") === todaysDateFormatted
    );

    if (found !== undefined) return null;
    const { data, error } = await db
      .getRosaryStats()
      .insert({
        completed_at: todaysDate.format("YYYY/MM/DD"),
        user_id: user.userId,
      })
      .eq("user_id", user.userId!)
      .select();

    if (data) {
      toast.success("⭐God Bless. You completed the rosary!⭐");
      const rosaryGraph = Array.isArray(user.stats.rosaryGraph)
        ? [...user.stats.rosaryGraph, todaysDateFormatted]
        : [todaysDateFormatted];

      setUser({
        ...user,
        stats: {
          ...user.stats,
          rosaryTotalCount: user.stats.rosaryTotalCount + 1,
          rosaryGraph,
        },
      });
    }

    if (error) toast.error("Unable to store rosary count");
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
