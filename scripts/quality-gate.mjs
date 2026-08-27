import { spawnSync } from "node:child_process";

const modeArgument = process.argv.find((argument) => argument.startsWith("--mode="));
const mode = modeArgument?.split("=")[1] ?? "commit";
const dependenciesOnly = process.argv.includes("--dependencies");

if (!dependenciesOnly && mode !== "commit" && mode !== "push") {
  console.error("Usage: node scripts/quality-gate.mjs --mode=commit|push");
  process.exit(2);
}

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function runNpm(label, args) {
  console.log(`\n→ ${label}`);
  const result = spawnSync(npmCommand, args, { stdio: "inherit" });
  return result.status === 0;
}

function checkOutdatedPackages() {
  console.log("\n→ Checking for outdated packages");
  const result = spawnSync(npmCommand, ["outdated", "--json", "--long"], {
    encoding: "utf8",
    stdio: "pipe",
  });
  const stdout = result.stdout?.trim() ?? "";
  const stderr = result.stderr?.trim() ?? "";

  if (!stdout && result.status === 0) {
    console.log("  No outdated packages found.");
    return [];
  }

  try {
    const outdated = JSON.parse(stdout);
    const entries = Object.entries(outdated);

    if (entries.length === 0) {
      console.log("  No outdated packages found.");
      return [];
    }

    console.warn("  Warning: outdated packages detected:");
    for (const [name, details] of entries) {
      const current = details.current ?? "missing";
      const latest = details.latest ?? details.wanted ?? "unknown";
      console.warn(`    - ${name}: ${current} → ${latest}`);
    }
    return [`${entries.length} outdated package${entries.length === 1 ? "" : "s"}`];
  } catch {
    const detail = stderr || stdout || "npm outdated could not complete.";
    console.warn(`  Warning: unable to check outdated packages: ${detail}`);
    return ["unable to check outdated packages"];
  }
}

const dependencyWarnings = checkOutdatedPackages();

if (dependenciesOnly) {
  process.exit(0);
}

const qualityChecks = [
  ["Prettier formatting", ["run", "format:check"]],
  ["TypeScript", ["run", "check:types"]],
  ["ESLint", ["run", mode === "push" ? "lint:strict" : "lint"]],
  ["Unit tests", ["test", "--", "--silent"]],
];

const failedChecks = qualityChecks.map(([label, args]) => (runNpm(label, args) ? null : label)).filter(Boolean);

if (failedChecks.length > 0) {
  console.error(`\nQuality gate failed: ${failedChecks.join(", ")}.`);
  process.exit(1);
}

if (mode === "push" && dependencyWarnings.length > 0) {
  console.error(
    `\nPush blocked because of warning${dependencyWarnings.length === 1 ? "" : "s"}: ${dependencyWarnings.join(", ")}.`,
  );
  process.exit(1);
}

if (dependencyWarnings.length > 0) {
  console.warn("\nQuality checks passed with warnings. The commit may proceed.");
} else {
  console.log("\nQuality checks passed.");
}
