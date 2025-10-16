@echo off
echo ===== Courier Connect Deployment =====
echo.

echo === Step 0: Environment Variable Check ===
echo IMPORTANT: Ensure you've configured environment variables in Vercel!
echo Required variables: MONGODB_URI, JWT_SECRET, NEXT_PUBLIC_APP_URL
echo See VERCEL_ENV_SETUP.md for detailed instructions.
echo.
set /p ENVCHECK="Have you configured environment variables in Vercel? (y/n): "
if /i NOT "%ENVCHECK%"=="y" (
    echo Please configure environment variables first.
    echo Opening VERCEL_ENV_SETUP.md for reference...
    start notepad VERCEL_ENV_SETUP.md
    exit /b 1
)

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
echo 5. Verify API routes work (login, deliveries, tracking)
echo 6. Check MongoDB connection in logs
echo.
echo See 404_FIX_SUMMARY.md for documentation on the 404 page fix.
echo See VERCEL_ENV_SETUP.md for environment variable setup.