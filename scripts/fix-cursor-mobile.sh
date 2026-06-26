#!/usr/bin/env bash
# スマホで Cursor Cloud Agent のリポジトリ一覧に telecareer-engine が出ないときの診断・修復
#
# Mac/PC:
#   bash scripts/fix-cursor-mobile.sh
#   bash scripts/fix-cursor-mobile.sh --fresh-repo   # 既知不具合の回避: 新規リポジトリ作成
#
# スマホのみ:
#   bash scripts/fix-cursor-mobile.sh --guide

set -euo pipefail

OWNER="girinoguchi"
REPO="syokugyo"
FRESH_REPO="syokugyo-cloud"
DESCRIPTION="テレキャリアエンジン syokugyo telecareer-engine - エンタメ業界専門求人マッチング"

print_mobile_guide() {
  cat <<'GUIDE'

============================================================
  スマホで Cursor 開発を始める手順（重要）
============================================================

■ よくある原因
  - GitHub 側だけで Cursor App を入れても、Cursor 本体と同期されない
  - 一度 Cursor App を入れ直したリポジトリは一覧に出ない既知不具合がある
  - 検索に「テレキャリア」「エンジン」と入れても出ない（英語名のみ）

■ 手順 A（まず試す）— Cursor ダッシュボードから接続

  1. ブラウザで開く（Safari / Chrome）
     https://cursor.com/dashboard?tab=integrations

  2. GitHub の横にある Disconnect をタップ
     → 数秒待ってから Connect をタップ

  3. GitHub ログイン画面で girinoguchi アカウントを選ぶ
     → Repository access で必ず「All repositories」を選ぶ
        （個別選択だと telecareer-engine が漏れることがあります）

  4. Cloud Agent を開く
     https://cursor.com/agents
     （ホーム画面に追加するとアプリのように使えます）

  5. 新規 Agent → リポジトリ検索欄に
     syokugyo
     と入力（旧名 telecareer-engine では出ません）

■ 手順 B（手順 A でも出ない場合）— GitHub App を完全削除して再接続

  1. https://github.com/settings/installations
     → Cursor → Configure → Uninstall

  2. 2〜3 分待つ

  3. 手順 A の 1〜5 をもう一度（必ず Cursor ダッシュボードから Connect）

■ 手順 C（それでも出ない場合）— PR から Agent を起動（リポジトリ選択不要）

  1. GitHub アプリで girinoguchi/syokugyo を開く
  2. 任意の Pull Request を開く（なければ main からブランチを作る）
  3. コメント欄に @cursor と書いて指示を送る
     例: @cursor READMEの誤字を直して

  ※ GitHub App がリポジトリに入っていれば、一覧に出なくても動くことがあります

■ 手順 D（最終手段）— 新規リポジトリで回避

  Mac/PC で:
    bash scripts/fix-cursor-mobile.sh --fresh-repo

  作成されるリポジトリ: girinoguchi/syokugyo-cloud
  Cursor では syokugyo-cloud と検索

■ それでもダメな場合

  Cursor サポートに連絡（キャッシュクリア依頼）:
  hi@cursor.com
  内容: 「girinoguchi/syokugyo が Cloud Agent の
        リポジトリ一覧に表示されない。GitHub App は許可済み。」

============================================================
GUIDE
}

if [ "${1:-}" = "--guide" ]; then
  print_mobile_guide
  exit 0
fi

