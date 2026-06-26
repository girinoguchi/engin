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
    local code
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "$url/" 2>/dev/null || echo "000")
    if [[ "$code" == "200" || "$code" == "301" || "$code" == "302" || "$code" == "307" || "$code" == "308" ]]; then
      return 0
    fi
    echo "[tunnel-watchdog] HTTP $code for $url"
    return 1
  fi
  if [[ "$url" == *loca.lt* ]]; then
    curl -sf --max-time 20 -H "Bypass-Tunnel-Reminder: true" "$url/" >/dev/null 2>&1
    return $?
  fi
  return 1
}

tunnel_process_running() {
  pgrep -f "/tmp/cloudflared tunnel" >/dev/null 2>&1
}

restart_tunnel() {
  echo "[tunnel-watchdog] Restarting cloudflared ..."
  pkill -f "/tmp/cloudflared tunnel" 2>/dev/null || true
  rm -f "$URL_FILE"
  tmux $TMUX_CONF kill-session -t preview-tunnel 2>/dev/null || true
  tmux $TMUX_CONF kill-session -t demo-tunnel 2>/dev/null || true
  tmux $TMUX_CONF new-session -d -s preview-tunnel -c "$ROOT" -- bash -lc 'bash scripts/run-cloudflared.sh'
}

echo "[tunnel-watchdog] Monitoring $URL_FILE (every ${CHECK_INTERVAL}s) ..."
while true; do
  if ! tunnel_process_running; then
    echo "[tunnel-watchdog] cloudflared process not running"
    restart_tunnel
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
    echo "[tunnel-watchdog] Unhealthy: ${URL:-<empty>}"
    restart_tunnel
    sleep 20
    continue
  fi
  sleep "$CHECK_INTERVAL"
done
