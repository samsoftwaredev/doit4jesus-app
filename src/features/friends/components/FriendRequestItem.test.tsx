import { fireEvent, render, screen } from "@testing-library/react-native";

import { johnRequest } from "../screens/friends.test-utils";
import { FriendRequestItem } from "./FriendRequestItem";

describe("FriendRequestItem", () => {
  it("presents Accept before Decline and invokes the matching actions", async () => {
    const onAccept = jest.fn();
    const onDecline = jest.fn();

    await render(<FriendRequestItem request={johnRequest} onAccept={onAccept} onDecline={onDecline} />);

    const actions = screen.getAllByRole("button");

    expect(actions.map((action) => action.props.accessibilityLabel)).toEqual([
      "Accept friend request from John Paul",
      "Decline friend request from John Paul",
    ]);

    await fireEvent.press(actions[0]);
    await fireEvent.press(actions[1]);

    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onDecline).toHaveBeenCalledTimes(1);
  });
});
