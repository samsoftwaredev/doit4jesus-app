import { logDevelopmentError } from "./development-logger";

const developmentGlobal = globalThis as typeof globalThis & { __DEV__: boolean };

describe("logDevelopmentError", () => {
  const originalDev = developmentGlobal.__DEV__;
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    developmentGlobal.__DEV__ = originalDev;
    process.env.NODE_ENV = originalNodeEnv;
    jest.restoreAllMocks();
  });

  it("writes a contextual error to the console during development", () => {
    const error = new Error("Request failed");
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    developmentGlobal.__DEV__ = true;
    process.env.NODE_ENV = "development";

    logDevelopmentError("loading the daily liturgy", error);

    expect(consoleError).toHaveBeenCalledWith("[DoIt4Jesus] loading the daily liturgy", error);
  });

  it("does not write errors to the console in production", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    developmentGlobal.__DEV__ = false;
    process.env.NODE_ENV = "production";

    logDevelopmentError("loading the daily liturgy", new Error("Request failed"));

    expect(consoleError).not.toHaveBeenCalled();
  });
});
