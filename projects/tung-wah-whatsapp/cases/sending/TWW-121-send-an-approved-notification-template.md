---
id: TWW-121
title: "Send an approved notification template without requiring a reply"
feature: sending
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Send a notification without reply buttons

Verify that a template configured not to require a reply can be sent without quick-reply buttons.

## Preconditions
- An admin account and an approved notification template configured with 此模板需要用戶回覆 turned off are available.
- An isolated send setup with a mocked Twilio transport or the designated receiving test phone is available.

## Data
- Use a disposable contact and no unauthorized recipients.

## Steps
1. Log in with your admin account and open the notification template.
2. Confirm that reply collection is turned off and preview the message.
3. Upload the disposable test contact and send the template.
4. Inspect the outgoing message and its delivery result.
5. Open the dashboard and compare its reply-rate denominator before and after this send.

## Expected
- The send succeeds without requiring a quick-reply button.
- The outgoing message contains the configured text and no quick-reply buttons.
- The notification template is excluded from reply-rate calculations.

## Notes
Source: attached requirements Customise Function 2, can set messages without replying. TWW-018 covers creation only and TWW-113 covers toggling; neither records this full send path. Code supports requiresReply=false and twilio/text, but this scenario has not run. A live send requires fresh specific approval.
