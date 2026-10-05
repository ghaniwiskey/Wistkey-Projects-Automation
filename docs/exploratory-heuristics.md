# Exploratory and test-design heuristics

Test ideas by category. Use it when designing test cases (which cases are missing?) and during exploratory sessions. Pick the sections that fit; each line is a question to ask the app.

## Inputs and forms
- Required fields empty; whitespace only; leading/trailing spaces trimmed?
- Boundaries: min/max length, 0, -1, max+1, decimals, huge numbers, dates in the past/future, Feb 29.
- Formats: invalid email/phone/URL, unicode, emoji, accents, 1000+ character strings.
- Escaping (test envs only): `<b>bold</b>`, `"><img src=x onerror=alert(1)>`, `' OR '1'='1`. Text must render literally.
- Double submit (fast double click), Enter key submit, paste, browser autofill, tab order.
- Error messages: shown next to the field, specific, cleared after fixing, input preserved.

## State and navigation
- Back/forward and refresh in the middle of a flow (wizards!); deep links straight into step 3.
- Protected URLs while logged out; back button after logout; session expiry mid-form.
- Same record open in two tabs, edited in both.

## Data lifecycle
- Create, read, update, delete; undo; empty state, one item, many items (pagination).
- Search/filter/sort: no results, special characters, combined filters, reset.
- Values persist after reload and across sessions; totals and counters stay consistent.
- Limits: stock or quotas reached (the SCG cart rejects adds beyond available stock).

## Roles and permissions
- Each role sees only its own menus and actions; hidden vs disabled controls.
- Switching role mid-session updates menus and data; roles outside their validity period.
- Change IDs in URLs to another test account's record (test accounts only) and expect a denial.

## Workflows and approvals
- Every path through an approval chain: approve, reject, cancel, recall, return.
- Who gets notified at each step; items that are locked while a transaction is open.
- Stopping halfway (draft saved? partial data left behind?).

## Errors and resilience
- 404 page, server error messages, retry paths, partial failures.
- API errors the UI swallows (watch the network tab: a 4xx/5xx with no message on screen is a bug).
- Slow or offline network, mocked API errors: Playwright `page.route()` in a spec.

## UI and content
- Long text overflow and truncation, missing images, alignment, overlapping layers, sticky headers.
- Loading states and spinners that never end; skeletons replaced by content.
- Terminology consistency, typos, placeholder text left in, date, time zone and currency formats.
- Smaller viewports and mobile (`browsers: [mobile]` in project.yaml).

## Accessibility quick pass
- Keyboard only: reach and operate everything, visible focus, no traps, Escape closes dialogs.
- Labels on inputs, alt text on meaningful images, heading order, button names.
- If `getByRole` / `getByLabel` cannot find a control, real users with screen readers probably cannot either.

## Console, network, performance
- JS errors in the console, failed requests (4xx/5xx), CORS or mixed-content failures.
- Slow first response, slow page loads, layout shifts, oversized images.

## Coverage model (SFDPOT)
Structure, Function, Data, Platform, Operations (how real users use it), Time (timeouts, time zones, dates, concurrency).
