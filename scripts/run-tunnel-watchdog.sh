#!/usr/bin/env bash
# 公開プレビュー URL の死活監視。5xx のとき cloudflared を再起動する。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$ROOT/.data"
URL_FILE="$DATA_DIR/preview-url.txt"
TMUX_CONF="-f /exec-daemon/tmux.portal.conf"
CHECK_INTERVAL="${CHECK_INTERVAL:-30}"

check_url() {
  local url="$1"
  if [[ "$url" == *trycloudflare.com* ]]; then
    curl -sf --max-time 20 "$url/" >/dev/null 2>&1
    return $?
  fi
  if [[ "$url" == *loca.lt* ]]; then
    curl -sf --max-time 20 -H "Bypass-Tunnel-Reminder: true" "$url/" >/dev/null 2>&1
    return $?
  fi
  return 1
}

restart_tunnel() {
  echo "[tunnel-watchdog] Restarting cloudflared ..."
  tmux $TMUX_CONF kill-session -t preview-tunnel 2>/dev/null || true
  tmux $TMUX_CONF kill-session -t demo-tunnel 2>/dev/null || true
  tmux $TMUX_CONF new-session -d -s preview-tunnel -c "$ROOT" -- bash -lc 'bash scripts/run-cloudflared.sh'
}

restart_dev() {
  echo "[tunnel-watchdog] Restarting dev server ..."
  tmux $TMUX_CONF kill-session -t demo-dev 2>/dev/null || true
  tmux $TMUX_CONF kill-session -t dev-server 2>/dev/null || true
  tmux $TMUX_CONF new-session -d -s demo-dev -c "$ROOT" -- bash -lc 'bash scripts/run-dev-watchdog.sh'
}

check_dev() {
  curl -sf --max-time 5 http://127.0.0.1:3000/ >/dev/null 2>&1
}

echo "[tunnel-watchdog] Monitoring dev server + $URL_FILE (every ${CHECK_INTERVAL}s) ..."
while true; do
  if ! check_dev; then
    echo "[tunnel-watchdog] Dev server unhealthy"
    restart_dev
    sleep 20
    continue
  fi

  if [ ! -f "$URL_FILE" ]; then
    restart_tunnel
    sleep 15
    continue
  fi
  URL=$(tr -d '[:space:]' < "$URL_FILE")
  if [ -z "$URL" ] || ! check_url "$URL"; then
    echo "[tunnel-watchdog] Tunnel unhealthy: ${URL:-<empty>}"
    restart_tunnel
    sleep 20
    continue
  fi
  sleep "$CHECK_INTERVAL"
done
