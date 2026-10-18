const { mkdtempSync, rmSync, writeFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join, resolve } = require("node:path");
const { spawnSync } = require("node:child_process");
const { describe, expect, it } = require("@jest/globals");

describe("quality gate", () => {
  it("allows a push when outdated packages are the only warning", () => {
    const fakeBinDirectory = mkdtempSync(join(tmpdir(), "doit4jesus-quality-gate-"));
    const fakeNpmPath = join(fakeBinDirectory, "npm");

    writeFileSync(
      fakeNpmPath,
      [
        "#!/usr/bin/env sh",
        'if [ "$1" = "outdated" ]; then',
        '  printf \'%s\' \'{"example-package":{"current":"1.0.0","latest":"2.0.0"}}\'',
        "  exit 1",
        "fi",
        "exit 0",
      ].join("\n"),
      { mode: 0o755 },
    );

    try {
      const result = spawnSync(process.execPath, [resolve("scripts/quality-gate.mjs"), "--mode=push"], {
        encoding: "utf8",
        env: {
          ...process.env,
          PATH: `${fakeBinDirectory}:${process.env.PATH}`,
        },
      });
      const output = `${result.stdout}${result.stderr}`;

      expect(result.status).toBe(0);
      expect(output).toContain("Warning: outdated packages detected:");
      expect(output).toContain("Quality checks passed with warnings. The push may proceed.");
      expect(output).not.toContain("Push blocked");
    } finally {
      rmSync(fakeBinDirectory, { recursive: true, force: true });
    }
  });
});
