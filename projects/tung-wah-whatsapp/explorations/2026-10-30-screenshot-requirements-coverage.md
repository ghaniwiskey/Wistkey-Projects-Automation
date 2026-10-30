# Screenshot requirements coverage review, 30 Oct 2026

Sources: the two requirement screenshots attached by the user in this session (image.png and a1bfa8767897bbbc4eb4148dd5937007.png), current local application source, and recorded Test Manager history. This was a static coverage review, not a new application test run. No messages, uploads, resets, deletes, syncs or Meta submissions were performed.

## Requirement-by-requirement mapping

1. WhatsApp template management (create, Twilio/Meta approval, approval sync, Pending/Approved display): recorded passes TWW-019/021/064 and approval/status regression TWW-025/074. Existing failed cases for rejected/draft behavior describe accepted limitations or older expectations, not automatically a missing feature in this screenshot scope.
2. Template detail and preview (view message, preview, sending management, variables): exercised by TWW-036/037/056/071/075 and previous live template-page checks. The preview is a template-content preview; the screenshot does not explicitly demand a recipient-specific resolved preview, so no such missing feature was assumed.
3. Excel upload (xlsx/xls, append/overwrite, parsing, required name/mobile): .xlsx upload and parsing have recorded passes TWW-026/028/029/030/050/052. Overwrite execution is documented as working in TWW-031; its historical fail concerns confirmation, which this requirement does not specify. Genuine .xls has no dedicated recorded execution: added TWW-123. Required-name validation appears missing in source: lib/excel.ts checks normalized phone length but pushes a row even when name is empty; added TWW-124. No new runtime defect was claimed. Phone-format limitations previously accepted under BUG-014 remain accepted.
4. Variable mapping (Excel fields, dynamic variables, manual mapping, save): exercised by TWW-036/037/056/071/075. Generic variable extraction and mapping support named variables; the literal username spelling in the screenshot is not treated as a separate mandatory hard-coded field.
5. WhatsApp sending (approved templates, bulk sends, approved-only restriction): basic send/mapped values and restriction have passes TWW-036/037/074/075. Multi-contact long-running sending, concurrent sends and retry/restart behavior remain unrun under TWW-090/091/092/115. TWW-053 only covers a double click, not another batch request while one is still running. Use mocked transport, not random recipients.
6. Contact management (member information, phone/member ID/type/status/time, delete, refresh): recorded observations and passes TWW-026/032/033/034 and the 30 Oct shared-contact retest show these fields/actions. Current contacts page renders phone, sent time, status and every custom Excel field. No missing field display was identified from source.
7. Resend/status reset (individual reset, all reset, selected/reset resend): individual reset passed TWW-034; confirmation/cancel behavior passed TWW-055. TWW-055 does not establish confirming Reset all and completing a resend: added TWW-125. Explicit selected-recipient resend appears absent: the contact page has reset/delete, not recipient selection; /api/send accepts only templateId and sends every PENDING/FAILED contact. Added TWW-122. Resetting one contact works as a targeting workaround only when no other pending/failed contacts remain. Treat this as a code-review gap relative to selected/reset wording, not a live reproduced bug; confirm with the owner if status-based bulk targeting is intended to satisfy the selection requirement.

## Customise functions

1. Failed phone displayed: exercised in TWW-039 and the 30 Oct failure callback replay; the contact page shows the phone with failure reason/code. This feature is not missing.
2. Messages without requiring replies: implemented in current UI/create route with requiresReply=false and twilio/text, but not end-to-end verified. TWW-018 is a creation-only historical failure and needs updating/retesting with the current no-reply checkbox; TWW-113 is an unrun toggle/preservation test. Added TWW-121 for sending an approved no-reply notification and excluding it from reply-rate calculations.
3. Avoid repeated messages to one phone: upload normalization/dedup passed TWW-029 and same-button double-click protection passed TWW-053. TWW-054 notes that the same-phone send step was not rerun after dedup changed. Concurrent batches, retry isolation and restart recovery still need TWW-090/091/092; do not claim the requirement fully covered by upload dedup alone. No assumption of permanent global dedup across separate campaigns or intentional resets was made.
4. Home/dashboard usage grid (monthly sent, replies etc.): implemented; role coverage passed TWW-109 and sums were checked in the 30 Oct retest. Local-only/status-table mismatch is accepted under BUG-043. Month-boundary rate and no-reply exclusion/preservation remain TWW-110/113 and new TWW-121. There is no evidence that the dashboard itself is missing.

## Newly recorded cases, all unrun

- TWW-121 P1: send an approved notification without requiring a reply.
- TWW-122 P1: resend only selected reset contacts while other recipients remain pending/failed.
- TWW-123 P2: import a genuine legacy .xls workbook and compare it with .xlsx.
- TWW-124 P1: reject/skip blank or whitespace-only required names with an explanation.
- TWW-125 P1: confirm Reset all and resend exactly once to every reset phone.

No duplicate test cases were added for mapping, normal .xlsx import, existing failed-phone display or dashboard cards. These five cases extend rather than replace prior reset, creation, import and send cases. All sending/destructive scenarios need fresh scenario-specific approval and isolated/disposable data. The retained sticker test contact/reply/upload must not be reused or reset without approval.
