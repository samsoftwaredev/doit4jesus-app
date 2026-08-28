import { render, screen } from "@testing-library/react-native";
import { View } from "react-native";

import { ProgressStatCard } from "./ProgressStatCard";

describe("ProgressStatCard", () => {
  it("announces a statistic when it has no suffix", async () => {
    await render(<ProgressStatCard icon={<View />} label="TOTAL XP" value={4320} />);

    expect(screen.getByLabelText("TOTAL XP, 4320")).toBeTruthy();
  });
});
