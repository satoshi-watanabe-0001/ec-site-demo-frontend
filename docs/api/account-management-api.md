---
title: "ahamoマイページ アカウント管理API契約書"
version: "1.0.0"
template_version: "1.0.0"
created_date: "2026-02-13"
phase: "Phase 2A (Pre-Implementation Design)"
status: "draft"
owner: "Devin AI"
reviewers: []
approved_by: ""
approved_date: ""
related_ticket: "EC-278"
---

# API契約書: ahamoマイページ アカウント管理

> **目的**: マイページダッシュボードおよびアカウント管理機能のAPI契約書
> **スコープ**: エンドポイント一覧と基本的な入出力定義（詳細はPhase 5で作成）
> **作成タイミング**: 実装開始の1-2日前
> **作成時間目安**: 2-4時間

---

## メタデータ

| 項目 | 内容 |
|-----|------|
| **プロジェクト名** | ahamoマイページ アカウント管理 |
| **プロジェクトコード** | EC-278 |
| **作成日** | 2026-02-13 |
| **作成者** | Devin AI |
| **ステータス** | `draft` |
| **関連チケット** | EC-278 |

---

## API概要

### 目的

ahamoマイページのアカウント管理APIを提供し、以下を実現する：
- ダッシュボード情報の一括取得
- 契約情報の参照
- データ使用量のリアルタイム確認
- 請求情報の参照
- 端末情報の参照
- 通知情報の管理

### スコープ

**対象範囲**:
- ダッシュボード統合データの取得
- 契約情報の参照（読み取り専用）
- データ使用量の参照
- 請求情報の参照
- 端末情報の参照
- 通知情報の取得

**対象外範囲**:
- プラン変更処理（Phase 3で対応）
- オプション追加・解約処理（Phase 3で対応）
- 支払い方法の変更（Phase 3で対応）
- 解約処理

### ベースURL

| 環境 | URL | 用途 |
|------|-----|------|
| **開発環境（MSW）** | `http://localhost:3000` | フロントエンド開発（モック） |
| **開発環境** | `https://dev-api.ahamo-demo.example.com` | バックエンド連携テスト |
| **ステージング** | `https://staging-api.ahamo-demo.example.com` | 受入テスト |
| **本番環境** | `https://api.ahamo-demo.example.com` | 本番サービス |

---

## エンドポイント一覧

### 命名規則

```yaml
naming_convention:
  - RESTful な命名（リソース名は複数形）
  - ケバブケース使用
  - バージョンプレフィックス: /api/v1/
  - 動詞は HTTP メソッドで表現（URL には含めない）
```

---

### 1. ダッシュボード情報取得

```yaml
endpoint: GET /api/v1/mypage/dashboard
summary: "マイページダッシュボードに表示する統合データを一括取得"
description: |
  契約情報・データ使用量・請求情報・端末情報・通知情報を
  一括で取得し、ダッシュボードの初期表示に使用する。

request:
  headers:
    - "Authorization: Bearer {access_token}"
  query_parameters:
    - userId: string
      description: "ユーザーID"
      required: true

response:
  success:
    status_code: 200
    description: "ダッシュボードデータ取得成功"
    body_schema:
      - contract: ContractInfo
        description: "契約情報"
      - dataUsage: DataUsage
        description: "データ使用状況"
      - billing: BillingInfo
        description: "請求情報"
      - device: DeviceInfo
        description: "端末情報"
      - notifications: NotificationInfo
        description: "通知情報"

  error:
    - status_code: 401
      error_code: "UNAUTHORIZED"
      description: "認証トークンが無効または期限切れ"
    - status_code: 403
      error_code: "FORBIDDEN"
      description: "アクセス権限なし"
    - status_code: 500
      error_code: "INTERNAL_ERROR"
      description: "サーバーエラー"

authentication: "必須（Bearer Token）"
rate_limit: "60リクエスト/分/ユーザー"
```

---

### 2. 契約情報取得

```yaml
endpoint: GET /api/v1/contracts/{contractId}
summary: "指定契約IDの契約情報を取得"

path_parameters:
  - contractId: string
    description: "契約ID"
    example: "contract-001"

request:
  headers:
    - "Authorization: Bearer {access_token}"

response:
  success:
    status_code: 200
    description: "契約情報取得成功"
    body_schema:
      - id: string
        description: "契約ID"
      - planName: string
        description: "プラン名（ahamo / ahamo大盛り）"
      - monthlyFee: number
        description: "月額料金（税込）"
        example: 2970
      - dataCapacity: string
        description: "データ容量"
        example: "30GB"
      - contractDate: string
        description: "契約開始日（ISO 8601形式）"
      - phoneNumber: string
        description: "電話番号"
      - options: ContractOption[]
        description: "契約中オプション一覧"

  error:
    - status_code: 401
      error_code: "UNAUTHORIZED"
    - status_code: 404
      error_code: "CONTRACT_NOT_FOUND"
      description: "契約情報が見つからない"

authentication: "必須（Bearer Token）"
rate_limit: "100リクエスト/分/ユーザー"
```

