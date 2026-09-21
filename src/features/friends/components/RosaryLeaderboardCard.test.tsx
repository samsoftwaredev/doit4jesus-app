import { fireEvent, render, screen } from "@testing-library/react-native";

import { saintAvatars } from "@/features/profile/saints";
import { i18n } from "@/localization";

import { leaderboard } from "../screens/friends.test-utils";
import { RosaryLeaderboardCard } from "./RosaryLeaderboardCard";

describe("RosaryLeaderboardCard", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("uses the localized period label instead of the backend period name", async () => {
    await render(
      <RosaryLeaderboardCard
        leaderboard={{ ...leaderboard, period: { ...leaderboard.period, name: "Backend period label" } }}
        onAddFriends={jest.fn()}
        onPressFriend={jest.fn()}
        onViewFullLeaderboard={jest.fn()}
      />,
    );

    expect(screen.getByText("This Week")).toBeTruthy();
    expect(screen.queryByText("Backend period label")).toBeNull();
    expect(screen.getByLabelText("Leaderboard period: This Week")).toBeTruthy();
  });

  it("uses a leaderboard friend's saint avatar before their uploaded avatar URL", async () => {
    const saintAvatarId = "a1000000-0000-4000-8000-000000000005";
    const saintBenedict = saintAvatars.find((saint) => saint.id === saintAvatarId)!;
    const leaderboardWithSaint = {
      ...leaderboard,
      entries: leaderboard.entries.map((entry, index) =>
        index === 0
          ? {
              ...entry,
              friend: { ...entry.friend, avatarUrl: "https://example.test/maria.png", saintAvatarId },
            }
          : entry,
      ),
    };

    await render(
      <RosaryLeaderboardCard
        leaderboard={leaderboardWithSaint}
        onAddFriends={jest.fn()}
        onPressFriend={jest.fn()}
        onViewFullLeaderboard={jest.fn()}
      />,
    );

    const avatar = screen.getByLabelText("Maria Santos's profile image");
    const avatarImage = avatar.children[0];
    if (typeof avatarImage === "string") throw new Error("Expected Maria's avatar image to be rendered.");
    expect(avatarImage.props.source).toEqual([saintBenedict.image]);
  });

  it("explains the friends-only ranking and invokes the add-friends CTA", async () => {
    const onAddFriends = jest.fn();
    await render(
      <RosaryLeaderboardCard
        leaderboard={leaderboard}
        onAddFriends={onAddFriends}
        onPressFriend={jest.fn()}
        onViewFullLeaderboard={jest.fn()}
      />,
    );

    expect(
      screen.getByText(
        "This leaderboard is based only on your friends. The more friends you add, the more competitive it becomes.",
      ),
    ).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Add Friends" }));
    expect(onAddFriends).toHaveBeenCalledTimes(1);
  });

  it("shows the friends-only explanation and CTA in Spanish", async () => {
    await i18n.changeLanguage("es");
    await render(
      <RosaryLeaderboardCard
        leaderboard={leaderboard}
        onAddFriends={jest.fn()}
        onPressFriend={jest.fn()}
        onViewFullLeaderboard={jest.fn()}
      />,
    );

    expect(
      screen.getByText(
        "Esta clasificación se basa únicamente en tus amigos. Cuantos más amigos agregues, más competitiva será.",
      ),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Agregar amigos" })).toBeTruthy();
  });
});
