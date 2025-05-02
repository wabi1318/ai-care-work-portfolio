# ケアスキル判定アプリ – **MVP 目標 (v1 / Vercel Stack)**

1. **ユーザーが日常のケア行動をテキスト入力できるフォームを提供**（Next.js + Tailwind CSS）
2. **Node.js API Route から OpenAI GPT-4 Turbo を呼び出し、ケアスキルカテゴリとスコアを推定**
3. **推定結果（カテゴリ・スコア・原文）を Supabase(PostgreSQL) に保存**
4. **保存済みケア行動の一覧（日時・カテゴリ・スコア）を時系列順に表示し、累積平均スコアをヘッダで確認**
5. **アプリ全体を Vercel にデプロイし、Preview Deploy で動作確認**

---

# タスクリスト (フェーズ + 詳細サブタスク)

## フェーズ 1 : 環境構築 & セットアップ

> **目的**: 開発ツールとリポジトリ構成を整え、Next.js／Supabase／OpenAI を即利用できる状態にする。

- [ ] **プロジェクト構成検討 & リポジトリ作成**

  - [ ] モノレポ (`apps/web`, `packages/api`) か単一リポか決定 — **モノレポ推奨**
  - [ ] GitHub リポジトリ作成
  - [ ] `pnpm init` でワークスペース初期化

- [ ] **フロントエンド (Next.js + Tailwind) セットアップ**

  - [ ] `pnpm create next-app@latest apps/web --ts --tailwind --eslint`
  - [ ] `pnpm dev -F web` で起動確認
  - [ ] `globals.css` にブランド色を追加

- [ ] **バックエンド API (Node.js / Next.js API Routes)**

  - [ ] `apps/web/src/pages/api/activities.ts` 生成
  - [ ] `pnpm add openai zod`
  - [ ] `.env.local` に `OPENAI_API_KEY` 追加 (※ git ignore 済)

- [ ] **Supabase プロジェクト準備**
  - [ ] Supabase Dashboard で新プロジェクト作成
  - [ ] `SUPABASE_URL` と `SUPABASE_ANON_KEY` を取得
  - [ ] `pnpm add @supabase/supabase-js`
  - [ ] `.env.local` に環境変数を追記

---

## フェーズ 2 : データベーススキーマ定義 & マイグレーション

> **目的**: ケア行動保存用テーブルを設計し、初期マイグレーションを適用する。

- [ ] **`users` テーブル**（将来拡張用）

  - [ ] SQL / GUI で以下を作成
    ```sql
    create table users (
      id uuid primary key,
      email text unique,
      created_at timestamptz default now()
    );
    insert into users (id,email) values ('00000000-…','default_user@example.com');
    ```

- [ ] **`care_activities` テーブル**
  - [ ] SQL で作成
    ```sql
    create table care_activities (
      id bigserial primary key,
      user_id uuid references users(id),
      content text not null,
      category text,
      score numeric,
      created_at timestamptz default now()
    );
    ```
  - [ ] `packages/api/schema.ts` に `zod` スキーマ定義

---

## フェーズ 3 : バックエンド API 実装

> **目的**: フロント → API → OpenAI → DB の一連処理を確立する。

- [ ] **OpenAI クライアントユーティリティ**

  - [ ] `lib/openaiClient.ts` で GPT-4 Turbo 呼び出し
  - [ ] プロンプト:
    ```
    「{content}」という行動はどのケアスキルカテゴリに当たるか？
    JSON {category, score(1-5)} で出力
    ```

- [ ] **POST `/api/activities`**

  - [ ] 入力バリデーション (`content` 5文字以上)
  - [ ] OpenAI 呼び出し → 結果取得
  - [ ] Supabase `insert` 保存 (`user_id = default_user`)
  - [ ] 200 / 400 / 500 JSON レスポンス実装

- [ ] **GET `/api/activities`**
  - [ ] Supabase `select * order by created_at desc`
  - [ ] `avg(score)` を計算して返却

---

## フェーズ 4 : フロントエンド UI & API 連携

> **目的**: ユーザーが入力・結果閲覧を直感的に行える画面を実装。

- [ ] **API クライアント (lib/api.ts)**

  - [ ] `postActivity` / `getActivities` を実装
  - [ ] `pnpm add swr` で SWR セットアップ

- [ ] **入力フォーム `ActivityForm.tsx`**

  - [ ] textarea + 送信ボタン
  - [ ] 送信時 `postActivity` → ローディング & トースト

- [ ] **リスト表示 `ActivityList.tsx`**
  - [ ] SWR で `getActivities` 呼び出し
  - [ ] 平均スコアをヘッダに表示
  - [ ] ローディング中／空データ時の UI

---

## フェーズ 5 : デプロイ & 動作確認

> **目的**: 本番環境で公開し、動作を最終確認。

- [ ] **Vercel デプロイ**

  - [ ] GitHub リポ接続 → Vercel Import
  - [ ] 環境変数 (OpenAI, Supabase) を設定
  - [ ] `vercel --prod` で初回デプロイ

- [ ] **本番動作確認**
  - [ ] 公開 URL で入力 → 登録 → 表示をテスト
  - [ ] ブラウザ Console / Vercel Logs をチェック

---

## 次のステップ (MVP 以降候補)

- ユーザー認証 (Auth.js + Supabase Auth)
- カテゴリ入力サジェスト (マスタテーブル化)
- スコア推移グラフ (Recharts)
- Claude 3 Opus との AB テスト
- E2E テスト (Playwright)
- プッシュ通知 (「今日まだケア行動を記録していません」)
