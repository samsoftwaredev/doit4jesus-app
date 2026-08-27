import { spawnSync } from "node:child_process";

const command = process.platform === "win32" ? "git.exe" : "git";
const result = spawnSync(command, ["rev-parse", "--is-inside-work-tree"], {
  encoding: "utf8",
  stdio: "pipe",
});

if (result.status !== 0 || result.stdout.trim() !== "true") {
  process.exit(0);
}

const configureHooks = spawnSync(command, ["config", "core.hooksPath", ".githooks"], {
  encoding: "utf8",
  stdio: "pipe",
});

if (configureHooks.status !== 0) {
  console.warn("Warning: Git hooks were not enabled automatically.");
  if (configureHooks.stderr) console.warn(configureHooks.stderr.trim());
  process.exit(0);
}

console.log("Git hooks enabled at .githooks.");
