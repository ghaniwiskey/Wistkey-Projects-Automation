# Agent rules

## Testing safety: ask before irreversible actions

- During any testing, stop before an irreversible or potentially irreversible action and ask the user for explicit approval for that specific scenario and run. Explain what will change, which environment and data are affected, and why it cannot be undone. If reversibility is uncertain, ask first.
- Examples include permanent deletion, final submission or approval, payments or purchases, sending external messages or emails, publishing, and consuming limited test data that cannot be restored.
- A general request to test, sandbox access, `allowWrites: true`, or an earlier approval is not approval for a new irreversible scenario, rerun, or retry. Existing stricter safety restrictions still apply.
- Before starting an automated suite, inspect the selected scenarios for these actions. Exclude unapproved scenarios (including `@final` tests), record them as skipped/blocked pending approval, and continue only safe scenarios. Never bypass the approval requirement through an API, helper, cleanup, or another agent.
- Full shared QA rules: `docs/conventions.md`, especially **Safety**.
