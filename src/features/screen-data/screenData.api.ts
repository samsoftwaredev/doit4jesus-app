import { getSupabaseAccessToken } from "@/lib/supabase";

export type ScreenDataScreen = "community" | "home" | "prayer";

export type ScreenDataSection = { data: unknown; meta?: unknown } | null;

export type ScreenDataError = { code: string; message: string };

export type ScreenDataResponse = {
  errors: Record<string, ScreenDataError>;
  screen: ScreenDataScreen;
  sections: Record<string, ScreenDataSection>;
};

type ScreenDataRequest = {
  country?: string;
  diocese?: string;
  locale?: string;
  screen: ScreenDataScreen;
  selectedMonth?: number;
  selectedYear?: number;
};

/** Returns whether a JSON value is a non-null record. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Parses a safe per-section error returned by the aggregate endpoint. */
function parseError(value: unknown): ScreenDataError {
  if (!isRecord(value) || typeof value.code !== "string" || typeof value.message !== "string") {
    throw new Error("The screen-data endpoint returned an invalid section error.");
  }
  return { code: value.code, message: value.message };
}

/** Validates the aggregate envelope without imposing each feature's payload contract here. */
function parseScreenData(value: unknown, requestedScreen: ScreenDataScreen): ScreenDataResponse {
  if (!isRecord(value) || !isRecord(value.data) || !isRecord(value.data.sections)) {
    throw new Error("The screen-data endpoint returned invalid sections.");
  }
  if (value.data.screen !== requestedScreen) {
    throw new Error("The screen-data endpoint returned data for a different screen.");
  }
  const rawErrors = isRecord(value.meta) && isRecord(value.meta.errors) ? value.meta.errors : {};
  const errors = Object.fromEntries(Object.entries(rawErrors).map(([name, error]) => [name, parseError(error)]));
  const sections = Object.fromEntries(
    Object.entries(value.data.sections).map(([name, section]) => {
      if (section === null) return [name, null];
      if (!isRecord(section) || !("data" in section))
        throw new Error(`The screen-data endpoint returned an invalid ${name} section.`);
      return [name, { data: section.data, ...(section.meta === undefined ? {} : { meta: section.meta }) }];
    }),
  );
  return { errors, screen: requestedScreen, sections };
}

/** Loads all initial data for one authenticated screen while retaining independent section outcomes. */
export async function fetchScreenData(request: ScreenDataRequest): Promise<ScreenDataResponse> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Set EXPO_PUBLIC_API_URL before loading screen data.");
  const query = new URLSearchParams({ screen: request.screen });
  (["country", "diocese", "locale", "selectedMonth", "selectedYear"] as const).forEach((key) => {
    const value = request[key];
    if (value !== undefined) query.set(key, String(value));
  });
  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/screen-data?${query}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${await getSupabaseAccessToken()}` },
    method: "GET",
  });
  if (!response.ok) throw new Error(`Unable to load screen data (${response.status}).`);
  return parseScreenData((await response.json()) as unknown, request.screen);
}
