import { render, screen } from "@testing-library/react-native";

jest.mock("@/features/churches", () => {
  const { Text } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    ChurchReminderReviewScreen: () => <Text>Church reminder review screen</Text>,
    ChurchesScreen: () => <Text>Protected churches screen</Text>,
  };
});

const ChurchesRoute = jest.requireActual<typeof import("@/app/churches/index")>("@/app/churches/index").default;
const ChurchRemindersRoute =
  jest.requireActual<typeof import("@/app/churches/reminders")>("@/app/churches/reminders").default;

describe("churches route", () => {
  it("renders the church discovery screen", async () => {
    await render(<ChurchesRoute />);
    expect(screen.getByText("Protected churches screen")).toBeTruthy();
  });

  it("renders the dedicated reminder review screen", async () => {
    await render(<ChurchRemindersRoute />);
    expect(screen.getByText("Church reminder review screen")).toBeTruthy();
  });
});
