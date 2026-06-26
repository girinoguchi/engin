# テレキャリアエンジン（engin）— エンタメ求人マッチング

エンタメ業界専門の求人マッチングサービス **「エンジン」** の Next.js アプリです。

GitHub: `girinoguchi/engin`  
職業タイプ診断（MBTI）は別リポジトリ `girinoguchi/syokugyo` です。

## デモ起動

```bash
npm install
npm run demo
```

http://localhost:3000

## デモアカウント

| 種別 | ID | PASS |
|------|-----|------|
| 会員 | `member@demo.local` | `demo123` |
| 管理者 | `admin` | `admin` |

## 主な機能

- 求人検索・応募（`/jobs`）
- 管理者ダッシュボード（`/admin`）— 案件・アカウント CRUD
- スマホプレビュー（`npm run mobile`）
- デモ認証（Supabase 不要）

## Cursor で開く

1. https://cursor.com/agents
2. リポジトリ: `girinoguchi/engin`
3. ブランチ: `main`

## 技術スタック

- Next.js 14（App Router）
- TypeScript / Tailwind CSS
- Supabase（本番用、未設定時はデモモード）
