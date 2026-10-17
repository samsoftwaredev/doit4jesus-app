import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { createElement as mockCreateElement, type ReactNode } from "react";
import { Text as mockText } from "react-native";

import SignInScreen from "@/app/sign-in";
import SignUpScreen from "@/app/sign-up";
import { i18n } from "@/localization";

const mockSignInWithPassword = jest.fn();
const mockSignUp = jest.fn();
const mockStartGoogleOAuth = jest.fn();

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
    startGoogleOAuth: (...args: unknown[]) => mockStartGoogleOAuth(...args),
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
    mockStartGoogleOAuth.mockResolvedValue(undefined);
    await i18n.changeLanguage("en");
  });

  it.each([
    ["sign-in", SignInScreen],
    ["sign-up", SignUpScreen],
  ])("starts Google OAuth from the %s screen", async (_screenName, ScreenComponent) => {
    await render(<ScreenComponent />);

    await fireEvent.press(screen.getByRole("button", { name: "Continue with Google" }));

    await waitFor(() => expect(mockStartGoogleOAuth).toHaveBeenCalledTimes(1));
  });

  it("shows Google OAuth failures and restores the Google action", async () => {
    mockStartGoogleOAuth.mockRejectedValueOnce(new Error("Google sign-in is unavailable."));
    await render(<SignInScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Continue with Google" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Google sign-in is unavailable.");
    expect(screen.getByRole("button", { name: "Continue with Google" })).not.toBeDisabled();
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

    expect(screen.getByRole("button", { name: "Continuar con Google" })).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText("Correo electrónico"), "invalid");
    expect(screen.getByText("Escribe un correo electrónico válido.")).toBeTruthy();
  });
});
