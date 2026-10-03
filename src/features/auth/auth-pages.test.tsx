import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { createElement as mockCreateElement, type ReactNode } from "react";
import { Text as mockText } from "react-native";

import SignInScreen from "@/app/sign-in";
import SignUpScreen from "@/app/sign-up";
import { i18n } from "@/localization";

const mockSignInWithPassword = jest.fn();
const mockSignUp = jest.fn();

jest.mock("expo-router", () => {
  return {
    Link: ({ children }: { children: ReactNode }) => mockCreateElement(mockText, null, children),
    useRouter: () => ({ back: jest.fn() }),
  };
});

jest.mock("@/features/auth", () => {
  const actual = jest.requireActual("@/features/auth");

  return {
    ...actual,
    createAuthRedirectUrl: () => "doit4jesus://",
    useAuth: () => ({ configurationError: null }),
  };
});

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signUp: (...args: unknown[]) => mockSignUp(...args),
    },
  },
}));

describe("authentication form validation", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockSignInWithPassword.mockResolvedValue({ error: null });
    mockSignUp.mockResolvedValue({ data: { session: {} }, error: null });
    await i18n.changeLanguage("en");
  });

  it("shows live login validation errors and prevents an invalid submission", async () => {
    await render(<SignInScreen />);

    await fireEvent.changeText(screen.getByLabelText("Email"), "not-an-email");
    expect(screen.getByText("Enter a valid email address.")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Sign in" }));
    await waitFor(() => expect(screen.getByText("Enter your password.")).toBeTruthy());
    expect(mockSignInWithPassword).not.toHaveBeenCalled();
  });

  it("trims a valid login email before submitting it to Supabase", async () => {
    await render(<SignInScreen />);

    await fireEvent.changeText(screen.getByLabelText("Email"), "  pilgrim@example.com ");
    await fireEvent.changeText(screen.getByLabelText("Password"), "a-usable-password");
    await fireEvent.press(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() =>
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "pilgrim@example.com",
        password: "a-usable-password",
      }),
    );
  });

  it("blocks common and sequential signup passwords before calling Supabase", async () => {
    await render(<SignUpScreen />);

    await fireEvent.changeText(screen.getByLabelText("Email"), "pilgrim@example.com");
    await fireEvent.changeText(screen.getByLabelText("Password"), "Password123");
    expect(screen.getByText("Choose a password that is harder to guess.")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Create account" }));
    expect(mockSignUp).not.toHaveBeenCalled();

    await fireEvent.changeText(screen.getByLabelText("Password"), "123456");
    expect(screen.getByText("Choose a password that is harder to guess.")).toBeTruthy();
  });

  it("submits a safe, valid signup form to Supabase", async () => {
    await render(<SignUpScreen />);

    await fireEvent.changeText(screen.getByLabelText("Email"), "pilgrim@example.com");
    await fireEvent.changeText(screen.getByLabelText("Password"), "Graceful#Leaf");
    await fireEvent.press(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() =>
      expect(mockSignUp).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "pilgrim@example.com",
          password: "Graceful#Leaf",
        }),
      ),
    );
  });

  it("localizes signup validation feedback in Spanish", async () => {
    await i18n.changeLanguage("es");
    await render(<SignUpScreen />);

    await fireEvent.changeText(screen.getByLabelText("Correo electrónico"), "invalid");
    expect(screen.getByText("Escribe un correo electrónico válido.")).toBeTruthy();
  });
});
