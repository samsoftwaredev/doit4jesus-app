import { getAnalytics } from "firebase/analytics";
import useFirebaseApp from "./useFirebaseApp";

const useAuth = () => {
  const { app } = useFirebaseApp();
  const analytics = getAnalytics(app);
  return { analytics };
};

export default useAuth;
