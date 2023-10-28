import useAuth from "@/hooks/useAuth";

export const singUpService = (email: string, password: string) => {
  const { auth, createUserWithEmailAndPassword } = useAuth();
  return createUserWithEmailAndPassword(auth, email, password);
};
