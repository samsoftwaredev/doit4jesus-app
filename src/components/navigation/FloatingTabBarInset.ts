import { createContext, useContext } from "react";

/** Space a floating bottom tab bar occupies over screen content, or zero when no such bar is shown. */
const FloatingTabBarInsetContext = createContext(0);

export const FloatingTabBarInsetProvider = FloatingTabBarInsetContext.Provider;

/** Returns the bottom space screens should reserve so scrolling content clears the floating tab bar. */
export function useFloatingTabBarInset(): number {
  return useContext(FloatingTabBarInsetContext);
}
