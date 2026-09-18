@echo off
setlocal
cd /d "%~dp0..\.."
node scripts\arena-eval.mjs --model current-v2 --challenge model-limit-v2 --skip-balance
exit /b %ERRORLEVEL%