---

### 3. データ使用量取得

```yaml
endpoint: GET /api/v1/data-usage/{contractId}
summary: "指定契約のデータ使用量を取得"

path_parameters:
  - contractId: string
    description: "契約ID"

request:
  headers:
    - "Authorization: Bearer {access_token}"

response:
  success:
    status_code: 200
    description: "データ使用量取得成功"
    body_schema:
      - contractId: string
        description: "契約ID"
      - currentMonth: object
        description: "当月のデータ使用状況"
        fields:
          - used: number
            description: "使用済みデータ量（MB単位）"
          - total: number
            description: "総データ容量（MB単位）"
          - lastUpdated: string
            description: "最終更新日時（ISO 8601形式）"
      - dailyUsage: DailyUsage[]
        description: "日別データ使用量"

  error:
    - status_code: 401
      error_code: "UNAUTHORIZED"
    - status_code: 404
      error_code: "CONTRACT_NOT_FOUND"

authentication: "必須（Bearer Token）"
rate_limit: "100リクエスト/分/ユーザー"
notes: |
  - データ使用量は最大1時間の遅延がある場合がある
  - dailyUsageは当月1日から現在日までのデータを返却
```

---

### 4. 請求情報取得

```yaml
endpoint: GET /api/v1/billing/{contractId}
summary: "指定契約の請求情報を取得"

path_parameters:
  - contractId: string
    description: "契約ID"

request:
  headers:
    - "Authorization: Bearer {access_token}"

response:
  success:
    status_code: 200
    description: "請求情報取得成功"
    body_schema:
      - contractId: string
        description: "契約ID"
      - currentBill: object
        description: "今月の請求予定額"
        fields:
          - basicFee: number
            description: "基本料金（税込）"
          - optionFee: number
            description: "オプション料金（税込）"
          - callFee: number
            description: "通話料（税込）"
          - total: number
            description: "合計金額（税込）"
          - previousMonthTotal: number
            description: "前月の合計金額（税込）"
      - history: BillingHistory[]
        description: "過去の請求履歴"

  error:
    - status_code: 401
      error_code: "UNAUTHORIZED"
    - status_code: 404
      error_code: "CONTRACT_NOT_FOUND"

authentication: "必須（Bearer Token）"
rate_limit: "100リクエスト/分/ユーザー"
notes: |
  - 請求情報は毎月5日に確定
  - 確定前の当月分は見積額として表示
```

---

### 5. 端末情報取得

```yaml
endpoint: GET /api/v1/devices/{contractId}
summary: "指定契約に紐づく端末情報を取得"

path_parameters:
  - contractId: string
    description: "契約ID"

request:
  headers:
    - "Authorization: Bearer {access_token}"

response:
  success:
    status_code: 200
    description: "端末情報取得成功"
    body_schema:
      - id: string
        description: "端末ID"
      - name: string
        description: "端末名"
      - imageUrl: string
        description: "端末画像URL"
      - purchaseDate: string
        description: "購入日（ISO 8601形式）"
      - remainingBalance: number (optional)
        description: "分割払い残額（一括払いの場合はnull）"

  error:
    - status_code: 401
      error_code: "UNAUTHORIZED"
    - status_code: 404
      error_code: "DEVICE_NOT_FOUND"

authentication: "必須（Bearer Token）"
rate_limit: "100リクエスト/分/ユーザー"
```

---

### 6. 通知情報取得

```yaml
endpoint: GET /api/v1/notifications/{userId}
summary: "指定ユーザーの通知情報を取得"

path_parameters:
  - userId: string
    description: "ユーザーID"

request:
  headers:
    - "Authorization: Bearer {access_token}"

response:
  success:
    status_code: 200
    description: "通知情報取得成功"
    body_schema:
      - unreadCount: number
        description: "未読通知件数"
      - notifications: AccountNotification[]
        description: "通知一覧"
        item_schema:
          - id: string
          - title: string
          - message: string
          - date: string (datetime)
          - isRead: boolean
          - type: string (enum: info, warning, important)

  error:
    - status_code: 401
      error_code: "UNAUTHORIZED"
    - status_code: 404
      error_code: "USER_NOT_FOUND"

authentication: "必須（Bearer Token）"
rate_limit: "100リクエスト/分/ユーザー"
```

---

### 追加エンドポイント（Phase 2以降で詳細化）

