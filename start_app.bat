@echo off
title Smart Campus Dashboard Launcher
echo ===================================================
echo           Starting Smart Campus Dashboard          
echo ===================================================
echo.

cd /d "%~dp0"

echo Starting Backend Express Server (Port 5000)...
start "Smart Campus Backend" cmd /k "cd /d "%~dp0server" && npm start"

echo Starting Frontend Vite Client (Port 5173)...
start "Smart Campus Frontend" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo Both Frontend and Backend servers have been started in separate windows!
echo Access the frontend at: http://localhost:5173
echo.
pause
