#!/usr/bin/env bash
# デモ環境を常時起動: dev サーバー + 公開トンネル + 死活監視
set -euo pipefail
cd "$(dirname "$0")/.."
TMUX_CONF="-f /exec-daemon/tmux.portal.conf"
DATA_DIR=".data"
mkdir -p "$DATA_DIR"

# 旧ターミナル構成（dev / mobile 個別起動）を止めて demo-stack に統一
for legacy in dev-server mobile-preview; do
  tmux $TMUX_CONF kill-session -t "$legacy" 2>/dev/null || true
done

start_session() {
  local name="$1"
  local cmd="$2"
  if tmux $TMUX_CONF has-session -t "$name" 2>/dev/null; then
    echo "[demo-stack] session exists: $name"
    return 0
  fi
  tmux $TMUX_CONF new-session -d -s "$name" -c "$(pwd)" -- bash -lc "$cmd"
  echo "[demo-stack] started: $name"
}

chmod +x scripts/run-dev-watchdog.sh scripts/run-cloudflared.sh scripts/run-tunnel-watchdog.sh scripts/run-dev-server.sh 2>/dev/null || true

start_session "demo-dev" "bash scripts/run-dev-watchdog.sh"
start_session "preview-tunnel" "bash scripts/run-cloudflared.sh"
start_session "tunnel-watchdog" "bash scripts/run-tunnel-watchdog.sh"

echo "[demo-stack] Waiting for dev server ..."
for i in $(seq 1 60); do
  curl -sf --max-time 3 http://127.0.0.1:3000/ >/dev/null 2>&1 && break
  sleep 1
done

echo "[demo-stack] Waiting for public URL ..."
URL=""
for i in $(seq 1 60); do
  if [ -f "$DATA_DIR/preview-url.txt" ]; then
    URL=$(tr -d '[:space:]' < "$DATA_DIR/preview-url.txt")
    if [ -n "$URL" ]; then
      break
    fi
  fi
  sleep 2
done

if [ -z "$URL" ]; then
  echo "[demo-stack] Failed to obtain public URL. See $DATA_DIR/cloudflared.log"
  exit 1
fi

echo "$URL" >"$DATA_DIR/preview-url.txt"
date -u +"%Y-%m-%dT%H:%M:%SZ" >"$DATA_DIR/preview-url.updated"

echo ""
echo "============================================"
echo "  デモページ（常時起動中）"
echo "  $URL"
echo "============================================"
echo "  求人:   $URL/jobs"
echo "  ログイン: $URL/login"
echo "  会員: member@demo.local / demo123"
echo "  管理者: admin / admin"
echo "============================================"
echo ""
echo "※ URL はトンネル再起動時に変わることがあります。"
echo "  最新 URL はページ上部バナーまたは /api/preview-url で確認できます。"

# 起動状態を維持（Cursor 環境用）
tail -f /dev/null
