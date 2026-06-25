#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
DATA_DIR="$ROOT/.data"
mkdir -p "$DATA_DIR"

# dev server
if ! curl -sf http://127.0.0.1:3000/ >/dev/null 2>&1; then
  echo "[mobile-preview] Starting dev server ..."
  if command -v lsof >/dev/null 2>&1; then
    PIDS=$(lsof -ti :3000 2>/dev/null || true)
    [ -n "$PIDS" ] && kill $PIDS 2>/dev/null || true
    sleep 1
  fi
  npm run dev
else
  echo "[mobile-preview] Dev server already running on :3000"
  tail -f /dev/null
fi
