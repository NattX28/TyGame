@echo off
setlocal EnableDelayedExpansion

REM Define the base directory
set BASE_DIR=C:\Personal\University\Year2 Term2\Software Engineer\TyGame

REM Start services with titles
start "user-service" cmd /k "cd /d %BASE_DIR%\backend\user-service && air"
start "post-service" cmd /k "cd /d %BASE_DIR%\backend\post-service && air"
start "party-service" cmd /k "cd /d %BASE_DIR%\backend\party-service && air"
start "community-service" cmd /k "cd /d %BASE_DIR%\backend\community-service && air"
start "api-gateway" cmd /k "cd /d %BASE_DIR%\backend\api-gateway && air"
start "frontend" cmd /k "cd /d %BASE_DIR%\frontend && npm run dev"

REM Wait for windows to open
timeout /t 5 > nul

REM Run a simpler PowerShell command directly
powershell -ExecutionPolicy ByPass -File ".\arrange_windows.ps1"

endlocal