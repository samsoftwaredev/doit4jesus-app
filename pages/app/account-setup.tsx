import type { NextPage } from "next";
import { AccountSetup, ProtectedRoute } from "@/components";

const AccountSetUp: NextPage = () => {
  return (
    <ProtectedRoute>
      <AccountSetup />
    </ProtectedRoute>
  );
};

export default AccountSetUp;
