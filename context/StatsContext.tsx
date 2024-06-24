import { createContext, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";
import { supabase } from "../classes";
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
    const todaysDateFormatted = dayjs().format("MM/DD/YYYY");

    const { data, error } = await supabase.functions.invoke(
      "rosary-completed",
      {
        body: {
          usersOnline: [],
        },
      }
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
