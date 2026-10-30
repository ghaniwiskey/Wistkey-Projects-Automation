---
id: BUG-000
title: "What is wrong, where (specific and searchable)"
severity: major
status: open
env: staging
url: https://example.com/path
found: YYYY-MM-DD
foundBy: "runs/<run-folder> or explorations/<file>"
tests: []
frequency: always
---

## Summary
One or two plain-language sentences describing the trigger and user impact. Follow docs/bug-report-style.md.

## Steps to reproduce
Starting state: required account role, item or configuration; only what must exist before the actions.

1. Log in with your account for the required role, if needed.
2. Describe the exact user action and input in plain language.
3. Describe the action that exposes the failure.

## Expected
What should happen, with the source of truth if known (spec, ticket, user manual, previous behavior).

## Actual
What happened instead. Quote exact error text.

## Evidence
- Screenshot: ![failure](../runs/<run-folder>/screenshots/<file>.png)
- Trace (failed Playwright runs): ../runs/<run-folder>/traces/<file>.zip
- Console errors:
- Failed requests (method, URL, status, response message):

## Environment
- Base URL / build or version if visible:
- Browser: Playwright project name (e.g. scg-store = Desktop Chrome), viewport

## History
- YYYY-MM-DD: filed from <run>.

<!--
Rules (docs/conventions.md):
- File: projects/<slug>/bugs/BUG-<NNN>-<slug>.md. Search open bugs for the same symptom first.
- severity: critical | major | minor | trivial. status: open | fixed | verified | wont-fix | duplicate.
- frequency: always | intermittent | once. tests: IDs of the test cases that show the bug (used for retests).
- Every status change gets a History line. The Test Manager's "File bug" writes this format for you.
Delete this comment in real bug reports.
-->
