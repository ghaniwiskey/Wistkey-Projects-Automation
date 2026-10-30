---
project: storeberry-compare
env: staging
charter: "Verify SBF-040 eShop appointment booking, member/CRM visibility and slot reservation"
date: 2026-10-30
timebox: 30m
status: done
---

## Scope
- SBF-040 only. One explicit approval for a QA booking and cancellation cleanup; no retry.
- Existing QA member MEMy001164526 (Wai Yin Cheung). Initial My Appointment list empty.
- Browser booking plus a separate read-only Playwright guest context to inspect availability. No second booking, payment, staff mapping or appointment setting changes.

## Coverage notes
- CRM /appointment/list loaded real rows, so the historical empty-list symptom was not observed. This is not a full retest of BUG-022 or its linked cases.
- Selected resource Course (3), service Thai (30 minutes, displayed HKD 200 fee). Used the next-month arrow to choose available 2026-11-02, 10:00-10:30. No payment was requested or made. All dates/times here are as displayed; no timezone conversion asserted.
- Submitted once with unique remark SBF-040-MVUT1XJ4. Confirmation: Thank you! Your appointment is scheduled, with the selected date/time. Confirmation access token intentionally omitted from reports.
- Member My Appointment changed to Total Appointments: 1 and showed Course / Thai / 2026-11-02 / 10:00-10:30 / Pending.
- CRM general search by the unique remark returned exactly one record: same QA member, Thai, date/time, Pending, remark; internal resource label Dorothy.
- Independent guest context: same resource, service and date offered 10:30-11:00 as the first slot. 10:00-10:30 and the overlapping 10:15-10:45 were absent. No booking submission from the guest.

## Findings
- SBF-040 functional checks pass: confirmation, member/CRM visibility and slot reservation.
- Cleanup skipped by explicit user direction. CRM Cancel showed Do you want to delete the item? with Delete / Cancel. The user chose Keep the booking, so the prompt was dismissed without Delete.
- Q-023 in storeberry-crm asks whether Delete is the intended cancellation action and whether it preserves a canceled record. Related existing case SCRM-061 updated with the observation; not executed to completion. No new case or product bug needed.
- BUG-022 history records that list access worked; status remains open because all linked cases/pages were not retested.
- Evidence: [confirmation](2026-10-30-appointment-sync/02-booking-confirmed.png), [member](2026-10-30-appointment-sync/03-member-booking.png), [CRM match](2026-10-30-appointment-sync/04-crm-booking.png), [guest availability](2026-10-30-appointment-sync/05-guest-booked-slot-unavailable.png), [retained booking](2026-10-30-appointment-sync/06-retained-at-user-request.png).

## Test cases written
- No new case needed. SBF-040 notes updated with its first functional pass and the explicit cleanup waiver. SCRM-061 links Q-023; its cancellation result remains untested.
- Test Manager run 2026-10-30_1704_staging_manual: SBF-040 pass, 2 expected checks pass, cleanup expected check skipped.

## Knowledge and data
- Retained by user request: SBF-040-MVUT1XJ4, member MEMy001164526, Thai, eShop Course / CRM Dorothy, 2026-11-02 10:00-10:30, Pending. The slot remains reserved.
- To identify it, search the unique remark in CRM Appointments. Do not click Delete without new explicit approval. Booking and notification history may remain.
- Guest browser closed. No other booking changed; no cancellation or deletion executed.
