import { readAuthParameters } from "@/features/auth/auth-provider";

describe("Supabase auth deep links", () => {
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
});
