# Next.js Frontend Template

このリポジトリは、Next.jsプロジェクトを迅速に開始するための設定専用テンプレートリポジトリです。
ライブラリとプロジェクト設定のみを含み、サンプルUIコンポーネントや画面ファイルは含まれていません。

## 特徴

- ⚡️ **Next.js 15 + React 19** - 最新のNext.jsとReactを使用
- 📘 **TypeScript** - 型安全な開発環境
- 🎨 **Tailwind CSS v4** - モダンなCSSフレームワーク
- 🧪 **Jest + React Testing Library + Playwright** - 包括的なテスト環境
- 📚 **Storybook** - コンポーネント駆動開発
- 🔍 **ESLint + Prettier** - コード品質とフォーマット
- 🚀 **GitHub Actions CI/CD** - 自動化されたCI/CDパイプライン
- 🌐 **MSW** - API モッキング for development
- 📝 **型安全な環境変数管理** - @t3-oss/env-nextjs使用

## 前提条件

- Node.js 18以上
- pnpm 9.15.1以上

## セットアップ

### 1. テンプレートから新しいリポジトリを作成

GitHubの「Use this template」ボタンを使用して、このテンプレートから新しいリポジトリを作成してください。

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local`ファイルを編集して、プロジェクトに必要な環境変数を設定してください。

### 4. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで http://localhost:3000 を開いて、アプリケーションを確認してください。

## スクリプト

### 開発

- `pnpm dev` - 開発サーバーを起動（Turbopack使用）
- `pnpm build` - 本番ビルドを作成
- `pnpm start` - 本番サーバーを起動

### コード品質

- `pnpm lint` - ESLintでコードをチェック
- `pnpm type-check` - TypeScriptの型チェック
- `pnpm format:check` - Prettierでフォーマットをチェック
- `pnpm format:write` - Prettierでフォーマットを適用

### テスト

- `pnpm test` - Jestでテストを実行
- `pnpm test:unit` - ユニットテストのみ実行
- `pnpm test:e2e` - Playwrightでe2eテストを実行
- `pnpm test:ci` - CI環境でのテスト実行（カバレッジ付き）

### コンポーネント開発

- `pnpm storybook` - Storybookを起動
- `pnpm build-storybook` - Storybookのビルド

## ディレクトリ構造

```
frontend-template/
├── .github/
│   └── workflows/      # GitHub Actions CI/CD設定
├── .storybook/         # Storybook設定
├── e2e/                # Playwright E2Eテスト
├── public/             # 静的ファイル
├── src/
│   ├── app/           # Next.js App Router
│   │   ├── layout.tsx # ルートレイアウト
│   │   ├── page.tsx   # ホームページ（最小限のサンプル）
│   │   └── globals.css # グローバルスタイル
│   ├── components/    # 再利用可能コンポーネント（空）
│   │   ├── ui/       # 基本UIコンポーネント
│   │   └── layout/   # レイアウトコンポーネント
│   ├── hooks/        # カスタムフック（空）
│   ├── lib/          # ユーティリティ・設定
│   │   ├── utils.ts  # 汎用ユーティリティ関数
│   │   ├── env.ts    # 環境変数の型安全な管理
│   │   └── msw.ts    # MSW設定
│   ├── services/     # APIサービス（空）
│   ├── types/        # 型定義（空）
│   ├── mocks/        # MSWモックハンドラー（空）
│   └── __tests__/    # テスト（空）
├── .env.example       # 環境変数テンプレート
├── .eslintrc.mjs     # ESLint設定
├── .gitignore        # Git除外設定
├── .prettierrc       # Prettier設定
├── jest.config.js    # Jest設定
├── next.config.ts    # Next.js設定
├── package.json      # パッケージ設定
├── playwright.config.ts # Playwright設定
├── tsconfig.json     # TypeScript設定
└── README.md         # このファイル
```

## コーディング規約

このテンプレートは以下のコーディング規約に従います：

- [Next.jsコーディング規約](https://github.com/satoshi-watanabe-0001/ahamo-dummy-demo2-system-design-docs/blob/main/ai-context/coding-standards/nextjs-coding-standards.md)
- [環境設定ガイドライン](https://github.com/satoshi-watanabe-0001/ahamo-dummy-demo2-system-design-docs/blob/main/ai-context/guildeline/nextjs_environment_configuration_guidelines.md)
- [CI/CDデプロイメントガイドライン](https://github.com/satoshi-watanabe-0001/ahamo-dummy-demo2-system-design-docs/blob/main/ai-context/guildeline/nextjs_cicd_deployment_guidelines.md)

## テンプレートの構成

このテンプレートは**設定専用**として設計されており、以下のみを含みます：

### 含まれるもの

✅ プロジェクト設定ファイル（package.json, tsconfig.json等）  
✅ ビルド・テスト設定（jest.config.js, playwright.config.ts等）  
✅ CI/CD設定（GitHub Actions）  
✅ ユーティリティ関数（utils.ts, env.ts, msw.ts）  
✅ 最小限のNext.js構成（layout.tsx, page.tsx, globals.css）  
✅ ディレクトリ構造（.gitkeepで保持）

### 含まれないもの

❌ サンプルUIコンポーネント  
❌ ビジネスロジック  
❌ 具体的な画面実装  
❌ プロジェクト固有のコード

## 主要な機能

### 1. 型安全な環境変数管理

`@t3-oss/env-nextjs`を使用して、環境変数の型安全性を確保しています。

```typescript
import { env } from '@/lib/env'

