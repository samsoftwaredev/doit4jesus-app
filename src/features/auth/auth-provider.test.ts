const mockCreateUrl = jest.fn(() => "doit4jesus://");
const mockOpenBrowserAsync = jest.fn();
const mockSetSession = jest.fn();
const mockSignInWithOAuth = jest.fn();

jest.mock("expo-linking", () => ({
  createURL: mockCreateUrl,
}));

jest.mock("expo-web-browser", () => ({
  openBrowserAsync: mockOpenBrowserAsync,
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

const { createAuthRedirectUrl, readAuthParameters, startGoogleOAuth } = jest.requireActual<
  typeof import("@/features/auth/auth-provider")
>("@/features/auth/auth-provider");

describe("Supabase auth deep links", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetSession.mockResolvedValue({ data: { session: { access_token: "access" } }, error: null });
  });

  it("always sends successful Google authentication to the canonical web app", async () => {
    mockSignInWithOAuth.mockResolvedValue({ data: { url: "https://accounts.example/google" }, error: null });
    mockOpenBrowserAsync.mockResolvedValue({ type: "opened" });

    await startGoogleOAuth();

    expect(mockCreateUrl).not.toHaveBeenCalled();
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: "https://app.doitforjesus.com/",
        skipBrowserRedirect: true,
      },
    });
    expect(mockOpenBrowserAsync).toHaveBeenCalledWith("https://accounts.example/google");
    expect(mockSetSession).not.toHaveBeenCalled();
  });

  it("keeps local web callbacks on the development server", () => {
    mockCreateUrl.mockReturnValueOnce("http://localhost:8081/reset-password");

    expect(createAuthRedirectUrl("/reset-password")).toBe("http://localhost:8081/reset-password");
  });

  it("does not canonicalize obsolete legacy web callback URLs", () => {
    mockCreateUrl.mockReturnValueOnce("https://www.doitforjesus.com/app/reset-password");

    expect(createAuthRedirectUrl("/reset-password")).toBe("https://www.doitforjesus.com/app/reset-password");
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

  it("reports an OAuth setup error before opening the browser", async () => {
    mockSignInWithOAuth.mockResolvedValue({ data: { url: null }, error: new Error("Google provider is disabled.") });

    await expect(startGoogleOAuth()).rejects.toThrow("Google provider is disabled.");
    expect(mockOpenBrowserAsync).not.toHaveBeenCalled();
  });
});
