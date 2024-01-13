import { User } from "@supabase/supabase-js";

export const isClientSideRender = () => typeof window !== "undefined";

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const css = (...args: string[]) => [...args].join(" ");

export const generateRandomStringId = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const normalizeAuthDB = (userData: User | null) => {
  return {
    id: userData?.id,
    email: userData?.email,
    isConfirmed: !!userData?.confirmed_at,
  };
};
