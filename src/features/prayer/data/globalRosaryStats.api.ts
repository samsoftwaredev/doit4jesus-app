import { getSupabaseAccessToken } from "@/lib/supabase";

export interface GlobalRosaryContribution {
  percentage: number;
  rosariesPrayed: number;
}

export interface GlobalRosaryStats {
  currentUserContribution: GlobalRosaryContribution | null;
  totalRosariesPrayed: number;
}

/** Loads the global Rosary total and validates the authenticated user's count and percentage contribution. */
export async function getGlobalRosaryStats(): Promise<GlobalRosaryStats> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Set EXPO_PUBLIC_API_URL before loading global Rosary statistics.");

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/rosary/stats`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${await getSupabaseAccessToken()}`,
    },
    method: "GET",
  });

  if (!response.ok) throw new Error(`Unable to load global Rosary statistics (${response.status}).`);

  const payload = (await response.json()) as unknown;
  if (typeof payload !== "object" || payload === null || !("data" in payload)) {
    throw new Error("The endpoint returned invalid global Rosary statistics.");
  }

  const data = payload.data;
  if (
    typeof data !== "object" ||
    data === null ||
    !("totalRosariesPrayed" in data) ||
    !("currentUserContribution" in data)
  ) {
    throw new Error("The endpoint returned invalid global Rosary statistics.");
  }

  const totalRosariesPrayed = data.totalRosariesPrayed;
  const currentUserContribution = data.currentUserContribution;
  if (typeof totalRosariesPrayed !== "number" || !Number.isFinite(totalRosariesPrayed)) {
    throw new Error("The endpoint returned invalid global Rosary statistics.");
  }

  if (currentUserContribution === null) return { currentUserContribution: null, totalRosariesPrayed };

  if (
    typeof currentUserContribution !== "object" ||
    !("percentage" in currentUserContribution) ||
    !("rosariesPrayed" in currentUserContribution) ||
    typeof currentUserContribution.percentage !== "number" ||
    !Number.isFinite(currentUserContribution.percentage) ||
    typeof currentUserContribution.rosariesPrayed !== "number" ||
    !Number.isFinite(currentUserContribution.rosariesPrayed)
  ) {
    throw new Error("The endpoint returned invalid global Rosary statistics.");
  }

  return {
    currentUserContribution: {
      percentage: currentUserContribution.percentage,
      rosariesPrayed: currentUserContribution.rosariesPrayed,
    },
    totalRosariesPrayed,
  };
}
