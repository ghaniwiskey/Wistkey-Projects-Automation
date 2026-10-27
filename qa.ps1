# One entry point for this workspace (PowerShell): .\qa <command> [args]. ".\qa help" lists the commands.
# Calls node.exe directly: the node.cmd / npx shims re-parse arguments through cmd.exe and break e.g. --grep "A:|B:".
# Quote PowerShell specials: --grep '@smoke' (a bare @smoke is splatting), "A:|B:" (a bare | is a pipe).
$node = @(
  (Join-Path $env:USERPROFILE '.aside\runtime\node\node.exe'),
  (Get-Command node.exe -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty Source)
) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
if (-not $node) { Write-Error 'node.exe not found: install Node.js (or run inside Aside).'; exit 1 }
Push-Location $PSScriptRoot
try { & $node (Join-Path $PSScriptRoot 'test-manager\cli.mjs') @args } finally { Pop-Location }
exit $LASTEXITCODE
