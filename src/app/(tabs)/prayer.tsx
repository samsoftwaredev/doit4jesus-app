import { Redirect } from "expo-router";

/** Preserves legacy Prayer links while the consolidated experience lives on Home. */
export default function PrayerTabRoute() {
  return <Redirect href="/home" />;
}