| Method | Endpoint | Summary | Phase |
|--------|----------|---------|-------|
| PUT | /api/v1/contracts/{contractId}/plan | プラン変更 | Phase 3 |
| POST | /api/v1/contracts/{contractId}/options | オプション追加 | Phase 3 |
| DELETE | /api/v1/contracts/{contractId}/options/{optionId} | オプション解約 | Phase 3 |
| PUT | /api/v1/notifications/{notificationId}/read | 通知既読 | Phase 2 |
| PUT | /api/v1/users/{userId}/settings | アカウント設定変更 | Phase 3 |

**詳細**: 各Phase完了時にAPI仕様書を更新

---

## 認証・認可

### 認証方式

```yaml
mechanism:
  type: "JWT (JSON Web Token)"
  format: "Bearer Token"

token_structure:
  access_token:
    type: "JWT"
    expiry: "1時間（rememberMe=false）/ 7時間（rememberMe=true）"
    storage: "メモリ または localStorage"
    claims:
      - sub: "ユーザーID"
      - email: "メールアドレス"
      - exp: "有効期限（Unix timestamp）"

header_format: "Authorization: Bearer {access_token}"
```

### 認可ルール

- ユーザーは自分の契約情報のみアクセス可能
- contractIdとuserIdの紐づけをサーバー側で検証
- 他ユーザーの情報へのアクセスは403エラーを返却

---

## レスポンス形式

### 共通レスポンス構造

**成功レスポンス**:
```json
{
  "data": { ... }
}
```

**エラーレスポンス**:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ（日本語）",
    "details": []
  }
}
```

### HTTPステータスコード

| コード | 意味 | 使用場面 |
|-------|------|---------|
| 200 | OK | 正常取得 |
| 400 | Bad Request | リクエストパラメータ不正 |
| 401 | Unauthorized | 認証失敗・トークン期限切れ |
| 403 | Forbidden | アクセス権限なし |
| 404 | Not Found | リソースが見つからない |
| 429 | Too Many Requests | レート制限超過 |
| 500 | Internal Server Error | サーバー内部エラー |

---

## エラーハンドリング

### エラーコード一覧

| エラーコード | HTTPステータス | 説明 |
|------------|--------------|------|
| UNAUTHORIZED | 401 | 認証トークンが無効または期限切れ |
| FORBIDDEN | 403 | アクセス権限なし |
| CONTRACT_NOT_FOUND | 404 | 契約情報が見つからない |
| DEVICE_NOT_FOUND | 404 | 端末情報が見つからない |
| USER_NOT_FOUND | 404 | ユーザーが見つからない |
| VALIDATION_ERROR | 400 | リクエストパラメータのバリデーションエラー |
| RATE_LIMIT_EXCEEDED | 429 | レート制限超過 |
| INTERNAL_ERROR | 500 | サーバー内部エラー |

### クライアント側エラーハンドリング

- 401エラー: ログインページへリダイレクト
- 403エラー: アクセス権限なしメッセージを表示
- 404エラー: データなしメッセージを表示
- 429エラー: リトライ（指数バックオフ）
- 500エラー: 汎用エラーメッセージを表示

---

## レート制限

| エンドポイント | 制限 | 単位 |
|-------------|------|------|
| GET /api/v1/mypage/dashboard | 60リクエスト | /分/ユーザー |
| GET /api/v1/contracts/* | 100リクエスト | /分/ユーザー |
| GET /api/v1/data-usage/* | 100リクエスト | /分/ユーザー |
| GET /api/v1/billing/* | 100リクエスト | /分/ユーザー |
| GET /api/v1/devices/* | 100リクエスト | /分/ユーザー |
| GET /api/v1/notifications/* | 100リクエスト | /分/ユーザー |

### レート制限レスポンスヘッダー

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1708858800
```

---

## バージョニング戦略

### バージョニングルール

```yaml
versioning:
  strategy: "URLパスベース"
  format: "/api/v{major}/"
  current_version: "v1"

rules:
  - 破壊的変更: メジャーバージョンをインクリメント（v1 → v2）
  - 後方互換性のある変更: バージョン変更なし
  - フィールド追加: 既存フィールドを維持しつつ新フィールドを追加

deprecation_policy:
  - 旧バージョンは新バージョンリリース後6ヶ月間サポート
  - 非推奨APIにはDeprecationヘッダーを付与
```

---

## データモデル参考

### 料金プランデータ

| プラン名 | データ容量 | 月額料金（税込） |
|---------|----------|---------------|
| ahamo | 30GB | ¥2,970 |
| ahamo大盛り | 110GB | ¥4,950 |

### オプション一覧

| オプション名 | 月額料金（税込） |
|------------|---------------|
| かけ放題オプション | ¥1,100 |
| ahamo大盛りオプション | ¥1,980 |
