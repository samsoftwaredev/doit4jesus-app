const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  globalIgnores([".expo/**", "coverage/**", "dist/**", "web-build/**"]),
  expoConfig,
  // Keep Prettier last so it disables ESLint formatting rules and reports only Prettier's output.
  prettierRecommended,
  {
    rules: {
      // These React Compiler rules flag the app's established async-loading and Reanimated patterns.
      // They remain independent of formatting, and enabling them would require broad behavioral refactors.
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react/no-unescaped-entities": "off",
    },
  },
]);
