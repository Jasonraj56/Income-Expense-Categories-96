@echo off
title FinTrack Project Launcher
color 0A

echo =======================================================
echo          FinTrack - Web Technology Project
echo        Income, Expenses and Category Manager
echo =======================================================
echo.
echo [1/2] Starting Node.js + Express Backend Server...
start "FinTrack Backend Server (Port 5000)" cmd /k "cd /d "%~dp0server" && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React.js Frontend Application...
start "FinTrack React Frontend (Port 3000)" cmd /k "cd /d "%~dp0client" && npm start"

echo.
echo =======================================================
echo Both servers are launching in separate windows!
echo - Backend:  http://localhost:5000
echo - Frontend: http://localhost:3000
echo - Database: MongoDB Atlas (Cloud Connected)
echo =======================================================
echo.
pause

