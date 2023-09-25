import useFirebaseApp from "./useFirebaseApp";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const useAuth = () => {
  const { app } = useFirebaseApp();
  const auth = getAuth(app);
  return { auth, createUserWithEmailAndPassword };
};

export default useAuth;
