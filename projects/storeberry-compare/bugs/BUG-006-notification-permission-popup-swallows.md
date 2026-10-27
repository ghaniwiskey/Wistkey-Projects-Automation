---
id: BUG-006
title: "Notification permission popup swallows the Proceed to checkout click"
severity: major
status: open
env: staging
url: "https://storeberry-flower.stagingl10.storeberry.xyz/checkout"
found: 2026-10-27
foundBy: "explorations/2026-10-27-eshop-critical.md"
tests: [SBF-005]
frequency: intermittent
---
## Summary
Shortly after member login, a "Do You Want To Receive Notifications?" modal (NOT NOW / ALLOW) opens over checkout. Clicking Proceed to checkout while it appears creates no order and gives no feedback. It happened on two consecutive attempts; the order only went through after the modal was dismissed. The modal buttons are also not exposed to the accessibility tree.

## Steps to reproduce
1. Register and log in as a new member on the eShop
2. Go to /checkout with items, complete details, Bank Transfer, tick 結帳前同意
3. Click Proceed to checkout

## Expected
Checkout submits, or the notification prompt never appears on the checkout page.

## Actual
The notification modal appears, no order is created (My Orders: "You currently have no orders"), the page stays on /checkout.

## Evidence
- After clicking NOT NOW and Proceed again, order TXN0126102700002 was created.

## Environment
- Base URL: https://storeberry-flower.stagingl10.storeberry.xyz/checkout
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-eshop-critical.md in the Test Manager app.
