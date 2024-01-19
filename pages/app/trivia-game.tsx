import type { NextPage } from "next";
import { TriviaGame as TriviaGameSection } from "@/sections";
import ProtectedRoute from "@/components/ProtectedRoute";

const TriviaGame: NextPage = () => {
  return (
    <ProtectedRoute>
      <TriviaGameSection />
    </ProtectedRoute>
  );
};

export default TriviaGame;
