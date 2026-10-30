---
project: storeberry-compare
env: staging
charter: "Test SBF-028 using two isolated Playwright contexts to check last-unit overselling"
date: 2026-10-30
timebox: 30m
status: done
---

## Scope
- SBF-028 only. One explicitly approved run, including the one-unit QA setup, two Bank Transfer checkout submissions and void cleanup. No retry.
- Two guest shoppers in separate Playwright BrowserContexts; separate cookies and carts. Guest/guest is the execution variant; member-specific differences were not exercised.
- Browser setup and reconciliation used Aside; shopper checkout used a temporary local Playwright controller. No reusable automation or spec was added.

## Coverage notes
- Created dedicated product ASIDE-QA-LASTUNIT-MVUQJOP7 (product 3204, variant 6063), HKD 10, weight 1 kg, General category, Track Inventory on, Pre-order off. Initial stock: TaiPo 1, all other warehouses 0.
- Baseline CRM Available 1 / Stock 1 / Pre-order 0. Both shoppers added quantity 1 and saw Item added successfully.
- Both guest checkouts used unique example.com emails, pickup at 荔枝角, Bank Transfer and accepted terms. Both Proceed buttons were clicked concurrently via Promise.all, once each.
- Both reached thank-you pages: B -> TXN0126103000007 (CRM 11061), A -> TXN0126103000008 (CRM 11062). Checkout POST responses were HTTP 200 at 08:57:39.306Z and 08:57:40.661Z.
- Product-name filter returned exactly 2 CRM orders, both Pending payment, quantity 1, HKD 10, TaiPo. Inventory was Available -1 / Stock 1 / Pre-order 1. The second order showed Pre-order Qty: 1 despite the product switch being off.

## Findings
- BUG-023, major: simultaneous checkouts sell the last available unit twice. One approved run observed, not repeated. Different from accepted BUG-017, which concerns Add To Cart versus checkout warehouse totals.
- Evidence: [negative stock](2026-10-30-last-unit-two-contexts/02-negative-stock.png), [two CRM orders](2026-10-30-last-unit-two-contexts/05-two-crm-orders.png), [A confirmation](2026-10-30-last-unit-two-contexts/03-shopper-a-confirmed.png), [B confirmation](2026-10-30-last-unit-two-contexts/04-shopper-b-confirmed.png).

## Test cases written
- No new case needed. Updated SBF-028 to allow independent guest sessions and specify overlapping checkout submissions.
- Test Manager run 2026-10-30_1557_staging_manual: SBF-028 fail, product-bug, BUG-023. Screenshots attached.

## Knowledge and data
- Both test orders were voided and verified Canceled. Inventory restored to Available 1 / Stock 1 / Pre-order 0, [proof](2026-10-30-last-unit-two-contexts/06-stock-restored.png).
- Both guest carts verified at 0 on the home page after checkout.
- Dedicated product retained for reproduction, set to Hidden Product rather than permanently terminated. Stock 1 is QA-created, not borrowed from another tester.
- Context updated with the observed concurrent checkout risk.
