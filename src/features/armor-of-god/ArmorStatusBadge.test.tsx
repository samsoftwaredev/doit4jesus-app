import { render, screen } from "@testing-library/react-native";

import { ArmorStatusBadge } from "./ArmorStatusBadge";

describe("ArmorStatusBadge", () => {
  it("renders the human-readable armor status", async () => {
    await render(<ArmorStatusBadge status="equipped" />);

    expect(screen.getByText("Equipped")).toBeTruthy();
  });
});
