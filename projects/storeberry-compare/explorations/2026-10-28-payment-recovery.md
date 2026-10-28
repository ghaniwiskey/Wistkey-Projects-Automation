---
project: storeberry-compare
env: staging
charter: "Explore payment recovery for a member Bank Transfer order (upload, staff deny, customer re-upload, back to review) to find dead ends and misleading states."
date: 2026-10-28
timebox: 15m
status: done
---

## Scope
- In scope: SBF-031; eShop My Orders > Upload Receipt (Replace and Or Choose File + Submit), Order Detail status; CRM Receipt tab Deny.
- Out of scope: Accept after re-upload (would award points/level spending to the shared QA member), guest orders.
- CRM half of the session (fix retests, stock take): `projects/storeberry-crm/explorations/2026-10-28-payment-recovery-fix-retests.md`.

## Coverage notes
- Member MEMy001164526, C x1, 門市自取 + 荔枝角 -> TXN0126102800013 (510.00). Upload (Or Choose File + Submit) -> "Your receipt is successfully uploaded, and waiting for approval..." and Remark "Payment Review".
- CRM Deny with a comment -> Payment Rejected / Pending payment. eShop Order Detail STATUS Rejected, Remark history shows the comment; the Upload Receipt tab still says "waiting for approval" (BUG-022, twice).
- Re-upload via Replace (`input[name="change-logo"]`) and via Or Choose File + Submit: both back to Payment Review in the CRM with the new image and Accept/Deny. Each took about 45 s on "Please wait..." (POST /my-account/upload-receipt 200); the first upload of the session took under 4 s, so it is noted as a risk only.
- Heuristics: interrupted flow (deny and retry), state shown where the user acts vs elsewhere.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Upload Receipt still says "waiting for approval" after a deny | minor | bugs/BUG-022-upload-receipt-still-says-waiting-for.md |
| 2 | risk | Receipt re-upload can sit on "Please wait..." for about 45 s | - | SBF-031 run note |

## Test cases written
- SBF-035 After a deny, Upload Receipt shows the rejection (P2) - fail, BUG-022
- Manual run `runs/2026-10-28_1155_staging_manual`: SBF-031 pass, SBF-035 fail.

## Knowledge and data
- context.md: Accounts and order tracking (receipt replace input, deny state).
- QA data: TXN0126102800013 voided (Canceled).
