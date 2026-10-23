---
project: storeberry-compare
env: staging
charter: "Check the provided Storeberry Flower site for core storefront search behavior and verify any confirmed staging defect on the published store."
date: 2026-10-23
timebox: targeted
status: done
---

## Scope
- In scope: provided staging URL, storefront home page, product listing/search, one product detail, and comparison of the confirmed search issue against the published online store.
- Out of scope: CRM CRUD, checkout/payment, and production data changes.

## Coverage notes
- The provided staging URL (`https://storeberry-flower.stagingl10.storeberry.xyz/`) renders the customer-facing eShop. Its Login control opens a customer Email/Mobile form, not the CRM.
- Searched for the listed product `Disable Test` twice on staging, including after reloading the same search URL. The heading retained the query but the result list showed unrelated products and omitted `Disable Test`.
- Verified the same query on the linked published storefront (`https://storeberry-flower.mystoreberry.com/`, reached through the production CRM's “Visit my online store” link). It returned the matching `Disable Test` item at HKD $100.00. This was a bug-only comparison, not a production CRUD test.
- Opened the staging product detail for `偈油x10`; the name, HKD $10.00 price, quantity control and Add To Cart button were visible.
- A single staging add-to-cart attempt changed the header badge to 1, while the cart panel said “You have no items in your cart !”. The interaction timed out before a full cart verification; this is recorded as an untriaged risk in SBF-004, not filed as a confirmed bug.
- The provided URL is not a CRM URL. The production `www.mystoreberry.com` login is the Storeberry CRM and accepted the provided account, but the user asked to test staging first and use production only to verify staging bugs. CRM test coverage is therefore blocked pending a staging CRM URL or confirmation to use production CRM read-only.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Staging product search for `Disable Test` returns unrelated products; the linked live storefront returns the matching item. | major | bugs/BUG-001-product-search-returns-unrelated.md |
| 2 | risk | Staging cart badge showed 1 while the cart panel said it was empty; only one attempt and full cart state not confirmed. | - | cases/cart/SBF-004-add-and-remove-a-product-from-the-cart.md |
| 3 | question | What is the staging CRM URL? The provided staging URL is the eShop; the production URL is the CRM login. | - | - |

## New test ideas
- SBF-002: Product detail shows the selected product and price (P1, smoke).
- SBF-003: Search results match the submitted product name (P1, smoke).
- SBF-004: Add and remove a product from the cart (P0, regression, writes).
- Add CRM CRUD cases after the staging CRM entry point is known.

## Knowledge updates
- The CRM's “Visit my online store” link opened `https://storeberry-flower.mystoreberry.com/`.
- No staging CRM route was linked from the supplied eShop URL during this targeted pass.
- Screenshot: `explorations/2026-10-23-storefront-search/01-staging-search-results.png`.
