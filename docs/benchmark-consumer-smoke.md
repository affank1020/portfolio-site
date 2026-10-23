# Benchmark external consumer smoke validation

This branch is a **non-invasive, review-only integration pilot** for the separate [Benchmark PR Quality Report](https://github.com/affank1020/benchmark) project.

The existing `npm run check` command still executes lint, TypeScript checks and the same coverage-threshold-enforced Node.js test suite exactly once. Its Node test reporter now additionally emits `junit.xml` and `lcov.info`. A read-only CI job uploads both files as `benchmark-ci`, even after a failure when results were produced.

The trusted `.github/workflows/benchmark-report.yml` calls the reviewed, immutable Benchmark PR #6 release on completion of `CI` for a pull request. It requests `issues: write` and `pull-requests: write` **only in the post-CI workflow**, not the PR test job.

## Activation and safe verification

1. Review this PR separately from Benchmark PR #7 and confirm no lint, type, test, build or coverage-threshold regression.
2. **Do not expect a Benchmark bot report on this integration PR**: GitHub only activates its `workflow_run` publisher when the workflow exists on the default branch. This is intentional.
3. After this PR is merged, confirm a successful `main` push CI run uploads one `benchmark-ci` artifact containing `junit.xml` and `lcov.info`. Earlier base commits lack the artifact.
4. Open a *new* PR against that baseline. Verify the separate trusted reporter updates one quality comment showing coverage baseline and percentage-point changes. Push another commit and check it updates rather than duplicates the comment.
5. To validate fork support, open a new PR from a separate fork. Verify that PR CI stays read-only and the trusted publisher associates the fork's repo ID, branch and head SHA with the correct open PR without executing fork code or receiving fork secrets.
6. Capture GitHub CI/publisher URLs and report comments in the [Benchmark PR #7 consumer validation plan](https://github.com/affank1020/benchmark/pull/7); record missing live scenarios explicitly.

**Important:** Portfolio-site's current Node coverage includes whatever sources the tests load. This pilot validates the GitHub integration plumbing; its percentages are **not** proof of complete coverage across Next.js pages and UI components. It does not change the existing numeric coverage thresholds.

## Live external-consumer acceptance (2026-10-22)

**Prerequisite confirmed:** Portfolio-site PR #2 merged to `main` at `69d6e4f0af9b5ea7a1b25329246a73bed79d97ac`. The matching [successful `CI` push run](https://github.com/affank1020/portfolio-site/actions/runs/39769685504) uploaded `benchmark-ci` artifact ID `12421089190` with the producer-side JUnit and LCOV inputs. This is the exact base SHA that Benchmark's trusted reporter must use; no earlier commit is an acceptable substitute.

**This validation PR** changes documentation only and deliberately preserves test execution, reporting workflow, source code, and numerical coverage thresholds. It is intended to generate a fresh PR CI result so the already-installed trusted `workflow_run` publisher can perform the real cross-repository download and comment publication.

Acceptance checks for this PR:

- The PR's own CI completes with a read-only token and publishes `benchmark-ci` for the PR head.
- The separately triggered `Benchmark PR Report` job runs from the consumer's default branch, selects this exact open PR, finds the `main` baseline at `69d6e4f`, and downloads the correct baseline artifact.
- Exactly one bot-owned report comment is created containing actual current and baseline coverage and signed percentage-point deltas (zero is valid when code is unchanged).
- A subsequent commit to this same PR causes the bot to **update that same comment ID**, without duplicating comments. Stale PR heads must not publish.
- This test does **not** verify a fork-originated PR. Fork token permissions, `workflow_run.pull_requests` omissions and ambiguous-head handling remain separate live acceptance items.

**First live consumer report verified:** [PR #3 initial CI](https://github.com/affank1020/portfolio-site/actions/runs/39770049134) passed and uploaded current artifact `12421524419`. The separate [trusted reusable publisher](https://github.com/affank1020/portfolio-site/actions/runs/39770225759) succeeded, including exact-base selection, baseline download, and comment publication.

It created [Benchmark quality report comment #6339543108](https://github.com/affank1020/portfolio-site/pull/3#issuecomment-6339543108): 23 passing tests; line coverage 100.00% current and base (+0.00 pp); function coverage 100.00% (+0.00 pp); and branch coverage 96.00% (+0.00 pp). This proves the real second-repository producer-to-publisher-to-comment path with a complete base comparison.

**Comment-update test:** This documentation-only follow-up commit is deliberately the second head revision of PR #3. Re-run CI and the trusted publisher, then verify that existing comment **ID `6339543108`** is updated in place and no second Benchmark-owned report comment appears. Record the result on PR #3. Do not infer successful comment deduplication from unit tests alone.

**Still outstanding:** a genuinely fork-originated PR on this consumer, plus its token-permission and ambiguous-identity checks. Do not merge this validation PR solely to claim fork support.

## Reviewed Benchmark PR #11 consumer-rollout pilot (pending merge)

This separate rollout PR upgrades the trusted reusable publisher from the reviewed PR #6 SHA to [Benchmark PR #11 merge](https://github.com/affank1020/benchmark/commit/bff973c94597897c095f76e0538ec145d7ecdc45), and enables the [trusted CI-start lifecycle](https://github.com/affank1020/benchmark/blob/bff973c94597897c095f76e0538ec145d7ecdc45/examples/lifecycle-pr.yml). Both references use **full immutable SHAs**, not `@main`; the privileged workflows only run on the consumer's default branch after this PR merges.

The existing `npm run check` still runs lint, TypeScript and one coverage-threshold-enforced Node test suite. CI now uploads two **independent** artifacts, `benchmark-junit` (root `junit.xml`) and `benchmark-lcov` (root `lcov.info`), in addition to the legacy combined `benchmark-ci`. This intentionally duplicates small *uploads*, **not test executions**. The combined artifact lets the currently deployed old default-branch publisher continue reporting during review; the new caller selects the separate artifact IDs and uses `benchmark-lcov` for exact-base coverage lookup.

**The repository has not yet installed an official GitHub Release artifact.** The pinned SHA is the independently reviewed Benchmark merge commit; a version tag and GitHub Release require a separate deliberate publication step. Installing release-generated workflow YAML can be handled in a subsequent reviewed PR once published.

### Acceptance after merging this PR

1. Check that the exact merge commit's **main push CI** passes and uploads `benchmark-junit`, `benchmark-lcov`, and `benchmark-ci`. Baseline coverage comparisons cannot succeed against an older base SHA that lacks `benchmark-lcov`.
2. Open a **new** minimal PR based on that merge SHA. Since `workflow_run` only activates workflows already on the default branch, this rollout PR itself cannot prove the new lifecycle or new reusable caller.
3. Confirm the CI-start lifecycle creates `Waiting for CI results` on a **single bot-owned comment**, followed by `Processing CI results` and the completed `Ready` report on **the same comment ID**. Fast CI may skip the intermediate states; the final report is mandatory.
4. Inspect the post-CI job to verify two distinct validated artifact IDs and downloads under `artifacts/tests` and `artifacts/coverage`. Confirm real test totals and line/function/branch metrics appear, and that exact-current-base `benchmark-lcov` supports a signed coverage delta.
5. Push a new commit to the test PR and ensure stale CI attempts never overwrite its latest report. Then test a **real fork-originated PR**, verifying source repo ID, branch and head SHA, read-only PR CI and no execution of fork code with comment permissions.
6. If a pilot fails, roll back only the trusted consumer workflow pin/lifecycle, or revert the separate artifact inputs. Keep read-only PR CI and the combined artifact unchanged until old consumers are retired.

**Unverified at PR creation:** activation of the new default-branch workflows, first live split-artifact selection, rerun/fork conditions, and any GitHub Release tag/download. These need explicit post-merge evidence.
