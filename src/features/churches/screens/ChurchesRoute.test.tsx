import { render, screen } from "@testing-library/react-native";

jest.mock("@/features/churches", () => {
  const { Text } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    ChurchesScreen: () => <Text>Protected churches screen</Text>,
  };
});

const ChurchesRoute = jest.requireActual<typeof import("@/app/churches/index")>("@/app/churches/index").default;

describe("churches route", () => {
  it("renders the church discovery screen", async () => {
    await render(<ChurchesRoute />);
    expect(screen.getByText("Protected churches screen")).toBeTruthy();
  });
});
