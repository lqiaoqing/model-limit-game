@echo off
setlocal EnableExtensions
title Neon Siege - Stop
cd /d "%~dp0"

set "PS1=%~dp0scripts\windows\Stop-GameHidden.ps1"

if not exist "%PS1%" (
  echo [error] Missing script: %PS1%
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%"
exit /b 0