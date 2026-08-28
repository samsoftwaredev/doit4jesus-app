import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { AuthMessage, AuthScreen, AuthTextInput } from "./AuthScreen";

const mockBack = jest.fn();

jest.mock("expo-router", () => ({ useRouter: () => ({ back: mockBack }) }));

describe("AuthScreen", () => {
  it("renders an accessible chevron back button on authentication pages", async () => {
    await render(
      <AuthScreen subtitle="Continue your journey." title="Sign in">
        <Text>Authentication form</Text>
      </AuthScreen>,
    );

    expect(screen.getByText("WELCOME")).toBeTruthy();
    expect(screen.getByText("Sign in")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Go back" }));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("renders text inputs and both message tones", async () => {
    const rendered = await render(
      <>
        <AuthTextInput accessibilityLabel="Email" label="Email" value="" />
        <AuthMessage>Something went wrong.</AuthMessage>
      </>,
    );

    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByText("Something went wrong.")).toBeTruthy();

    await rendered.rerender(<AuthMessage tone="success">Welcome back.</AuthMessage>);
    expect(screen.getByText("Welcome back.")).toBeTruthy();
  });
});
