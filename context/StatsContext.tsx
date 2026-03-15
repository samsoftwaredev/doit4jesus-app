import {
  type JSX,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';

import { supabase } from '@/classes';
import { ConfettiCelebration } from '@/components';
import { setDateTimeZero } from '@/utils';

import { useAudioContext } from './AudioContext';
import { usePresenceContext } from './PresenceContext';
import { useUserContext } from './UserContext';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const successMessages = [
  'God Bless. You completed the rosary!⭐',
  "Congratulations! You've finished praying the rosary. God bless! 🌟",
  "Well done! You've completed the rosary. Blessings to you! ✨",
  'Fantastic! You just completed the rosary. May God bless you! ⭐',
  "You've reached the end of the rosary. God bless you abundantly! 🌹",
  "Great job! The rosary is complete. May God's blessings be upon you! 🙏",
  "You've successfully completed the rosary. Blessings from above! 🌟",
  'Well done on finishing the rosary. God bless you! 💖',
  'The rosary is done. May you be blessed richly! 🌟',
  'You’ve prayed the rosary completely. God bless you! ✨',
  'You’ve reached the end of the rosary. Blessings on you! 🌹',
];

const getSuccessMessage = () => {
  const randNum = Math.floor(Math.random() * successMessages.length);
  return successMessages[randNum];
};

const StatsContext = createContext<undefined>(undefined);

const StatsContextProvider = ({ children }: Props) => {
  const { setCallbackOnCompleteVideo, audioProgress } = useAudioContext();
  const { users: onlineUsers } = usePresenceContext();
  const { user, setUser } = useUserContext();
  const [showConfetti, setShowConfetti] = useState(false);

  const onRosaryCompleted = () => {
    setShowConfetti(true);
  };

  const registerRosaryCompleted = async () => {
    if (!user?.userId) return null;
    const onlineUsersIds = onlineUsers?.map(({ userId }) => userId) || [];
    const todaysRosaryCompleted = user.stats.todaysRosaryCompleted;
    const { data, error } = await supabase.functions.invoke(
      'rosary-completed',
      { body: { onlineUsers: onlineUsersIds } },
    );

    if (error) {
      console.error(error);
      toast.error('Unable to update rosary count', {
        toastId: 'unable to save stats',
      });
    }

    if (data && todaysRosaryCompleted === false) {
      onRosaryCompleted();
      toast.success(getSuccessMessage(), {
        toastId: 'rosary completed to save stats',
        autoClose: 50_000,
      });

      const joinedRosary = [
        ...user.stats.joinedRosary,
        ...(onlineUsersIds?.map((userId) => ({
          userId,
          date: setDateTimeZero(new Date().toISOString()),
        })) ?? []),
      ];

      const numOfRosaryCompleted =
        onlineUsersIds.length === 0 ? 1 : onlineUsersIds.length;

      setUser({
        ...user,
        stats: {
          ...user.stats,
          todaysRosaryCompleted: true,
          rosaryTotalCount: user.stats.rosaryTotalCount + numOfRosaryCompleted,
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
    <StatsContext.Provider value={undefined}>
      {showConfetti && <ConfettiCelebration />}
      {children}
    </StatsContext.Provider>
  );
};

const useStatsContext = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStatsContext must be used within a ContextProvider');
  }
  return context;
};

export { StatsContextProvider, useStatsContext };
