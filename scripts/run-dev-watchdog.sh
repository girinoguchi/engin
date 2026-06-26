#!/usr/bin/env bash
# 開発サーバー (:3000) の死活監視。落ちたら自動再起動する。
set -euo pipefail
cd "$(dirname "$0")/.."
CHECK_INTERVAL="${CHECK_INTERVAL:-20}"

echo "[dev-watchdog] Monitoring http://127.0.0.1:3000 (every ${CHECK_INTERVAL}s) ..."

while true; do
  if curl -sf --max-time 5 http://127.0.0.1:3000/ >/dev/null 2>&1; then
    sleep "$CHECK_INTERVAL"
    continue
  fi

  echo "[dev-watchdog] Dev server down — restarting ..."
  if command -v lsof >/dev/null 2>&1; then
    PIDS=$(lsof -ti :3000 2>/dev/null || true)
    [ -n "$PIDS" ] && kill $PIDS 2>/dev/null || true
    sleep 1
  fi

  npm run dev
  sleep 5
done
