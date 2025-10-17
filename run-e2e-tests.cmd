@echo off
REM =====================================================
REM Courier Connect - E2E Test Setup & Execution Script
REM =====================================================

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║         🧪 COURIER CONNECT E2E TESTS 🧪              ║
echo ║                                                      ║
echo ║         Setting up Playwright testing...            ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [1/3] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

echo.
echo [2/3] Installing Playwright browsers...
call npm run playwright:install
if errorlevel 1 (
    echo ❌ Failed to install Playwright browsers
    pause
    exit /b 1
)
echo ✅ Playwright browsers installed

echo.
echo [3/3] Launching Playwright UI...
echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║  ✅ Setup Complete! Opening Playwright UI...         ║
echo ║                                                      ║
echo ║  The UI will show:                                   ║
echo ║  - 90+ tests across 3 suites                         ║
echo ║  - Visual test runner                                ║
echo ║  - Step-by-step debugging                            ║
echo ║                                                      ║
echo ║  Press Ctrl+C to stop                                ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.

call npm run test:e2e

echo.
echo Tests completed!
pause
