# Benchmark split-artifact live consumer acceptance

This PR is a **documentation-only smoke test** for the trusted Benchmark workflows installed by [portfolio-site PR #5](https://github.com/affank1020/portfolio-site/pull/5). Its purpose is to produce a fresh pull-request `CI` event **after** those workflows became active on `main`, without modifying application behavior, test logic, or permissions.

**Exact consumer base:** `bdccbb943d0836023d8d7ad213aa7fd11c10941c` (PR #5 merge). The trusted reusable publisher and lifecycle matcher are pinned to reviewed [Benchmark PR #11 merge](https://github.com/affank1020/benchmark/commit/bff973c94597897c095f76e0538ec145d7ecdc45). No GitHub Release/tag is created here.

## Acceptance checklist

- [x] This PR's `CI` passes with a read-only token and uploads distinct `benchmark-junit` and `benchmark-lcov` artifacts, alongside legacy `benchmark-ci`.
- [x] The `Benchmark PR Lifecycle` trusted `workflow_run` creates or updates the bot's **single** waiting-comment thread (it may skip if CI finishes before the event is processed).
- [x] The `Benchmark PR Report` reusable trusted publisher completes and consumes the exact separate test and coverage **artifact IDs**, using distinct `artifacts/tests` and `artifacts/coverage` directories.
- [x] Exactly one bot-owned report comment appears in **Ready** state for the current PR head, with actual JUnit test totals and LCOV line/function/branch percentages.
- [x] Publisher selects a successful `main` **push CI on this exact base SHA** for its `benchmark-lcov` artifact; absence or ambiguity must be reported as unavailable, never replaced by an older base.
- [ ] Push a **second documentation-only commit** and verify the next PR CI updates the **same comment ID** with the new SHA and run attempt; stale results must not overwrite the latest comment.
- [ ] Document any remaining real fork-originated PR validation separately; this same-repository PR does not prove fork behavior.

## Evidence

### First live PR head: `7212268ab7682e597b48cd2a2ba037fa7b38ca43`

- [PR CI `39935317672`](https://github.com/affank1020/portfolio-site/actions/runs/39935317672) passed: quality and production-build jobs succeeded, with the read-only PR CI workflow unchanged.
- The CI run uploaded **three** distinct artifacts: `benchmark-junit` ID `12493960290` (root `junit.xml`), `benchmark-lcov` ID `12493252162` (root `lcov.info`), and the original `benchmark-ci` (legacy compatibility).
- [Trusted CI-start lifecycle `39935321698`](https://github.com/affank1020/portfolio-site/actions/runs/39935321698) succeeded and created bot-owned comment **ID `6362268662`** in `benchmark-state:waiting` for exact CI run `39935317672:1`.
- [Trusted completed reporter `39935503771`](https://github.com/affank1020/portfolio-site/actions/runs/39935503771) succeeded, including **both** independent ID-based downloads, exact-base lookup and download, processing update, generation and final comment publication.
- The reporter explicitly downloaded `benchmark-junit` **ID `12493960290`** into `artifacts/tests` and `benchmark-lcov` **ID `12493252162`** into `artifacts/coverage`; the exact-base `main` push [CI `39935022395`](https://github.com/affank1020/portfolio-site/actions/runs/39935022395) for SHA `bdccbb943d0836023d8d7ad213aa7fd11c10941c` provided `benchmark-lcov` **ID `12493043290`** into `baseline`.
- The [same single bot comment `6362268662`](https://github.com/affank1020/portfolio-site/pull/6#issuecomment-6362268662) reached `benchmark-state:ready` for the first head: **26 passed / 0 failed**, line coverage **100.00%**, function **100.00%**, branch **96.00%**, baseline deltas **+0.00 pp**. This validates unchanged coverage, not a manipulated coverage regression.

### Second-run update and fork scope

This documentation update is the **second PR head**. Its fresh CI run should update **the same bot comment** with the new head/run identity rather than create a second report. Verification of the update will be recorded in the PR discussion, avoiding a third unnecessary CI trigger.

A genuinely fork-originated PR and a nonzero baseline delta are **not** established by this same-repository documentation test. They remain separate acceptance work; do not infer either from the successful zero-delta report.

## Rollback / boundaries

The installed CI uploads, trusted `workflow_run` subscriptions and comment permissions are unchanged by this PR. The application and existing tests are untouched. Do not treat this test as permission to create a release tag, merge unrelated PRs or upgrade the immutable Benchmark source pin.
