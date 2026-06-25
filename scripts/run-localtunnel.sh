#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$ROOT/.data"
mkdir -p "$DATA_DIR"
LOG="$DATA_DIR/localtunnel.log"
URL_FILE="$DATA_DIR/preview-url.txt"

echo "[localtunnel] Waiting for dev server on :3000 ..."
for i in $(seq 1 60); do
  if curl -sf http://127.0.0.1:3000/ >/dev/null 2>&1; then break; fi
  sleep 1
done

: >"$LOG"
echo "[localtunnel] Starting tunnel (logs: $LOG) ..."
npx --yes localtunnel --port 3000 2>&1 | tee -a "$LOG" &
LT_PID=$!

for i in $(seq 1 30); do
  URL=$(rg -o 'https://[a-z0-9-]+\.loca\.lt' "$LOG" 2>/dev/null | tail -1 || true)
  if [ -n "$URL" ]; then
    echo "$URL" >"$URL_FILE"
    echo "[localtunnel] Public URL: $URL"
    break
  fi
  sleep 1
done

wait $LT_PID
