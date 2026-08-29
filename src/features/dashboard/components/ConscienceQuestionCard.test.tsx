import { fireEvent, render, screen } from "@testing-library/react-native";

import { ConscienceQuestionCard } from "./ConscienceQuestionCard";

describe("ConscienceQuestionCard", () => {
  it("renders the mapped question and reflection without requiring unrelated endpoint fields", async () => {
    await render(
      <ConscienceQuestionCard
        error={false}
        isLoading={false}
        onRetry={jest.fn()}
        question={{
          id: "question-1",
          question: "Have I seriously damaged someone’s reputation?",
          reflection: "Revealing faults unjustly harms others (CCC 2477).",
        }}
      />,
    );

    expect(screen.getByText("Have I seriously damaged someone’s reputation?")).toBeTruthy();
    expect(screen.getByText("Revealing faults unjustly harms others (CCC 2477).")).toBeTruthy();
  });

  it("provides a compact retry state when the endpoint fails", async () => {
    const onRetry = jest.fn();
    await render(<ConscienceQuestionCard error isLoading={false} onRetry={onRetry} question={null} />);

    expect(screen.getByText("Reflection unavailable.")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Retry conscience question"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
