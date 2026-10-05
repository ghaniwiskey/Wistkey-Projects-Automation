@echo off
title Run tests (no AI)
cd /d "%~dp0"
rem Runs every project's Playwright tests on this PC, no AI involved. Extra arguments pass through to
rem Playwright, e.g.  "Run Tests.cmd" --project=scg-store --grep @smoke
rem If a test is really broken, a heal request is saved and a prompt for Aside is copied to the clipboard.
set "NODE=node"
where node >nul 2>nul
if errorlevel 1 set "NODE=%USERPROFILE%\.aside\runtime\node\node.exe"
"%NODE%" test-manager\run-auto.mjs %*
pause
