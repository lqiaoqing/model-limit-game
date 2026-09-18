@echo off
setlocal EnableExtensions
title Neon Siege - Start
cd /d "%~dp0"

set "ROOT=%CD%"
set "PS1=%ROOT%\scripts\windows\Start-GameHidden.ps1"

where node >nul 2>&1
if errorlevel 1 (
  echo [error] Node.js not found in PATH.
  echo Install Node.js 20+ from https://nodejs.org then double-click again.
  pause
  exit /b 1
)

if not exist "%ROOT%\node_modules\vite\bin\vite.js" (
  echo [setup] Installing dependencies, first run only...
  call npm install
  if errorlevel 1 (
    echo [error] npm install failed.
    pause
    exit /b 1
  )
)

if not exist "%PS1%" (
  echo [error] Missing script: %PS1%
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%"
set "RC=%ERRORLEVEL%"

if not "%RC%"=="0" (
  echo.
  echo [error] Launch failed code %RC%. See logs\dev-err.log
  pause
  exit /b %RC%
)

exit /b 0