console.log(env.NEXT_PUBLIC_API_URL)
```

`src/lib/env.ts`でプロジェクトに必要な環境変数を定義してください。

### 2. コンポーネント開発（Storybook）

Storybookの設定が完了しています。コンポーネントを作成後、以下で起動できます：

```bash
pnpm storybook
```

### 3. API モッキング（MSW）

Mock Service Worker（MSW）の設定が完了しています。
`src/mocks/`にハンドラーを追加してAPIをモックできます。

### 4. 包括的なテスト環境

- **Jest** - ユニットテスト（src/**tests**/）
- **React Testing Library** - コンポーネントテスト
- **Playwright** - E2Eテスト（e2e/）

### 5. CI/CD パイプライン

GitHub Actionsを使用した自動化されたCI/CDパイプライン：

- コード品質チェック（Lint、型チェック、フォーマット）
- 自動テスト実行
- セキュリティスキャン（CodeQL）
- 本番ビルド検証

## カスタマイズ

### プロジェクト設定の変更

1. **アプリケーション名**
   - `package.json`の`name`フィールドを更新
   - `.env.example`と`.env.local`の`NEXT_PUBLIC_APP_NAME`を変更
   - `src/app/layout.tsx`のメタデータを更新

2. **環境変数**
   - `src/lib/env.ts`でプロジェクトに必要な環境変数を定義
   - `.env.example`にデフォルト値を追加

3. **Tailwind CSS設定**
   - `src/app/globals.css`でデザイントークンをカスタマイズ
   - `tailwind.config.ts`で詳細設定を追加

### コンポーネントとページの追加

1. **UIコンポーネント**: `src/components/ui/`に追加
2. **レイアウトコンポーネント**: `src/components/layout/`に追加
3. **ページ**: `src/app/`に追加
4. **APIサービス**: `src/services/`に追加
5. **カスタムフック**: `src/hooks/`に追加
6. **型定義**: `src/types/`に追加

## デプロイ

### Vercel（推奨）

```bash
npm i -g vercel
vercel
```

### その他のプラットフォーム

Next.jsの`output: 'standalone'`設定により、Docker等での簡単なデプロイが可能です。

## トラブルシューティング

### 依存関係のインストールエラー

```bash
rm -rf node_modules .next
pnpm install
```

### 型エラー

```bash
pnpm type-check
```

### ビルドエラー

```bash
cat .env.local
rm -rf .next
pnpm build
```

## 参考資料

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

## ライセンス

MIT

## コントリビューション

このテンプレートへの改善提案やバグ報告は、Issueまたはプルリクエストでお願いします。
