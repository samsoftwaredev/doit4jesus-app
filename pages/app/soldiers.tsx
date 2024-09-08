import type { NextPage } from "next";

import { AppLayout } from "@/components/Templates";
import AppWrapper from "@/components/AppWrapper";
import { FriendsSection } from "@/components/Sections";

const Friends: NextPage = () => {
  return (
    <AppLayout>
      <FriendsSection />
    </AppLayout>
  );
};

const FriendsWrapper = () => {
  return (
    <AppWrapper>
      <Friends />
    </AppWrapper>
  );
};

export default FriendsWrapper;
