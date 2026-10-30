---
name: "qa-sheet-plan"
description: "Build or update a Google Sheets test plan / test report for a project in this Playwright workspace from its test cases: copy the user's template tab, fill header, dashboard, defects and test case table, reorder or remove columns, group by module, clean wording, fix dropdowns, or copy the plan into its own spreadsheet. Use when the user asks for a test plan, test report or test cases in a spreadsheet or Google Sheet."
---

# Spreadsheet test plan

Wording, sections and scope of the cases: `docs/test-case-style.md` (follow it for every cell a tester reads). New spreadsheet bug/defect reports: `docs/bug-report-style.md`; keep observed results and history, do not reset defects like a fresh test plan. Sheets API: `googleSheets` global (read the google-sheets and google-accounts skills first). Cases come from `projects/<slug>/cases` (`.\qa tests <slug>`).

## Rules

1. **The user edits the sheet too.** Before every change, re-read the tab (CSV export, below) and diff it with what you expect. Write only the cells you change. Never write back rows, columns, sections or text the user removed. If a write lands wrong, undo it in the same editing session (Ctrl+Z, one press per write) before anything else.
2. **Template.** Duplicate the user's template tab (tab menu > Duplicate), rename it `Test Report  – <Project> <Topic>`, keep its look. Projects that are not part of that file go into their own spreadsheet (tab menu > Copy to > New spreadsheet, then name the file `<Project> Project Test Plan`); ask before deleting the tab from the original file.
3. **Columns of the test case table, in order:** Test Case ID, Module, Test Description (D:E merged), Feedback/Source Ref, Preconditions, Test Steps, Expected Result, Actual Result, Testing Date, Execution Status, Remarks. No Automation Status, Priority, Platform, Test Data or When-to-run unless asked.
4. **Fresh plan:** Actual Result and Testing Date empty, Execution Status "Not Executed" on every row, no results, dates or numbers from our own runs, no environment names.
5. **Rows grouped by module:** web app modules first, desktop/manual-workstation modules last, IDs ascending inside a module.
6. **Header:** title, project name, prepared by, report update date, overview (what the plan verifies, plain words), approach, deliverables, tools as the tester sees them (web browser, desktop apps), conclusion empty until results exist. Defects section: only when the user wants them; one row per reported problem, no internal IDs.
7. **Dropdowns as fixed lists** (Data > Data validation > Dropdown, items PASSED, FAILED, Blocked, Not Executed; display style Arrow), never "Dropdown (from range)" pointing at another tab: copying the tab or file breaks those and leaves stale "Invalid" flags.
8. **Dashboard formulas** must point at the current table (`=COUNTIF(<status col>$<first row>:<status col>$300;G27)`, `;` separators in this locale). Re-check them after any column move.

## Doing it safely

- **Read:** `fetch('https://docs.google.com/spreadsheets/d/<id>/export?format=csv&gid=<gid>&t=' + Date.now())`, parse CSV yourself (quoted multi-line cells). `readSheet`/`readSheetRich` often return nothing for these tabs. Formulas: navigate to the cell and read `#t-formula-bar-input .cell-input`.
- **Write:** `googleSheets.writeMatrix(cell, rows)`. Multi-line cells work. `''` clears a cell, but trailing empty rows of a matrix are dropped: clear those with select + Delete. A paste over merged cells unmerges them: re-merge after (Format > Merge cells > Merge horizontally) and refit rows (row header right-click > Resize rows > Fit to data).
- **Sort or reorder rows:** rewrite the values in the new order with one `writeMatrix` (the Sort tool fails on merged cells), then verify every row against the source.
- **Move columns inside the table only:** cut/paste blocks through an empty staging area to the right (cut-paste keeps formatting, dropdowns and colour rules). Remove a table column with Edit > Delete > Cells and shift left on the table rows only: deleting the whole column also hits the defect table and dashboard above.
- **After any move:** check conditional formatting (Format > Conditional formatting, select a cell of each area): status colours must follow the status column, the failed-row rule must read `=$<status col>44="FAILED"` on the table range, no `#REF!`.
- **UI is in Indonesian** (Hapus = Delete, Gabungkan = Merge, Validasi data, Format bersyarat, Selesai = Done, Oke). Submenus open on hover, not click. Click inputs in side panels through locators (`input.waffle-range-selection-input`, `input.waffle-conditionalformat-arg1`) and `fill()` them: Ctrl+A with the grid focused selects the whole sheet and typed text lands in a cell.
- **Verify with a fresh export and a screenshot** of the changed area before reporting; close the Sheets tabs when done.
