---
id: TWW-117
title: "Sticker reply is counted once under Other"
feature: replies
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Reply with a WhatsApp sticker

Verify that a sticker reply is counted once under Other in reply statistics and the downloaded report.

## Preconditions
- An admin account and an approved WhatsApp template are available.
- The receiving phone can send a WhatsApp sticker.
- The receiving contact has been sent the template and has no recorded reply.

## Data
- Use only the designated WhatsApp test phone.
- Reply with one sticker without text or a caption.

## Steps
1. Log in with your admin account and open the sent template.
2. On the receiving phone, reply with one WhatsApp sticker before sending any text or tapping a reply button.
3. Open 回覆統計 (Reply statistics) and inspect the contact’s answer.
4. Download the reply report and inspect the answer cell for the contact.

## Expected
- The sticker counts as one reply under Other or a clearly labelled media category.
- The reply view and report may show 其它 (Other); a separate sticker label or preview is not required.

## Notes
User confirmed on 2026-10-30 that a generic Other answer for sticker/image replies is expected. BUG-046 closed as wont-fix; its tests list cleared. The recorded inbound image/webp reply was counted once and exported as 其它. The historic run fail reflects the earlier expectation and is retained as history, not presented as a current product defect. Keep the test contact/reply/upload for user inspection. No new send or retest occurred after this expectation update.
