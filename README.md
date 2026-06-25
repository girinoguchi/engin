# テレキャリア人材マッチング

エンタメ業界で働きたい人（求職者）と、エンタメ求人をつなぐマッチングサービスです。求職者はエキストラ・音響・照明・制作などのエンタメ特化求人を検索・応募でき、管理者は求人の登録・管理と応募の確認ができます。

## 技術スタック

- **Next.js 14**（App Router）
- **TypeScript**
- **Tailwind CSS**
- **Supabase**（Auth / Database）

## 初回セットアップ手順

### 1. リポジトリのクローンと依存関係

```bash
cd テレキャリア人材マッチング
npm install
```

### 2. Supabase プロジェクト作成

1. [Supabase](https://supabase.com) にログインし、新規プロジェクトを作成
2. プロジェクトの **Settings → API** から以下を控える:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. 環境変数

プロジェクトルートに `.env.local` を作成:

```env
NEXT_PUBLIC_SUPABASE_URL=あなたのProject URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのanon key
```

（`.env.example` をコピーしてリネームし、値を埋めても可）

### 4. データベースのセットアップ

1. Supabase ダッシュボードで **SQL Editor** を開く
2. `supabase/schema.sql` の内容をそのまま実行（テーブル・RLS・ポリシー作成）
3. 続けて `supabase/seed.sql` を実行（サンプル人材2件を投入）

### 5. 管理者アカウントの作り方

1. **会員登録**で通常どおりアカウントを作成（/signup）
2. Supabase ダッシュボードの **Table Editor** で **profiles** を開く
3. 作成したユーザーの行の **role** を `member` から **`admin`** に変更して保存

これでそのアカウントでログインすると「管理」リンクが表示され、管理者ダッシュボード・人材の追加・編集・削除・依頼一覧が利用できます。

### 6. 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## デモプレビュー（Supabase なし）

Supabase の設定なしで UI をブラウザ確認したい場合は、**`.env.local` を作らない**（または Supabase の値を空にする）だけでデモモードが有効になります。

### ローカルで起動

```bash
npm install
npm run demo
```

### Docker で起動（推奨・常時プレビュー向け）

サーバーに Docker があれば、依存関係のインストールから本番ビルド・起動まで一発で行えます。

```bash
npm run docker:demo
```

バックグラウンドで起動する場合:

```bash
npm run docker:demo:detach
```

起動後は **http://サーバーのIP:3000** でアクセスできます。VPS や社内サーバーに置いておけば、毎回スクリーンショットを撮らなくてもブラウザで確認できます。

### デモ用テストアカウント

| 種別 | メール | パスワード |
|------|--------|------------|
| 会員 | `member@demo.local` | `demo123` |
| 管理者 | `admin@demo.local` | `demo123` |

※ 管理画面（`/admin`）はデモでは未対応です。人材名簿・ログイン・会員登録の動作確認用です。

### Vercel などへのデプロイ

ホスティング先で **Supabase の環境変数を設定しなければ** 自動的にデモモードで動作します。本番運用時のみ `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定してください。

## ルーティング

| パス | 説明 |
|------|------|
| `/` | トップページ |
| `/signup` | 会員登録 |
| `/login` | ログイン |
| `/jobs` | 案件一覧（単発・中長期・社員募集でフィルタ／キーワード検索） |
| `/jobs/[id]` | 案件詳細・応募フォーム（年齢・住所・電話番号・性別を入力して応募） |
| `/talents` | 名簿一覧（検索・フィルタ・おすすめ順） |
| `/talents/[id]` | 人材詳細・依頼ボタン |
| `/admin` | 管理者ダッシュボード（管理者のみ） |
| `/admin/jobs` | 案件管理（管理者のみ） |
| `/admin/jobs/new` | 案件を新規投稿（管理者のみ） |
| `/admin/jobs/[id]/edit` | 案件編集（管理者のみ） |
| `/admin/applications` | 応募一覧・対応状況の更新（管理者のみ） |
| `/admin/talents/new` | 人材追加（管理者のみ） |
| `/admin/talents/[id]/edit` | 人材編集（管理者のみ） |
| `/admin/requests` | 依頼一覧（管理者のみ） |

## ビルド・デプロイ

```bash
npm run build
npm start
```

Vercel などにデプロイする場合は、環境変数に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定してください。

## 今後追加すべき機能（TODO）

- [ ] 通知メールの本実装（依頼時に管理者へメール送信）
- [ ] チャット・評価・レビュー・お気に入り
- [ ] 高度なレコメンド（AI など）
- [ ] 複雑な権限管理（複数管理者ロールなど）
- [ ] プロフィール画像アップロード（Supabase Storage）
- [ ] 会員向け「自分の依頼一覧」ページ
- [ ] 管理者用ログ（admin_logs テーブル）

---

## この MVP で不足している点

- 依頼時のメール通知は未実装（画面内の「送信しました」のみ）
- 会員が「自分が送った依頼一覧」を見る画面がない
- プロフィール画像のアップロードは未対応
- パスワードリセット・メール確認の導線は Supabase 標準のまま
- エラーハンドリング・バリデーションは最小限

## 2日目以降に追加すべき機能

1. **依頼メール通知**（Supabase Edge Functions または外部サービスで依頼作成時にメール送信）
2. **会員マイページ**（自分の依頼一覧・プロフィール編集）
3. **プロフィール画像**（Supabase Storage + 画像URL保存）
4. **管理ログ**（誰がいつ人材を追加・編集・削除したか）
5. **検索の UX 改善**（タグのサジェスト、保存検索など）

## 本番運用前に必要な対応

- 本番用 Supabase プロジェクトの作成と環境変数の切り替え
- メール送信設定（Supabase Auth のメールテンプレート・送信元ドメイン）
- ドメイン・HTTPS の設定
- 定期的なバックアップ（Supabase のバックアップ設定確認）
- 利用規約・プライバシーポリシー・特定商取引法に基づく表記（必要に応じて）

## セキュリティ上の注意点

- **anon key** はクライアントに露出するため、RLS（Row Level Security）で必ずアクセスを制限している。本番では RLS を無効にしないこと。
- 管理者判定は `profiles.role = 'admin'` に依存。管理者の付与は Supabase ダッシュボードまたは信頼できる運用のみで行うこと。
- 本番では Supabase の「Email confirmations」を有効にし、メール確認済みユーザーのみ利用可能にすることを推奨。
- パスワードポリシー（最低文字数・複雑さ）は Supabase Auth の設定で強化可能。
