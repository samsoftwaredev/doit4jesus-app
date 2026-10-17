const mockCreateUrl = jest.fn(() => "doit4jesus://");
const mockMaybeCompleteAuthSession = jest.fn();
const mockOpenAuthSessionAsync = jest.fn();
const mockSetSession = jest.fn();
const mockSignInWithOAuth = jest.fn();

jest.mock("expo-linking", () => ({
  createURL: mockCreateUrl,
}));

jest.mock("expo-web-browser", () => ({
  maybeCompleteAuthSession: mockMaybeCompleteAuthSession,
  openAuthSessionAsync: mockOpenAuthSessionAsync,
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      setSession: mockSetSession,
      signInWithOAuth: mockSignInWithOAuth,
    },
  },
  supabaseConfigurationError: null,
}));

const { readAuthParameters, startGoogleOAuth } = jest.requireActual<typeof import("@/features/auth/auth-provider")>(
  "@/features/auth/auth-provider",
);

describe("Supabase auth deep links", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetSession.mockResolvedValue({ data: { session: { access_token: "access" } }, error: null });
  });

  it("reads recovery tokens from the URL fragment", () => {
    const parameters = readAuthParameters(
      "doit4jesus://reset-password#access_token=access&refresh_token=refresh&type=recovery",
    );

    expect(parameters.get("access_token")).toBe("access");
    expect(parameters.get("refresh_token")).toBe("refresh");
    expect(parameters.get("type")).toBe("recovery");
  });

  it("reads a PKCE code from the query string", () => {
    expect(readAuthParameters("doit4jesus://?code=verification-code").get("code")).toBe("verification-code");
  });

  it("opens Google OAuth and restores the returned Supabase session", async () => {
    mockSignInWithOAuth.mockResolvedValue({ data: { url: "https://accounts.example/google" }, error: null });
    mockOpenAuthSessionAsync.mockResolvedValue({
      type: "success",
      url: "doit4jesus://#access_token=access&refresh_token=refresh",
    });

    await startGoogleOAuth();

    expect(mockCreateUrl).toHaveBeenCalledWith("/");
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: "doit4jesus://",
        skipBrowserRedirect: true,
      },
    });
    expect(mockOpenAuthSessionAsync).toHaveBeenCalledWith("https://accounts.example/google", "doit4jesus://");
    expect(mockSetSession).toHaveBeenCalledWith({ access_token: "access", refresh_token: "refresh" });
  });

  it("leaves the session unchanged when Google OAuth is canceled", async () => {
    mockSignInWithOAuth.mockResolvedValue({ data: { url: "https://accounts.example/google" }, error: null });
    mockOpenAuthSessionAsync.mockResolvedValue({ type: "cancel" });

    await startGoogleOAuth();

    expect(mockSetSession).not.toHaveBeenCalled();
  });

  it("reports an OAuth setup error before opening the browser", async () => {
    mockSignInWithOAuth.mockResolvedValue({ data: { url: null }, error: new Error("Google provider is disabled.") });

    await expect(startGoogleOAuth()).rejects.toThrow("Google provider is disabled.");
    expect(mockOpenAuthSessionAsync).not.toHaveBeenCalled();
  });
});
