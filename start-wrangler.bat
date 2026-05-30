@echo off
cd /d "%~dp0"
echo Make sure schema is applied locally first:
echo   npx wrangler d1 execute vibefocus-db --local --file=schema.sql
echo.
echo Starting Vite...
start "VibeFocus - Vite" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul
echo Starting Wrangler (D1 + functions)...
start "VibeFocus - Wrangler" cmd /k "npx wrangler pages dev --proxy 5173"
timeout /t 2 /nobreak > nul
start http://localhost:8788
echo App with D1 running at http://localhost:8788
