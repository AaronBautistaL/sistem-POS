#!/bin/bash
# =============================================
# Sistema POS — Lanzador modo kiosco (macOS)
# =============================================
# Uso: doble clic en este archivo o ejecutar desde terminal
# Requiere: Google Chrome o Microsoft Edge instalado

PORT=5173
APP_URL="http://localhost:$PORT"

# Detectar navegador disponible
if [ -d "/Applications/Google Chrome.app" ]; then
  BROWSER="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
  BROWSER="/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
else
  echo "Error: No se encontró Google Chrome ni Microsoft Edge."
  exit 1
fi

# Verificar si el servidor ya está corriendo
if ! curl -s "$APP_URL" > /dev/null 2>&1; then
  echo "Iniciando servidor POS..."
  cd "$(dirname "$0")"
  npm run dev &
  SERVER_PID=$!
  sleep 3
fi

# Lanzar en modo kiosco (sin notificaciones, sin barra del navegador)
"$BROWSER" \
  --kiosk \
  --no-first-run \
  --disable-infobars \
  --disable-translate \
  --disable-features=TranslateUI \
  --noerrdialogs \
  --disable-session-crashed-bubble \
  "$APP_URL"
