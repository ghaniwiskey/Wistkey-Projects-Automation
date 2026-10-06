---
id: BUG-014
title: "Settings > Email Template: Remarks counter shows \"/ 250\" once the field has text, the limit is 200"
severity: trivial
status: open
env: staging
url: https://mhauatweb.southeastasia.cloudapp.azure.com/Setting/EmailTemplate
found: 2026-10-06
foundBy: "explorations/2026-10-06-admin.md"
tests: [SPF-052]
frequency: always
---
## Summary
The Remarks counter under the field reads "0 / 200" when empty but "<n> / 250" as soon as there is text (also on load); the field stops at 200 characters.

## Steps to reproduce
1. As Agency Admin, Settings > Email Template, pencil of any template
2. Type in Remarks, or paste 230 characters

## Expected
The counter shows "/ 200" (maxlength 200) at all times.

## Actual
"14 / 250" after typing 14 characters; "200 / 250" after pasting 230 (the field keeps 200).

## Evidence
- Screenshot: ![evidence](../explorations/2026-10-06-admin/02-email-template-remarks-counter.png)

## Environment
- Base URL: https://mhauatweb.southeastasia.cloudapp.azure.com/Setting/EmailTemplate
- Env: staging

## History
- 2026-10-06: filed from explorations/2026-10-06-admin.md in the Test Manager app.
