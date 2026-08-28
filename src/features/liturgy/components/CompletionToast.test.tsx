import { render, screen } from "@testing-library/react-native";

import { CompletionToast } from "./CompletionToast";

describe("CompletionToast", () => {
  it("does not occupy space while hidden and explains earned points when visible", async () => {
    const hidden = await render(<CompletionToast count={3} visible={false} onDismiss={jest.fn()} />);
    expect(hidden.queryByText("All 3 scriptures completed")).toBeNull();

    await hidden.rerender(<CompletionToast count={3} points={15} totalXp={365} visible onDismiss={jest.fn()} />);
    expect(screen.getByText("All 3 scriptures completed")).toBeTruthy();
    expect(screen.getByText("Points +15")).toBeTruthy();
  });
});
