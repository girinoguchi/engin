#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
TMUX_CONF="-f /exec-daemon/tmux.portal.conf"

start_session() {
  local name="$1"
  local cmd="$2"
  tmux $TMUX_CONF kill-session -t "$name" 2>/dev/null || true
  tmux $TMUX_CONF new-session -d -s "$name" -c "$(pwd)" -- bash -lc "$cmd"
}

chmod +x scripts/run-dev-server.sh scripts/run-localtunnel.sh

start_session "demo-dev" "bash scripts/run-dev-server.sh"
start_session "demo-tunnel" "bash scripts/run-localtunnel.sh"

echo "[mobile-preview] Waiting for public URL ..."
URL=""
for i in $(seq 1 45); do
  if [ -f .data/preview-url.txt ]; then
    URL=$(tr -d '[:space:]' < .data/preview-url.txt)
    if [ -n "$URL" ]; then
      if curl -sf --max-time 15 -H "Bypass-Tunnel-Reminder: true" "$URL/" >/dev/null 2>&1; then
        break
      fi
    fi
  fi
  sleep 2
done

if [ -z "$URL" ]; then
  echo "[mobile-preview] Failed to get working public URL."
  tail -15 .data/localtunnel.log 2>/dev/null || true
  exit 1
fi

echo ""
echo "============================================"
echo "  スマホで開く URL:"
echo "  $URL"
echo "============================================"
echo "  ログイン: $URL/login"
echo "  会員: member@demo.local / demo123"
echo "  管理者: admin / admin"
echo "============================================"
echo ""
echo "※ 初回アクセス時に「Click to Continue」が出たらタップしてください"
