@echo off
setlocal

REM Define the base directory
set BASE_DIR=E:\MyFloder\University\TyGame

REM Start user-service
start cmd /k "cd /d %BASE_DIR%\backend\user-service && air"

REM Start post-service
start cmd /k "cd /d %BASE_DIR%\backend\post-service && air"

REM Start party-service
start cmd /k "cd /d %BASE_DIR%\backend\party-service && air"

REM Start community-service
start cmd /k "cd /d %BASE_DIR%\backend\community-service && air"

@REM REM Start chat-service
@REM start cmd /k "cd /d %BASE_DIR%\backend\chat-service && air"

REM Start api-gateway
start cmd /k "cd /d %BASE_DIR%\backend\api-gateway && air"

REM Start frontend
start cmd /k "cd /d %BASE_DIR%\frontend && npm run dev"

endlocal