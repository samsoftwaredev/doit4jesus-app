/**
 * Writes a caught error with a stable operation label while developing the app.
 * Expo replaces the development guard in production builds, while Jest remains quiet during automated checks.
 */
export function logDevelopmentError(context: string, error: unknown): void {
  if (__DEV__ && process.env.NODE_ENV !== "test") {
    console.error(`[DoIt4Jesus] ${context}`, error);
  }
}
