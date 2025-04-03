import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import { toast } from 'react-toastify';

import { FriendProfile, LANG } from '@/interfaces';
import { getUserProfileAPI } from '@/services';

interface FriendsContext {
  friendsProfiles: FriendProfile[];
  setFriendProfiles: Dispatch<SetStateAction<FriendProfile[]>>;
  friendIdsRequest: string[];
  setFriendIdsRequest: Dispatch<SetStateAction<string[]>>;
  friendIds: string[];
  setFriendIds: Dispatch<SetStateAction<string[]>>;
  getFriendsProfiles: (uid: string[]) => Promise<FriendProfile[] | null>;
}

interface Props {
  children: JSX.Element | JSX.Element[];
  type?: LANG;
}

const FriendsContext = createContext<FriendsContext | undefined>(undefined);

const FriendsContextProvider = ({ children }: Props) => {
  const [friendsProfiles, setFriendProfiles] = useState<FriendProfile[]>([]);
  const [friendIdsRequest, setFriendIdsRequest] = useState<string[]>([]);
  const [friendIds, setFriendIds] = useState<string[]>([]);

  const getFriendsProfiles = async (userIds: string[]) => {
    const [data, error] = await getUserProfileAPI(userIds);
    if (error) {
      console.error(error);
      toast.error('Unable to retrieve friends profile.');
    }
    if (data) setFriendProfiles(data);
    return data;
  };

  return (
    <FriendsContext.Provider
      value={{
        friendsProfiles,
        setFriendProfiles,
        friendIdsRequest,
        setFriendIdsRequest,
        friendIds,
        setFriendIds,
        getFriendsProfiles,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

const useFriendsContext = () => {
  const context = useContext(FriendsContext);
  if (context === undefined) {
    throw new Error('useFriendsContext must be used within a ContextProvider');
  }
  return context;
};

export { FriendsContextProvider, useFriendsContext };
