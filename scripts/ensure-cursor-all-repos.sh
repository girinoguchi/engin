#!/usr/bin/env bash
# syokugyo（テレキャリアエンジン）を Cursor の「All repositories」に常時表示させる
#
# Mac/PC:
#   bash scripts/ensure-cursor-all-repos.sh
#   GITHUB_TOKEN=ghp_xxxx bash scripts/ensure-cursor-all-repos.sh
#
# スマホのみ（手順表示）:
#   bash scripts/ensure-cursor-all-repos.sh --guide

set -euo pipefail

OWNER="girinoguchi"
REPO="engin"
DESCRIPTION="テレキャリアエンジン syokugyo telecareer-engine - エンタメ業界専門求人マッチング"
TOPICS='["syokugyo","telecareer","telecareer-engine","cursor","engine"]'

print_all_repos_guide() {
  cat <<'GUIDE'

============================================================
  All repositories に表示して常に開けるようにする手順
============================================================

■ スクショの見方
  - Recent に「girinoguchi/syokugyo ✓」があれば、それがテレキャリアエンジンです
  - All Repositories に3件しかない = GitHub の Cursor App が
    「Only select repositories」になっています

■ 1. GitHub で All repositories にする（これが未完了です）

  スマホのブラウザで:
  https://github.com/settings/installations

  → 「Cursor」をタップ
  → 「Configure」をタップ
  → Repository access で「All repositories」を選ぶ
     ※「Only select repositories」になっていたら切り替え
  → Save / Update

■ 2. Cursor ダッシュボードで再接続

  https://cursor.com/dashboard?tab=integrations

  → GitHub の Disconnect
  → 数秒待つ
  → Connect
  → Repository access で「All repositories」を選ぶ

■ 3. Cloud Agent で開く

  https://cursor.com/agents
  → 新規 Agent
  → 検索欄: syokugyo
     （旧名 telecareer でも説明文に含まれます）

■ 4. スマホアプリ化（任意）

  Safari: 共有 → ホーム画面に追加
  Chrome: メニュー → アプリをインストール

■ Mac/PC で自動設定する場合

  gh auth login
  npm run ensure:cursor:all

============================================================
GUIDE
}

