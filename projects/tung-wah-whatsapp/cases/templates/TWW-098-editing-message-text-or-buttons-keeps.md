---
id: TWW-098
title: "Editing message text or buttons keeps the app and Twilio the same"
feature: templates
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
What the app shows as the message is what members receive.

## Preconditions
- An admin account (logged in session, or TWW_QA_ADMIN_USER / TWW_QA_ADMIN_PASS in .env)
- A Twilio draft template owned by that admin: only the owner can save the edit page (PATCH checks createdBy), so "testing" (admin@tungwah.org) works only when logged in as admin@tungwah.org. Otherwise create a throwaway draft qa_edit_<unique> with 創建後立即提交 Meta 審核 unticked (it is ticked by default). Creating and deleting a Twilio draft needs the user's approval per run (README > Testing permissions).

## Data
- New body text: QA edited body <unique>

## Steps
1. Open http://localhost:3000/templates/<template id>/edit (no link in the app; type the URL)
2. Change the body text and one button title, then click 保存修改
3. Compare the template detail page with the same content in the Twilio console (Messaging > Templates > the template)
4. Click 從 Twilio 同步 and open the template again
5. Restore or clean up: delete the throwaway draft with 刪除 (also deletes it in Twilio), or put the original text of testing back

## Expected
- The edit page is not offered for Twilio templates, or
- the change also reaches Twilio, so the app and Twilio show the same text and buttons
- a sync does not silently undo an edit

## Notes
Twilio content is immutable: the edit page disables content fields and explains how to replace the template; direct content PATCH returns 400. BUG-034 verified in runs/2026-10-30_1349_local_manual. Use a throwaway draft; never modify approved content.
