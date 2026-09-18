@echo off
chcp 65001 >nul 2>&1
title YOUXX Start

echo ========================================
echo   YOUXX Project - One Click Start
echo ========================================
echo.

echo [1/4] Starting Redis...
start "YOUXX-Redis" /D "D:\Redis-8.8.0\Redis" cmd /c "start.bat"
echo        Redis started.

timeout /t 3 /nobreak >nul

echo [2/4] Starting Backend (Spring Boot)...
start "YOUXX-Backend" /D "d:\webjava\youxx_backend" cmd /k "mvnw.cmd spring-boot:run"
echo        Backend started (port 8081).

echo [3/4] Starting User Frontend (Vue)...
start "YOUXX-UserFrontend" /D "d:\webjava\youxx_user" cmd /k "npm run serve"
echo        User Frontend started (port 8080).

timeout /t 3 /nobreak >nul

echo [4/4] Starting Admin Frontend (Vue)...
start "YOUXX-AdminFrontend" /D "d:\webjava\youxx_admin" cmd /k "npm run serve"
echo        Admin Frontend started (port 8079).

echo.
echo ========================================
echo   All services started!
echo   Backend API      : http://localhost:8081
echo   User Frontend    : http://localhost:8080
echo   Admin Frontend   : http://localhost:8079
echo ========================================
echo.
echo   Press Ctrl+C in each window to stop.
echo.
pause
