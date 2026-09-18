@echo off
chcp 65001 >nul 2>&1
title YOUXX Stop

echo ========================================
echo   YOUXX Project - One Click Stop
echo ========================================
echo.

echo [1/3] Stopping Redis...
taskkill /FI "WINDOWTITLE eq YOUXX-Redis*" /F >nul 2>&1
echo        Redis stopped.

echo [2/3] Stopping Backend (port 8081)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8081" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
taskkill /FI "WINDOWTITLE eq YOUXX-Backend*" /F >nul 2>&1
echo        Backend stopped.

echo [3/4] Stopping User Frontend (port 8080)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
taskkill /FI "WINDOWTITLE eq YOUXX-UserFrontend*" /F >nul 2>&1
echo        User Frontend stopped.

echo [4/4] Stopping Admin Frontend (port 8079)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8079" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
taskkill /FI "WINDOWTITLE eq YOUXX-AdminFrontend*" /F >nul 2>&1
echo        Admin Frontend stopped.

echo.
echo ========================================
echo   All services stopped!
echo ========================================
echo.
pause
