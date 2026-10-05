---
id: PREFIX-000
title: "Verb phrase describing the behavior under test"
feature: feature-area
priority: P1
tags: [regression]
envs: [all]
automated: false
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

## Goal
One sentence: the user-visible behavior this test proves.

## Preconditions
- Only what no step sets up: an account with a given role, stock or records that must already exist.
- Login is a step, not a precondition.

## Data
- Inputs the steps use. Write `<unique>` for anything that must differ per run; the spec generates it.
- Credentials: name the `.env` variables (e.g. SHOP_EMAIL), never the values.

## Steps
1. Action phrased the way a user does it (open the home page, log in as the test account).
2. Next action with concrete data (search for **plug** and open the first result).
3. Optional inline check on a step: -> Expect: the cart badge shows 1.

## Expected
- Observable outcome: exact text, count, URL, enabled/disabled state.
- Persisted outcome where it matters: still true after a reload.

## Notes
Optional: spec file and page objects once automated, related bugs (BUG-003), ticket links, quirks the spec works around.

<!--
Rules (docs/conventions.md):
- File: projects/<slug>/cases/<feature>/<ID>-<short-slug>.md. Required by lint: id, title, feature, priority, tags,
  a "## Steps" section with numbered steps, a "## Expected" section with at least one bullet.
- One behavior per test; independent of other tests; no selectors or waits here (they go in page objects).
- Tags: smoke | regression, plus writes when the test changes server data.
- Automated = a Playwright test titled "<ID>: ..." in tests/e2e; then set automated: true.
Delete this comment in real test cases.
-->
