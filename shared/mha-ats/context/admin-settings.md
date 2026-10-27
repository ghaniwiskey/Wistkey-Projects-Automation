# MHA ATS web: settings and user administration

Core: `../context.md`. Manual: `../docs/user-manual/09-settings.md`, `10-user.md`.

## Rules
- Group limits: Short 25, Long 100, Description 200.
- User delete exists only on HTA. Role access rights are view-only in the UI.

## Observed behavior (UAT)
- Settings > Group: the Create form button says "Update"; "Cost Center/Code/Name is required"; "Group has been successfully created./updated."; Delete "Are you sure? You won't be able to revert this!" (Yes, delete it!) -> "Group has been successfully deleted". Description has no limit and is cut to 200 (mha-spf BUG-008).
- User Listing: one row per user and mapped role (a user without a role has one row, Role Mapped empty). Create with an empty form: "Web Login ID or Mobile Login ID is required.", "Unit is required.", "Name is required.", "Status is required.". Create -> "User has been successfully created." (back to the list); Update -> "User has been successfully updated." (stays on the form). Duplicate Web Login ID: "Login ID already exist!". INACTIVE user login: "Invalid username/password.". A new user can log in (LoginBk, empty password) as soon as it has a role; the role shows in the header. HTA user delete: `projects/mha-hta/context.md`.
- Role Listing > Users: Add User (dialog filters while typing, tick, Submit) -> "User assign into role have been successfully updated."; trash (no confirmation) -> "<Role> role has been removed from User <name>."; the user form then keeps a blank EXPIRED role row (mha-spf BUG-013).
- Role Listing > Periods: "Start date is required.", "End date is required.", "The start date must be ealier than the end date" (mha-spf BUG-015). Dates are dd/mm/yyyy in the dialog but read as mm/dd/yyyy by the server: day > 12 gives "SqlDateTime overflow...", day <= 12 is saved swapped (mha-spf BUG-011). Delete (no confirmation): "Period <start> to <end> has been successfully deleted.". A role without a valid period is unusable.
- Announcement: "Content is required", "Start Date is required", "End Date is required"; "Announcement has been updated." (stays on the form). HEADER = banner at the top of the login page while today is within its dates (not shown on the Dashboard); FOOTER = text under the login card (the agency's warning, see the agency file). No delete.
- Cost Centre: code read-only; "Name is required"; "Cost Center has been successfully updated." (stays on the form). Keyword search matches code and name, not the description (mha-spf BUG-012).
- Email Template: "Subject is required"; "Email template has been saved."; Remarks is an internal note (max 200, counter shows / 250, mha-spf BUG-014).
- Master Setup: Agency Name (read-only) and "Stocktake FAVE Start (MMDD-00:00)" (e.g. 0917). Not touched by tests.

## Quirks and waits
- Flatpickr dialogs (Role period, Announcement): picking the start date opens the end date's calendar, and a refused Submit refocuses the date field and reopens it; it covers the dialog buttons. Page objects close the calendars before clicking.

## Test data (found at runtime)
- User admin (SPF-044..046): SPF-044 creates one user per run (`QA-AUTO-<TIME>`, name "QA auto user <time>", first unit offered) and leaves it INACTIVE (no user delete on SPF); SPF-045/046 reuse the first "QA auto user" User Listing finds (fixture `qaUser`, set ACTIVE first; created when none). Role tests use End User (fewest rights, no real users on UAT; HTA: Stocktaker). New users log in in a second browser context (fixture `otherSession`), so the test account's session survives.
- Admin settings (SPF-049/050/052) edit records found at runtime and restore them: the first HEADER announcement that has ended (skip when none; announcements cannot be deleted), the first cost centre (Building), the first email template (Remarks only, never Subject/Content).