setup_ghapi() {
  if [ -n "${GITHUB_TOKEN:-}" ]; then
    ghapi() { curl -sS -H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/vnd.github+json" "https://api.github.com/$1" "${@:2}"; }
    ghapi_put() { curl -sS -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/vnd.github+json" "https://api.github.com/$1" "${@:2}"; }
    ghapi_patch() { curl -sS -H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/vnd.github+json" -X PATCH "https://api.github.com/$1" "${@:2}"; }
    ghapi_topics() { curl -sS -H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/vnd.github.mercy-preview+json" -X PUT "https://api.github.com/$1" "${@:2}"; }
  elif gh auth status >/dev/null 2>&1; then
    ghapi() { gh api "$@"; }
    ghapi_put() { gh api -X PUT "$@" >/dev/null; echo "204"; }
    ghapi_patch() { gh api -X PATCH "$@"; }
    ghapi_topics() { gh api -X PUT -H "Accept: application/vnd.github.mercy-preview+json" "$@"; }
  else
    return 1
  fi
}

if [ "${1:-}" = "--guide" ]; then
  print_all_repos_guide
  exit 0
fi

if ! setup_ghapi; then
  print_all_repos_guide
  exit 1
fi

echo "==> 1. GitHub ユーザー確認"
ME=$(ghapi "user" | python3 -c "import sys,json; print(json.load(sys.stdin).get('login','?'))")
echo "    login: ${ME}"
if [ "$ME" != "$OWNER" ]; then
  echo "    ⚠️  リポジトリ所有者は ${OWNER} です。Cursor も同じアカウントで接続してください。"
fi

echo "==> 2. リポジトリ確認: ${OWNER}/${REPO}"
REPO_JSON=$(ghapi "repos/${OWNER}/${REPO}" 2>/dev/null || echo '{}')
REPO_ID=$(echo "$REPO_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id') or '')" 2>/dev/null || true)
if [ -z "$REPO_ID" ]; then
  echo "    ❌ リポジトリが見つかりません"
  exit 1
fi
echo "    id: ${REPO_ID}"

echo "==> 3. 検索向けメタデータ更新"
ghapi_patch "repos/${OWNER}/${REPO}" -d "{\"description\":\"${DESCRIPTION}\"}" >/dev/null
ghapi_topics "repos/${OWNER}/${REPO}/topics" -d "{\"names\":${TOPICS}}" >/dev/null 2>&1 || echo "    ℹ️  topics 更新はスキップ（権限不足の可能性）"
echo "    description / topics 更新完了"

echo "==> 4. Cursor GitHub App 確認"
INSTALL_JSON=$(ghapi "user/installations")
INSTALL_ID=$(echo "$INSTALL_JSON" | python3 -c "
import sys, json
for i in json.load(sys.stdin).get('installations', []):
    if i.get('app_slug') == 'cursor':
        print(i['id'])
        break
")
SELECTION=$(echo "$INSTALL_JSON" | python3 -c "
import sys, json
for i in json.load(sys.stdin).get('installations', []):
    if i.get('app_slug') == 'cursor':
        print(i.get('repository_selection', '?'))
        break
")

if [ -z "$INSTALL_ID" ]; then
  echo "    ❌ Cursor App 未インストール"
  echo "    → https://cursor.com/dashboard?tab=integrations から Connect"
  echo "       （Repository access: All repositories）"
  exit 1
fi

echo "    installation id: ${INSTALL_ID}"
echo "    repository_selection: ${SELECTION}"
echo "    設定画面: https://github.com/settings/installations/${INSTALL_ID}"

if [ "$SELECTION" != "all" ]; then
  echo "==> 5. All repositories へ切り替え試行"
  PATCH_RESULT=$(ghapi_patch "user/installations/${INSTALL_ID}" -d '{"repository_selection":"all"}' 2>/dev/null || echo "failed")
  NEW_SELECTION=$(ghapi "user/installations" | python3 -c "
import sys, json
for i in json.load(sys.stdin).get('installations', []):
    if i.get('app_slug') == 'cursor':
        print(i.get('repository_selection', '?'))
        break
")
  if [ "$NEW_SELECTION" = "all" ]; then
    echo "    ✅ All repositories に切り替え成功"
  else
    echo "    ⚠️  API では切り替えできませんでした"
    echo "    手動で設定してください:"
    echo "    https://github.com/settings/installations/${INSTALL_ID}"
    echo "    → Repository access → All repositories → Save"
  fi
else
  echo "==> 5. すでに All repositories です"
fi

echo "==> 6. syokugyo を明示的に許可リストへ追加"
CODE=$(ghapi_put "user/installations/${INSTALL_ID}/repositories/${REPO_ID}" || echo "000")
if [ "$CODE" = "204" ] || [ "$CODE" = "200" ]; then
  echo "    ✅ 追加成功"
else
  echo "    ℹ️  HTTP ${CODE}（All repositories なら不要）"
fi

echo "==> 7. 許可状態の確認"
ACCESSIBLE=$(ghapi "user/installations/${INSTALL_ID}/repositories?per_page=100" | python3 -c "
import sys, json
data = json.load(sys.stdin)
repos = data.get('repositories', [])
target = '${REPO}'
for r in repos:
    if r.get('name') == target:
        print('yes')
        break
else:
    sel = '${SELECTION}'
    if sel == 'all':
        print('all-mode')
    else:
        print('no')
")
case "$ACCESSIBLE" in
  yes) echo "    ✅ syokugyo は許可済み" ;;
  all-mode) echo "    ✅ All repositories モード（全リポジトリ許可）" ;;
  *) echo "    ⚠️  まだ許可されていない可能性あり" ;;
esac

echo ""
echo "============================================"
echo "  最後に必ず実行（スマホ可）:"
echo "  https://cursor.com/dashboard?tab=integrations"
echo "  GitHub → Disconnect → Connect"
echo "  → All repositories を選択"
echo ""
echo "  開く: https://cursor.com/agents"
echo "  検索: syokugyo"
echo "============================================"
print_all_repos_guide
