---
project: slug
env: staging
charter: "Explore <area> with <resources/techniques> to discover <information/risks>"
date: YYYY-MM-DD
timebox: 30m
status: done
---

## Scope
- In scope: pages, roles, data.
- Out of scope:

## Coverage notes
What was actually exercised, in the order explored. Mention the heuristics used (docs/exploratory-heuristics.md).

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | ... | major | bugs/BUG-004-... |
| 2 | question | Is X intended? | - | questions/Q-003-... |
| 3 | risk | Area Y has no validation on Z | - | cases/.../ID-031-... |

## Test cases written
- ID-031 title (P2, regression): every risk, gap and test idea of the session becomes a case right away (qa-write-tests).

## Knowledge and data
- Facts merged into the project's README.md / context files (docs/conventions.md > Knowledge files).
- QA data left on the env (IDs, why kept, how to clean up).
