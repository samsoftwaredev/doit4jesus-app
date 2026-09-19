import { render, screen } from "@testing-library/react-native";

import { leaderboard } from "../screens/friends.test-utils";
import { RosaryLeaderboardCard } from "./RosaryLeaderboardCard";

describe("RosaryLeaderboardCard", () => {
  it("uses the localized period label instead of the backend period name", async () => {
    await render(
      <RosaryLeaderboardCard
        leaderboard={{ ...leaderboard, period: { ...leaderboard.period, name: "Backend period label" } }}
        onPressFriend={jest.fn()}
        onViewFullLeaderboard={jest.fn()}
      />,
    );

    expect(screen.getByText("This Week")).toBeTruthy();
    expect(screen.queryByText("Backend period label")).toBeNull();
    expect(screen.getByLabelText("Leaderboard period: This Week")).toBeTruthy();
  });
});
