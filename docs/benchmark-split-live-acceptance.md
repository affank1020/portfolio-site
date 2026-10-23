# Benchmark split-artifact live consumer acceptance

This PR is a **documentation-only smoke test** for the trusted Benchmark workflows installed by [portfolio-site PR #5](https://github.com/affank1020/portfolio-site/pull/5). Its purpose is to produce a fresh pull-request `CI` event **after** those workflows became active on `main`, without modifying application behavior, test logic, or permissions.

**Exact consumer base:** `bdccbb943d0836023d8d7ad213aa7fd11c10941c` (PR #5 merge). The trusted reusable publisher and lifecycle matcher are pinned to reviewed [Benchmark PR #11 merge](https://github.com/affank1020/benchmark/commit/bff973c94597897c095f76e0538ec145d7ecdc45). No GitHub Release/tag is created here.

## Acceptance checklist

- [ ] This PR's `CI` passes with a read-only token and uploads distinct `benchmark-junit` and `benchmark-lcov` artifacts, alongside legacy `benchmark-ci`.
- [ ] The `Benchmark PR Lifecycle` trusted `workflow_run` creates or updates the bot's **single** waiting-comment thread (it may skip if CI finishes before the event is processed).
- [ ] The `Benchmark PR Report` reusable trusted publisher completes and consumes the exact separate test and coverage **artifact IDs**, using distinct `artifacts/tests` and `artifacts/coverage` directories.
- [ ] Exactly one bot-owned report comment appears in **Ready** state for the current PR head, with actual JUnit test totals and LCOV line/function/branch percentages.
- [ ] Publisher selects a successful `main` **push CI on this exact base SHA** for its `benchmark-lcov` artifact; absence or ambiguity must be reported as unavailable, never replaced by an older base.
- [ ] Push a **second documentation-only commit** and verify the next PR CI updates the **same comment ID** with the new SHA and run attempt; stale results must not overwrite the latest comment.
- [ ] Document any remaining real fork-originated PR validation separately; this same-repository PR does not prove fork behavior.

## Evidence

To be filled with specific CI runs, artifact IDs, trusted lifecycle/publisher runs, and the bot-owned comment after this PR executes. A successful `CI` job by itself does **not** prove the new default-branch publisher works.

## Rollback / boundaries

The installed CI uploads, trusted `workflow_run` subscriptions and comment permissions are unchanged by this PR. The application and existing tests are untouched. Do not treat this test as permission to create a release tag, merge unrelated PRs or upgrade the immutable Benchmark source pin.