if [ -n "${GITHUB_TOKEN:-}" ]; then
  ghapi() { curl -sS -H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/vnd.github+json" "https://api.github.com/$1" "${@:2}"; }
  ghapi_post() { curl -sS -H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/vnd.github+json" -X POST "https://api.github.com/$1" "${@:2}"; }
  ghapi_patch() { curl -sS -H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/vnd.github+json" -X PATCH "https://api.github.com/$1" "${@:2}"; }
  ghapi_put() { curl -sS -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/vnd.github+json" "https://api.github.com/$1" "${@:2}"; }
elif gh auth status >/dev/null 2>&1; then
  ghapi() { gh api "$@"; }
  ghapi_post() { gh api -X POST "$@"; }
  ghapi_patch() { gh api -X PATCH "$@"; }
  ghapi_put() { gh api -X PUT "$@" >/dev/null; echo "204"; }
else
  print_mobile_guide
  exit 1
fi

create_fresh_repo() {
  echo "==> 新規リポジトリ作成: ${OWNER}/${FRESH_REPO}"
  echo "    （Cursor App 未インストールのクリーンなリポジトリ）"
  EXISTING=$(ghapi "repos/${OWNER}/${FRESH_REPO}" 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('id') or '')" 2>/dev/null || true)
  if [ -z "$EXISTING" ]; then
    ghapi_post "user/repos" -d "{\"name\":\"${FRESH_REPO}\",\"description\":\"${DESCRIPTION}\",\"private\":true}" >/dev/null
    echo "    作成完了"
  else
    echo "    既に存在します"
  fi

  ROOT="$(cd "$(dirname "$0")/.." && pwd)"
  cd "$ROOT"
  if git remote get-url cloud 2>/dev/null; then
    git remote set-url cloud "https://github.com/${OWNER}/${FRESH_REPO}.git"
  else
    git remote add cloud "https://github.com/${OWNER}/${FRESH_REPO}.git"
  fi
  echo "==> main ブランチを push"
  git push -u cloud HEAD:main
  echo ""
  echo "✅ 完了: https://github.com/${OWNER}/${FRESH_REPO}"
  echo ""
  echo "次の操作（スマホ可）:"
  echo "  1. https://cursor.com/dashboard?tab=integrations"
  echo "     → GitHub Disconnect → Connect → All repositories"
  echo "  2. https://cursor.com/agents → 新規 Agent"
  echo "  3. 検索: syokugyo-cloud"
  echo ""
  echo "※ この新規リポジトリには GitHub から直接 Cursor App を入れないでください"
  echo "  必ず Cursor ダッシュボードの Connect から許可してください"
}

if [ "${1:-}" = "--fresh-repo" ]; then
  create_fresh_repo
  exit 0
fi

echo "==> 診断: ログイン中の GitHub ユーザー"
ME=$(ghapi "user" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('login','?'))")
echo "    login: ${ME}"
if [ "$ME" != "$OWNER" ]; then
  echo "    ⚠️  リポジトリ所有者は ${OWNER} です。Cursor も同じ GitHub アカウントでログインしてください。"
fi

echo "==> 診断: ${OWNER}/${REPO}"
REPO_JSON=$(ghapi "repos/${OWNER}/${REPO}" 2>/dev/null || echo '{}')
REPO_ID=$(echo "$REPO_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id') or '')" 2>/dev/null || true)
if [ -z "$REPO_ID" ]; then
  echo "    ❌ リポジトリが見つかりません（アクセス権限または存在を確認）"
  exit 1
fi
PRIVATE=$(echo "$REPO_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin).get('private'))")
echo "    id: ${REPO_ID}  private: ${PRIVATE}"

echo "==> リポジトリ説明を検索向けに更新"
ghapi_patch "repos/${OWNER}/${REPO}" -d "{\"description\":\"${DESCRIPTION}\"}" >/dev/null
echo "    更新完了"

echo "==> Cursor GitHub App の状態"
INSTALL_JSON=$(ghapi "user/installations")
python3 <<'PY' "$INSTALL_JSON" "$REPO_ID"
import json, sys
data = json.loads(sys.argv[1])
repo_id = int(sys.argv[2])
found = False
for inst in data.get("installations", []):
    if inst.get("app_slug") != "cursor":
        continue
    found = True
    print(f"    installation id: {inst['id']}")
    print(f"    repository_selection: {inst.get('repository_selection')}")
    repos = inst.get("repositories_url")
    print(f"    repos API: {repos}")
if not found:
    print("    ❌ Cursor App 未インストール")
    print("    → https://cursor.com/dashboard?tab=integrations から Connect")
    sys.exit(1)
PY

INSTALL_ID=$(echo "$INSTALL_JSON" | python3 -c "
import sys, json
for i in json.load(sys.stdin).get('installations', []):
    if i.get('app_slug') == 'cursor':
        print(i['id'])
        break
")

echo "==> syokugyo を Cursor App に追加"
CODE=$(ghapi_put "user/installations/${INSTALL_ID}/repositories/${REPO_ID}" || echo "000")
if [ "$CODE" = "204" ] || [ "$CODE" = "200" ]; then
  echo "    ✅ 追加成功"
else
  echo "    ℹ️  HTTP ${CODE}（All repositories 設定の可能性）"
fi

echo ""
print_mobile_guide
