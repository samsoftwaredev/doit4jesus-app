import moment from 'moment';

import { sessionFriendsKey } from '../constants';
import { FriendProfile } from '../interfaces';

export const isClientSideRender = () => typeof window !== 'undefined';

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const css = (...args: string[]) => [...args].join(' ');

const convertDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};

export const setDateTimeZero = (
  dateString: string | Date = new Date(),
): string => {
  const date = new Date(convertDate(dateString));
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

export const formatDateDash = (dateString: string | Date): string => {
  return moment(setDateTimeZero(dateString)).format('YYYY-MM-DD');
};

export const formatDateSlash = (dateString: string | Date): string => {
  return moment(setDateTimeZero(dateString)).format('MM/DD/YYYY');
};

export const generateRandomStringId = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const dollarFormatter = (amount: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(amount);
};

export const numberToDollar = (dollar: number) => {
  const dollarArrStr = dollar.toString().split('');
  dollarArrStr.splice(dollarArrStr.length - 2, 0, '.');
  const dollarNumber = dollarArrStr.join('');
  return +dollarNumber;
};

export const compareUUIDs = (uuid1: string, uuid2: string) => {
  if (uuid1 < uuid2) return -1;
  else if (uuid1 > uuid2) return 1;
  else return 0;
};

export const orderUUIDs = (uuid1: string, uuid2: string) => {
  const num = compareUUIDs(uuid1, uuid2);
  return num === -1 ? [uuid2, uuid1] : [uuid1, uuid2];
};

export const getUserProfileLocally = (
  friendId: string,
): FriendProfile | undefined => {
  const friendsProfile = sessionStorage.getItem(sessionFriendsKey);
  const friendsList: FriendProfile[] =
    typeof friendsProfile === 'string' ? JSON.parse(friendsProfile) : [];

  const friendData = friendsList.find(({ userId }) => userId === friendId);
  return friendData;
};

export const storeUserProfileLocally = (friendsData: FriendProfile[] = []) => {
  const friendsProfile = sessionStorage.getItem(sessionFriendsKey);
  const prevFriendsData: FriendProfile[] =
    typeof friendsProfile === 'string' ? JSON.parse(friendsProfile) : [];
  if (Array.isArray(prevFriendsData)) {
    const prevFriendsDataIds = prevFriendsData.map(({ userId }) => userId);
    const friendsDataIds = friendsData.map(({ userId }) => userId);
    const noDuplicatesIds = new Set([...prevFriendsDataIds, ...friendsDataIds]);
    const friends = Array.from(noDuplicatesIds).map((uid) => {
      let found = prevFriendsData.find(({ userId }) => userId === uid);
      if (found) return found;
      return friendsData.find(({ userId }) => userId === uid);
    });
    sessionStorage.setItem(sessionFriendsKey, JSON.stringify(friends));
  }
};
