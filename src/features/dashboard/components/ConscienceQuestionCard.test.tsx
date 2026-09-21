import { act, fireEvent, render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { ConscienceQuestionCard } from "./ConscienceQuestionCard";

describe("ConscienceQuestionCard", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders the mapped question and reflection without requiring unrelated endpoint fields", async () => {
    await render(
      <ConscienceQuestionCard
        allQuestions={[]}
        allQuestionsError={false}
        error={false}
        isLoadingAllQuestions={false}
        isLoading={false}
        onRetry={jest.fn()}
        onViewMore={jest.fn()}
        question={{
          id: "question-1",
          question: "Have I seriously damaged someone’s reputation?",
          reflection: "Revealing faults unjustly harms others (CCC 2477).",
        }}
      />,
    );

    expect(screen.getByText("Have I seriously damaged someone’s reputation?")).toBeTruthy();
    expect(screen.getByText("Revealing faults unjustly harms others (CCC 2477).")).toBeTruthy();
    expect(
      screen.getByText(
        "An examination of conscience is a prayerful review of your thoughts, words, and actions. Use these questions before going to sleep and before Confession.",
      ),
    ).toBeTruthy();
  });

  it("provides a compact retry state when the endpoint fails", async () => {
    const onRetry = jest.fn();
    await render(
      <ConscienceQuestionCard
        allQuestions={[]}
        allQuestionsError={false}
        error
        isLoadingAllQuestions={false}
        isLoading={false}
        onRetry={onRetry}
        onViewMore={jest.fn()}
        question={null}
      />,
    );

    expect(screen.getByText("Reflection unavailable.")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Retry conscience question"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("opens the complete question list and filters it by multiple selected categories", async () => {
    const onViewMore = jest.fn();
    await render(
      <ConscienceQuestionCard
        allQuestions={[
          { category: "single", id: "single-1", question: "Single question", title: "Faith" },
          { category: "married", id: "married-1", question: "Married question", title: "Patience" },
          { category: "religious", id: "religious-1", question: "Religious question", title: "Obedience" },
        ]}
        allQuestionsError={false}
        error={false}
        isLoadingAllQuestions={false}
        isLoading={false}
        onRetry={jest.fn()}
        onViewMore={onViewMore}
        question={{ id: "featured-1", question: "Featured question", reflection: null }}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "View more questions" }));
    expect(onViewMore).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("header", { name: "Questions of Conscience" })).toBeTruthy();
    expect(screen.getByText("Select your current vocation:")).toBeTruthy();
    expect(screen.getByText("Single question")).toBeTruthy();
    expect(screen.getByText("Married question")).toBeTruthy();
    expect(screen.getByText("Religious question")).toBeTruthy();

    await fireEvent.press(screen.getByRole("switch", { name: "Single" }));
    expect(screen.getByRole("switch", { name: "Single" }).props.accessibilityState).toEqual({ checked: true });
    expect(screen.queryByText("Married question")).toBeNull();

    await fireEvent.press(screen.getByRole("switch", { name: "Married" }));
    expect(screen.getByText("Single question")).toBeTruthy();
    expect(screen.getByText("Married question")).toBeTruthy();
    expect(screen.queryByText("Religious question")).toBeNull();
  });

  it("localizes the complete examination controls in Spanish", async () => {
    await act(async () => i18n.changeLanguage("es"));
    await render(
      <ConscienceQuestionCard
        allQuestions={[]}
        allQuestionsError={false}
        error={false}
        isLoadingAllQuestions={false}
        isLoading={false}
        onRetry={jest.fn()}
        onViewMore={jest.fn()}
        question={{ id: "featured-1", question: "Pregunta destacada", reflection: null }}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Ver más preguntas" }));
    expect(
      screen.getByText(
        "Un examen de conciencia es una revisión en oración de tus pensamientos, palabras y acciones. Usa estas preguntas antes de dormir y antes de confesarte.",
      ),
    ).toBeTruthy();
    expect(screen.getByRole("header", { name: "Preguntas de conciencia" })).toBeTruthy();
    expect(screen.getByText("Selecciona tu vocación actual:")).toBeTruthy();
    expect(screen.getByRole("switch", { name: "Soltero" })).toBeTruthy();
  });
});
