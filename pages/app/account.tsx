import { AppLayout } from "@/components/Templates";
import type { NextPage } from "next";
import AppWrapper from "@/components/AppWrapper";
import { AccountSection } from "@/components/Sections";

const Account: NextPage = () => {
  return (
    <AppLayout>
      <AccountSection />
    </AppLayout>
  );
};

const AccountWrapper = () => {
  return (
    <AppWrapper>
      <Account />
    </AppWrapper>
  );
};

export default AccountWrapper;
