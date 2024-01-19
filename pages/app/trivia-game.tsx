import type { NextPage } from "next";
import { TriviaGame } from "@/sections";
import ProtectedRoute from "@/components/ProtectedRoute";

const TriviaGamePage: NextPage = () => {
  return (
    <ProtectedRoute>
      <TriviaGame />
    </ProtectedRoute>
  );
};

export default TriviaGamePage;
