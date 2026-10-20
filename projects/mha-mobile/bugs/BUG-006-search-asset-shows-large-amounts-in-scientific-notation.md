---
id: BUG-006
title: "Search Asset shows amounts of $10 million and more in scientific notation (\"$1.36449E8\")"
severity: minor
status: open
env: staging-hta
url: "Mobile app Search Asset > asset details (Acquisition Value); compared with MHA web Asset Details"
found: 2026-10-20
foundBy: "runs/2026-10-20 HTA run (MHM-006)"
tests: [MHM-006]
frequency: always
---
## Summary
The phone prints money amounts with Java's default number format: an amount of $10,000,000 or more shows in scientific notation, e.g. Acquisition Value "$1.36449E8" for $136,449,000.00. The value itself is right, but users read it as $1.36. Smaller amounts show as "$26145.0" (no thousands separator, one decimal), unlike MHA web's "$26,145.00".

## Steps to reproduce
1. Mobile app, agency HTA, account HTA-QAMOBILE (Test QA Mobile): Switch > Stocktaker | 338000
2. Search Asset > search 101000000323 > open the result
3. Look at Acquisition Value

## Expected
"$136,449,000.00", formatted like MHA web (Asset Details > Acquisition Value)

## Actual
"$1.36449E8"

## Evidence
- HTA UAT, 2026-10-20 17:00 WIB, read from the phone's view tree (acquisition_value = "$1.36449E8"); MHA web HTA shows $136,449,000.00 for the same asset
- MHM-006 failed on it in the HTA run (the test's amount parser read "1.364498")

## Environment
- Mobile app 2.0-dev on the emulator, HTA UAT (same app and formatting on SPF; SPF tests had only met smaller amounts)
- Env: staging-hta

## History
- 2026-10-20: filed from the first HTA run (MHM-006); linked to MHM-006 (expected to fail on assets of $10 million and more while open).
