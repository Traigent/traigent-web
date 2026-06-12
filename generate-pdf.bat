@echo off
REM Generate one-pager PDF
REM This script will:
REM 1. Install puppeteer if not already installed
REM 2. Start the dev server in the background
REM 3. Generate the PDF
REM 4. Save it to D:\2026 job search\TRAIGENT-AI\One-pager\

echo.
echo === Traigent One-Pager PDF Generator ===
echo.

REM Check if puppeteer is installed
npm list puppeteer >nul 2>&1
if errorlevel 1 (
    echo Installing puppeteer...
    call npm install puppeteer
    if errorlevel 1 (
        echo ERROR: Failed to install puppeteer
        exit /b 1
    )
)

echo.
echo Starting dev server...
echo.

REM Start dev server in background
start /B npm run dev >nul 2>&1

REM Wait for server to start
timeout /t 5 /nobreak

REM Run the PDF generation script
echo Generating PDF from one-pager-2...
echo.

node scripts/generate-one-pager-pdf.js

REM Capture the exit code
set PDF_EXIT_CODE=%errorlevel%

REM Kill the dev server
taskkill /F /IM node.exe >nul 2>&1

if %PDF_EXIT_CODE% equ 0 (
    echo.
    echo === SUCCESS ===
    echo PDF saved to: D:\2026 job search\TRAIGENT-AI\One-pager\traigent-one-pager.pdf
    echo.
) else (
    echo.
    echo === FAILED ===
    echo There was an error generating the PDF.
    echo.
)

exit /b %PDF_EXIT_CODE%
