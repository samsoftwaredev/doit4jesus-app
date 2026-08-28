import { render, screen } from "@testing-library/react-native";

import { DailyVerseCard } from "./DailyVerseCard";

describe("DailyVerseCard", () => {
  it("renders the verse text", async () => {
    await render(<DailyVerseCard citation="Mt 22:37" text="You shall love the Lord, your God, with all your heart." />);
    expect(screen.getByText("You shall love the Lord, your God, with all your heart.")).toBeTruthy();
  });

  it("renders the citation", async () => {
    await render(<DailyVerseCard citation="Mt 22:37" text="You shall love the Lord, your God." />);
    expect(screen.getByText("Mt 22:37")).toBeTruthy();
  });

  it("has an accessible label combining the citation", async () => {
    await render(<DailyVerseCard citation="Jn 3:16" text="For God so loved the world." />);
    expect(screen.getByLabelText("Gospel excerpt, Jn 3:16")).toBeTruthy();
  });
});
