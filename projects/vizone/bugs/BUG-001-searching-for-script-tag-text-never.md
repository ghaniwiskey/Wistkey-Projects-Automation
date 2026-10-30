---
id: BUG-001
title: "Searching for script tag text never finishes loading"
severity: minor
status: open
env: staging
url: "http://vizone-staging01.bh.rthkeng.hk/studio/"
updated: 2026-10-30T03:20:57.320Z
found: 2026-10-30T03:20:57.320Z
foundBy: "edge-case exploration 2026-10-30"
tests: [VZ-024]
frequency: always
---
## Summary
Searching Items for <script>alert(1)</script> leaves the page on "Loading Search Results" forever. No search request is sent and nothing is logged; other HTML such as <b>bold</b> returns "No search results found".

## Steps to reproduce
1. Log in to Studio as admin
2. Type <script>alert(1)</script> in the Search Items box and press Enter
3. Wait 30 seconds

## Expected
The search ends with "No search results found" (or results) within a few seconds and the text is treated as plain text.

## Actual
"Loading Search Results" stays on screen for 25+ seconds; no network request is made, no console error. The user must clear the search to continue.

## Evidence
- Manual run 2026-10-30, VZ-024 screenshot

## Environment
- Base URL: http://vizone-staging01.bh.rthkeng.hk/studio/
- Env: staging

## History
- 2026-10-30: filed from edge-case exploration 2026-10-30 in the Test Manager app.
