import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface UserContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

interface User {
  email?: string;
  firstName: string;
  lastName: string;
  genderMale: boolean;
  dateOfBirth: string;
  userId: string;
  picture: string;
  isConfirmed?: boolean;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const UserContext = createContext<UserContext | undefined>(undefined);

const UserContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a ContextProvider");
  }
  return context;
};

export { UserContextProvider, useUserContext };
