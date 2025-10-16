@echo off
echo ===== Courier Connect Deployment =====
echo.

echo === Step 1: Building project ===
npm run build

if %ERRORLEVEL% NEQ 0 (
    echo Build failed with error code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

echo.
echo === Step 2: Deploying to Vercel ===
echo.

echo This will deploy to the custom domain: hostilian.org
echo Make sure you have Vercel CLI installed and are logged in.
echo.
set /p CONTINUE="Continue with deployment? (y/n): "

if /i "%CONTINUE%"=="y" (
    vercel --prod
) else (
    echo Deployment cancelled.
)

echo.
echo === Post-Deployment Verification ===
echo.
echo Don't forget to:
echo 1. Test the 404 page at https://hostilian.org/non-existent-route
echo 2. Verify all languages are working
echo 3. Check the 404 page on mobile
echo 4. Test navigation from the 404 page
echo.
echo See 404_FIX_SUMMARY.md for complete documentation.