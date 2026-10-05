@echo off
title Test Manager
cd /d "%~dp0"
rem Uses Node from PATH, or the Node that ships with Aside.
set "NODE=node"
where node >nul 2>nul
if errorlevel 1 set "NODE=%USERPROFILE%\.aside\runtime\node\node.exe"
echo Starting Test Manager at http://127.0.0.1:7358/  (close this window to stop it)
"%NODE%" test-manager\cli.mjs app --open
pause
