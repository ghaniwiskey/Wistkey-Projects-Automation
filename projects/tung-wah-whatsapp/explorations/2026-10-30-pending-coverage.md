# Tung Wah pending coverage review, 30 Oct 2026

No application tests or new messages were run for this review. Cases were compared with the current delivery-callback handler and existing recorded results.

## Inventory
- 25 cases currently have no recorded run (22 previously recorded plus 3 new callback cases).
- TWW-085 also needs its live editor-to-Twilio deletion portion checked: its old pass does not establish the expanded current role requirement.
- Historic fails on accepted/wont-fix wording and control visibility are not automatically current product defects.
- Sticker/image showing Other is expected; BUG-046 closed as wont-fix. Sticker test data kept as requested.

## First priorities
- TWW-090/091/092: concurrent sends, retries and recovery after interruption. Mocked transport and an isolated app are required; no arbitrary recipients.
- TWW-048/093/094: correct campaign and full-number reply attribution; unknown sender ignored.
- TWW-099/101: upload path safety and spreadsheet-formula injection.
- TWW-097/100: legacy local-only creation path and user deletion with owned data.
- TWW-118/119/120: late/out-of-order, repeated and post-reset callback events. These were missing and were added as unrun cases.

## Decisions or special setups needed
- Q-007: first/latest answer and which campaign owns a reply (TWW-047/048/107).
- Q-005: last-admin behavior (TWW-008); do not test on the shared sole admin.
- Q-011: deletion of reply history during sync (TWW-104); disposable fixtures and fresh approval required.
- Q-010: case-sensitive template naming (TWW-103).
- Month-boundary reply-rate test TWW-110 needs controlled dates/data.
- Sending, deletion, reset, Twilio creation/deletion and shared-server restart need fresh scenario-specific approvals before execution.

## All never-run cases
TWW-008 P1 manual last:never [regression] users: The last admin cannot delete or demote itself
TWW-047 P2 manual last:never [regression,writes] replies: Changing an answer after replying
TWW-048 P2 manual last:never [regression,writes] replies: Reply is credited to the template it answers
TWW-090 P1 manual last:never [regression,writes] sending: Clicking send again while a send is running does not message anyone twice
TWW-091 P1 manual last:never [regression,writes] sending: Failed contacts are retried on the next send and sent contacts are not
TWW-092 P2 manual last:never [regression,writes] sending: A send stopped by a server restart can be finished without duplicates
TWW-093 P1 manual last:never [regression,writes] replies: A reply from another number ending in the same 8 digits is not credited
TWW-094 P2 manual last:never [regression] replies: A reply from an unknown number is ignored
TWW-095 P2 manual last:never [regression,writes] replies: Image, voice or location replies are recorded clearly
TWW-096 P2 manual last:never [regression,writes] replies: Replying with the button number counts as that button
TWW-097 P1 manual last:never [regression,writes] templates: Old new-template page cannot create a template that skips Twilio
TWW-099 P1 manual last:never [regression,writes] contacts: The uploaded file name cannot write outside the uploads folder
TWW-100 P1 manual last:never [regression,writes] users: Delete a user who created templates or uploaded contacts
TWW-101 P2 manual last:never [regression,writes] reports: Contact values that look like formulas are exported as plain text
TWW-102 P3 manual last:never [regression] contacts: Upload to a template that does not exist is rejected
TWW-103 P3 manual last:never [regression] templates: Template names that differ only in letter case are rejected
TWW-104 P2 manual last:never [regression,writes] templates: Sync handles templates deleted in Twilio without silently losing replies
TWW-107 P1 manual last:never [regression,writes] replies: A button tap after a free-text reply sets the member's answer
TWW-110 P2 manual last:never [regression] dashboard: Reply rate stays between 0% and 100% at the start of a month
TWW-113 P2 manual last:never [regression,writes] templates: Turning 是否需要回覆 off and on keeps replies
TWW-114 P2 manual last:never [regression,writes] replies: Member who replies STOP or blocks the number is handled
TWW-115 P2 manual last:never [regression,writes] sending: A long send shows progress and the final result
TWW-118 P1 manual last:never [regression,writes] sending: Delayed delivery callbacks do not downgrade a read message
TWW-119 P2 manual last:never [regression,writes] sending: Duplicate delivery callbacks leave the recorded status and times unchanged
TWW-120 P1 manual last:never [regression,writes] sending: Old delivery callbacks cannot update a contact after it is reset
