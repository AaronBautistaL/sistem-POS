@echo off
:: =============================================
:: Sistema POS — Lanzador modo kiosco (Windows)
:: =============================================
:: Uso: doble clic en este archivo
:: Requiere: Google Chrome o Microsoft Edge instalado

set PORT=5173
set APP_URL=http://localhost:%PORT%
set PROJECT_DIR=%~dp0

:: Buscar Chrome o Edge
set BROWSER=
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
  set BROWSER=C:\Program Files\Google\Chrome\Application\chrome.exe
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
  set BROWSER=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
) else if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
  set BROWSER=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
) else if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
  set BROWSER=C:\Program Files\Microsoft\Edge\Application\msedge.exe
)

if "%BROWSER%"=="" (
  echo Error: No se encontro Google Chrome ni Microsoft Edge.
  pause
  exit /b 1
)

:: Iniciar servidor si no está corriendo
curl -s %APP_URL% >nul 2>&1
if errorlevel 1 (
  echo Iniciando servidor POS...
  cd /d "%PROJECT_DIR%"
  start /min cmd /c "npm run dev"
  timeout /t 4 /nobreak >nul
)

:: Lanzar en modo kiosco
start "" "%BROWSER%" ^
  --kiosk ^
  --no-first-run ^
  --disable-infobars ^
  --disable-translate ^
  --disable-features=TranslateUI ^
  --noerrdialogs ^
  --disable-session-crashed-bubble ^
  %APP_URL%
