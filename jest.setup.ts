import "react-native-gesture-handler/jestSetup";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock("expo-haptics", () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock("react-native-reanimated", () => {
  const ReactNative = jest.requireActual("react-native");
  const sharedValue = (value: unknown) => ({ value });
  const transition = { duration: () => undefined };

  return {
    ...ReactNative.Animated,
    default: ReactNative.Animated,
    FadeIn: transition,
    FadeInUp: transition,
    cancelAnimation: jest.fn(),
    useAnimatedStyle: (updater: () => unknown) => updater(),
    useEvent: (handler: unknown) => handler,
    useReducedMotion: jest.fn(() => true),
    useSharedValue: sharedValue,
    withRepeat: (value: unknown) => value,
    withSequence: (...values: unknown[]) => values.at(-1),
    withSpring: (value: unknown) => value,
    withTiming: (value: unknown) => value,
  };
});
