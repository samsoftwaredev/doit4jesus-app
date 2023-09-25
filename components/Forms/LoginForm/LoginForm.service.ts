import useAuth from "@/hooks/useAuth";
import { signInWithEmailAndPassword } from "firebase/auth";

export const loginUserService = (email: string, password: string) => {
  const { auth } = useAuth();
  return signInWithEmailAndPassword(auth, email, password);
};
