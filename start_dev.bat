@echo off
title Halo Full Stack Development Server
color 0B

echo =================================================================
echo             HALO - HAIRCARE, CLARIFIED
echo    Launching Backend and Frontend in a Unified Session
echo =================================================================
echo.

set ROOT_DIR=%~dp0
set PATH=%ROOT_DIR%node_bin\node-v20.18.0-win-x64;%PATH%

echo [1/2] Launching Django REST Backend on Port 8000...
start /B "" "%ROOT_DIR%backend\venv\Scripts\python.exe" "%ROOT_DIR%backend\manage.py" runserver 127.0.0.1:8000 --noreload

timeout /t 3 /nobreak > nul

echo [2/2] Launching Vite Frontend on Port 5173...
echo.
echo =================================================================
echo   Backend API:    http://127.0.0.1:8000/api/
echo   Frontend Store: http://localhost:5173/
echo =================================================================
echo.
echo Press Ctrl+C in this terminal anytime to stop both servers.
echo.

cd /d "%ROOT_DIR%frontend"
npm run dev
