import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const load = (name: string) => readFile(new URL("../.github/workflows/" + name, import.meta.url), "utf8");

test("Benchmark consumer CI retains one test run and publishes legacy plus split artifacts", async () => {
  const ci = await load("ci.yml");
  assert.equal((ci.match(/run: npm run check/g) || []).length, 1);
  assert.equal((ci.match(/uses: actions\/upload-artifact@v4/g) || []).length, 3);
  for (const name of ["benchmark-ci", "benchmark-junit", "benchmark-lcov"]) {
    assert.match(ci, new RegExp("name: " + name + "(?:\\n|$)"));
  }
  for (const [name, path] of [["benchmark-junit", "junit.xml"], ["benchmark-lcov", "lcov.info"]]) {
    // Match each independent artifact on the path and ensure upload-on-failure.
    const section = ci.slice(ci.indexOf("          name: " + name));
    assert.match(section, new RegExp("^          name: " + name + "\\n          path: " + path, "m"));
    assert.match(section, /if-no-files-found: ignore/);
  }
  assert.match(ci, /      - name: Upload Benchmark JUnit results\n        if: always\(\)/);
  assert.match(ci, /      - name: Upload Benchmark LCOV results\n        if: always\(\)/);
  assert.match(ci, /      - name: Upload legacy Benchmark report inputs\n        if: always\(\)/);
});

test("trusted Benchmark reporter uses reviewed SHA and split artifact inputs", async () => {
  const yaml = await load("benchmark-report.yml");
  assert.match(yaml, /reusable-report\.yml@bff973c94597897c095f76e0538ec145d7ecdc45/);
  assert.match(yaml, /tests_artifact_name: benchmark-junit/);
  assert.match(yaml, /coverage_artifact_name: benchmark-lcov/);
  assert.match(yaml, /artifact_name: benchmark-ci/);
  assert.match(yaml, /workflow_run:\s*\n\s*workflows: \[CI\]\s*\n\s*types: \[completed\]/);
  for (const permission of ["contents: read", "actions: read", "issues: write", "pull-requests: write"]) {
    assert.ok(yaml.includes(permission), permission);
  }
  assert.doesNotMatch(yaml, /pull_request_target:|@main|@master|\n\s*run:/);
});

test("CI-start lifecycle is immutable, API-only and serializes with the reporter", async () => {
  const yaml = await load("benchmark-lifecycle.yml");
  assert.match(yaml, /workflow_run:\s*\n\s*workflows: \[CI\]\s*\n\s*types: \[requested, in_progress\]/);
  assert.match(yaml, /ref: bff973c94597897c095f76e0538ec145d7ecdc45/);
  assert.match(yaml, /queue: max/);
  assert.match(yaml, /cancel-in-progress: false/);
  assert.match(yaml, /group: benchmark-report-\$\{\{ github\.repository_id \}\}-\$\{\{ github\.event\.workflow_run\.head_repository\.id \}\}-\$\{\{ github\.event\.workflow_run\.head_branch \}\}/);
  assert.match(yaml, /persist-credentials: false/);
  assert.doesNotMatch(yaml, /pull_request_target:|@main|@master|\n\s*run:/);
  assert.match(yaml, /policy\.resolveRunPr\(run, github, context\.repo\)/);
  assert.match(yaml, /policy\.matchesRunToPr\(run, current\)/);
});
