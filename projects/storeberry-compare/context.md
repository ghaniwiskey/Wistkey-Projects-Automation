# Storeberry Flower eShop: testing context

Current facts by topic (docs/conventions.md > Knowledge files). Session notes and evidence: `explorations/`. Bugs and statuses, incl. accepted behavior: `.\qa bugs storeberry-compare`; open questions: `.\qa questions storeberry-compare --open`.

## Pages and popups
- Close the promo popup with `#close_promo_popup`; dismiss the notification prompt (`button.close-button`, NOT NOW) before clicking Proceed to checkout, or the popup swallows the click (BUG-006, accepted).
- Product pages often never fire `load`: wait for the Add To Cart button instead. Cart trash icon: `i.fa-trash-o` (no accessible name). `/cart` redirects to `/checkout`.

## Cart, stock and products
- Shipping Address and Method only appear when the cart holds a weighted item. Quota (package) products (e.g. test product EN 1, 偈油x10) need a logged-in member, so guest tests use a non-quota item such as the NAKAJIMA cake (HKD 0.10).
- Add To Cart accepts the Online Shop stock total (Office, TaiPo, IFC Warehouse, 半島倉), but checkout flags "Not enough stock" above the TaiPo stock (BUG-017, closed as wont-fix 2026-10-28: accepted behavior, do not re-report).

## Checkout
- Orders on staging only, Bank Transfer only (`fn-bank-transfer`); never card or wallet methods.
- 住宅送貨 requires every Delivery Info field, including 回收聖誕樹日期 (November dates only). 門市自取 requires an Address (Q-007) and the store radio (荔枝角).
- Guest checkout refuses plus-addressed emails (`name+tag@...`) with only "Please fill all required info" (BUG-012, closed as wont-fix 2026-10-28: accepted behavior, do not re-report): use dotted unique emails for test data.
- Receipt upload in automation: `input[name=receipt_img]` ("Or Choose File"), then Submit.
- Promo code: `#promotion_code` + APPLY; below the minimum: "Current shopping cart does not meet the promotion code conditions". A revoked code stays applied until reload, and the server then refuses the order (BUG-018). Member checkout applies the code before the member level discount (Silver 15%).
- Staging promotions that change checkout totals: basket 全單買滿$1000減$300, VIP888 (promotions 605/606), free gift 631 at net $800, add-on 620 at $1000. After an item is removed, the add-on block can show the wrong product until reload (BUG-013).
- eShop API error responses include a full server stack trace (BUG-016, accepted: do not re-report).

## Courses
- Course calendar: past dates (`.circle.active.is_passed`) have CSS `pointer-events: none`, so a real click does nothing ("Please select a date"). Click dates with real pointer clicks: a DOM `element.click()` bypasses the CSS and books the next session instead, which a customer cannot do (BUG-014 was withdrawn for this, 2026-10-28). The calendar shows one month (year arrows only); the cart and checkout did not show the session date (seen 2026-10-27).

## Accounts and order tracking
- Guest Order Tracking: `/guest-order-tracking` with order number + order email (case-insensitive).
- Forgot password: `/forgot-password`; it reveals whether an email is registered (BUG-011, accepted).
- My Account > My Promotion Codes is a 404 (BUG-019).
