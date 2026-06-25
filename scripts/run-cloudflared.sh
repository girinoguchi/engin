#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$ROOT/.data"
mkdir -p "$DATA_DIR"
LOG="$DATA_DIR/cloudflared.log"
URL_FILE="$DATA_DIR/preview-url.txt"

CF_BIN="/tmp/cloudflared"
if [ ! -x "$CF_BIN" ]; then
  curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o "$CF_BIN"
  chmod +x "$CF_BIN"
fi

echo "[cloudflared] Waiting for dev server on :3000 ..."
for i in $(seq 1 60); do
  if curl -sf http://127.0.0.1:3000/ >/dev/null 2>&1; then break; fi
  sleep 1
done

: >"$LOG"
echo "[cloudflared] Starting tunnel (logs: $LOG) ..."
"$CF_BIN" tunnel --url http://127.0.0.1:3000 2>&1 | tee -a "$LOG" &
CF_PID=$!

for i in $(seq 1 30); do
  URL=$(rg -o 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG" 2>/dev/null | tail -1 || true)
  if [ -n "$URL" ]; then
    echo "$URL" >"$URL_FILE"
    echo "[cloudflared] Public URL: $URL"
    break
  fi
  sleep 1
done

wait $CF_PID
