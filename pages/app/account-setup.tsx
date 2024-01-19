import type { NextPage } from "next";
import { ProtectedRoute } from "@/components";
import { AccountSetup as AccountSetupSection } from "@/sections";

const AccountSetup: NextPage = () => {
  return (
    <ProtectedRoute>
      <AccountSetupSection />
    </ProtectedRoute>
  );
};

export default AccountSetup;
