---
project: storeberry-compare
env: staging
charter: "Verify SBF-044 member Bank Transfer checkout and receipt upload at a 390x844 viewport"
date: 2026-10-30
timebox: 30m
status: done
---

## Scope
- SBF-044 only, one explicitly approved run covering order submission, marked test receipt upload and void cleanup. No retry.
- Aside browser at 390x844 CSS pixels. Viewport-based responsive testing, not a physical phone, touch-device emulation, WebKit or Firefox run.
- Existing QA member MEMy001164526, Wai Yin Cheung, example.com test email. Initial cart 0.

## Coverage notes
- Used mobile navigation search for NAKAJIMA and product test 2. Both were zero-weight products, so neither was added because this case requires the pickup fields. Selected available non-quota product C (1 kg) from the storefront; quantity 1 and a unique case-specific product remark.
- Product add returned Item added successfully. Checkout offered country, shipping method, recipient, email, address, pickup store, payment and terms controls.
- Selected 門市自取 and 荔枝角, entered SBF-044 QA pickup test as the address, kept Bank Transfer and ticked the terms. Did not save the address or change the profile.
- Page viewport verified 390x844; document/body scrollWidth 375 CSS px. Required form controls stayed within x=14..362 CSS px; vertical scrolling only was needed. No blocking popup appeared, so popup dismissal was not exercised.
- One Proceed click created TXN0126103000013 (CRM 11068), C x1, HKD 600.00, pickup, TaiPo Warehouse. Thank-you page and My Orders showed the new order; cart became 0.
- From My Orders > Order Details > Upload Receipt, selected a PNG visibly labelled TEST RECEIPT ONLY / NO PAYMENT MADE / SBF-044 mobile checkout. One Submit click returned: Your receipt is successfully uploaded, and waiting for approval.
- Member order summary displayed Status: Payment Review; CRM independently showed Order Status Payment review. No receipt acceptance, real payment, loyalty redemption or extra checkout was performed.

## Findings
- SBF-044 pass. No new product bug found within this scenario.
- [Ready mobile checkout](2026-10-30-mobile-checkout/01-checkout-ready.png), [confirmation](2026-10-30-mobile-checkout/02-mobile-confirmation.png), [receipt upload](2026-10-30-mobile-checkout/03-mobile-receipt-uploaded.png), [Payment Review](2026-10-30-mobile-checkout/04-mobile-payment-review.png).

## Test cases written
- No new case needed. Updated SBF-044 data to require a positive-weight non-quota product and replaced Never tested with the verified execution details. Automated remains false.
- Test Manager manual run 2026-10-30_1643_staging_manual: SBF-044 pass, all expected results checked.

## Knowledge and data
- CRM Actions > Void this order > Yes canceled only TXN0126103000013. CRM and member summary both verified Canceled; [mobile proof](2026-10-30-mobile-checkout/05-mobile-canceled.png).
- Cart 0 was confirmed after ordering and remained 0 after cancellation. No new product/member/address was created. Test receipt remains in the canceled order history as disclosed in the approval.
- No other orders or records changed.
