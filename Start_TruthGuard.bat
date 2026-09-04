@echo off
title TruthGuard AI - Launcher
cd /d "%~dp0"
echo ===================================================
echo           Starting TruthGuard AI System
echo ===================================================
echo.
echo Starting Next.js Web Server on http://localhost:3000...
start /b cmd /c "npx next start -p 3000"
timeout /t 3 >nul

echo Starting Public Tunnel...
echo.
echo Your local URL is: http://localhost:3000
echo.
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=10 -R 80:127.0.0.1:3000 serveo.net
pause
