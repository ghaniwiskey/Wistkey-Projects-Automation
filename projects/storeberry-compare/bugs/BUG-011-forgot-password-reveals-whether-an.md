---
id: BUG-011
title: "Forgot password reveals whether an email is registered"
severity: minor
status: wont-fix
env: staging
url: "https://storeberry-flower.stagingl10.storeberry.xyz/forgot-password"
updated: 2026-10-27T09:08:00.365Z
found: 2026-10-27
foundBy: "explorations/2026-10-27-guest-order-recovery.md"
tests: []
frequency: always
---
## Summary
A registered email gets "Success ... Please check your mailbox" while a well-formed unknown email gets "Please provide correct email.", so anyone can test which emails have accounts. The unknown-email wording also suggests a typo.

## Steps to reproduce
1. /forgot-password, submit a registered member email
2. Submit nobody.qa.zz91@example.com

## Expected
Same neutral confirmation for both (e.g. "If an account exists, we sent a reset link").

## Actual
Different responses; unknown email -> Warning "Please provide correct email."

## Evidence
- Screenshot: ![unknown](../explorations/2026-10-27-guest-order-recovery/01-forgot-password-unknown-email.png)

## Environment
- Base URL: https://storeberry-flower.stagingl10.storeberry.xyz/forgot-password
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-guest-order-recovery.md in the Test Manager app.
- 2026-10-27: status open -> wont-fix.
- 2026-10-27: SBF-018 rewritten to the accepted behavior (registered vs unknown email answers differ); tests emptied.
