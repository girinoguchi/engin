#!/usr/bin/env bash
# syokugyo の engin ブランチ（最新）を girinoguchi/engin の main に反映する
#
# 使い方:
#   gh auth login
#   bash scripts/sync-to-engin-repo.sh

set -euo pipefail

echo "==> syokugyo/engin ブランチを clone"
TMP=$(mktemp -d)
git clone --branch engin --single-branch https://github.com/girinoguchi/syokugyo.git "$TMP/engin-src"
cd "$TMP/engin-src"

echo "==> girinoguchi/engin に push"
if gh auth status >/dev/null 2>&1; then
  git remote remove origin 2>/dev/null || true
  gh repo view girinoguchi/engin >/dev/null 2>&1 || \
    gh repo create girinoguchi/engin --public --description "テレキャリアエンジン - エンタメ求人マッチング"
  git remote add origin "https://github.com/girinoguchi/engin.git"
  git push -f origin HEAD:main
else
  echo "❌ gh auth login が必要です"
  exit 1
fi

echo ""
echo "✅ 完了: https://github.com/girinoguchi/engin"
rm -rf "$TMP"
