/**
 * @fileoverview アカウント関連の型定義
 * @module types/account
 *
 * マイページで使用するアカウント・契約・データ通信量・請求・端末・通知の型を定義。
 * Account Serviceとの通信で使用される。
 */

// ============================================================
// 契約・顧客情報
// ============================================================

/**
 * 契約プラン情報
 */
export interface ContractPlan {
  /** プランコード */
  planCode: string
  /** プラン名 */
  planName: string
  /** 月額基本料金（税込） */
  monthlyPrice: number
  /** データ容量（GB） */
  dataCapacityGB: number
  /** プラン説明 */
  description: string
}

/**
 * 顧客情報
 */
export interface CustomerInfo {
  /** 顧客ID */
  customerId: string
  /** 氏名 */
  name: string
  /** メールアドレス */
  email: string
  /** 電話番号 */
  phoneNumber: string
  /** 契約日 */
  contractDate: string
  /** 契約状態 */
  contractStatus: 'active' | 'suspended' | 'cancelled'
}

/**
 * アカウント情報レスポンス
 */
export interface AccountInfoResponse {
  /** 顧客情報 */
  customer: CustomerInfo
  /** 契約プラン */
  plan: ContractPlan
  /** 契約中のオプション数 */
  activeOptionsCount: number
}

// ============================================================
// データ通信量
// ============================================================

/**
 * 日別データ使用量
 */
export interface DailyDataUsage {
  /** 日付 */
  date: string
  /** 使用量（GB） */
  usageGB: number
}

/**
 * 月別データ使用量
 */
export interface MonthlyDataUsage {
  /** 年月 (YYYY-MM) */
  month: string
  /** 使用量（GB） */
  usageGB: number
  /** データ容量上限（GB） */
  capacityGB: number
}

/**
 * データチャージ履歴
 */
export interface DataChargeHistory {
  /** チャージID */
  chargeId: string
  /** チャージ日時 */
  chargedAt: string
  /** チャージ容量（GB） */
  amountGB: number
  /** チャージ料金（税込） */
  price: number
}

/**
 * データ通信量レスポンス
 */
export interface DataUsageResponse {
  /** 当月使用量（GB） */
  currentUsageGB: number
  /** 当月データ容量（GB） */
  currentCapacityGB: number
  /** 残りデータ容量（GB） */
  remainingGB: number
  /** 日別使用量（当月） */
  dailyUsage: DailyDataUsage[]
  /** 月別使用量（過去6ヶ月） */
  monthlyHistory: MonthlyDataUsage[]
  /** データチャージ履歴 */
  chargeHistory: DataChargeHistory[]
}

// ============================================================
// 請求情報
// ============================================================

/**
 * 請求明細項目
 */
export interface BillingItem {
  /** 項目名 */
  label: string
  /** 金額（税込） */
  amount: number
}

/**
 * 月別請求情報
 */
export interface MonthlyBilling {
  /** 年月 (YYYY-MM) */
  month: string
  /** 合計金額 */
  totalAmount: number
  /** 支払い状況 */
  paymentStatus: 'paid' | 'pending' | 'overdue'
  /** 支払い日 */
  paidAt?: string
}

/**
 * 支払い方法
 */
export interface PaymentMethod {
  /** 支払い方法種別 */
  type: 'credit_card' | 'bank_account' | 'carrier_billing'
  /** 表示名（例: **** 1234） */
  displayName: string
  /** 有効期限（クレジットカードの場合） */
  expiryDate?: string
}

/**
 * 請求情報レスポンス
 */
export interface BillingResponse {
  /** 当月請求情報 */
  currentBilling: {
    /** 年月 */
    month: string
    /** 明細項目 */
    items: BillingItem[]
    /** 合計金額 */
    totalAmount: number
    /** 請求確定日 */
    billingDate: string
    /** 支払い予定日 */
    paymentDueDate: string
  }
  /** 過去の請求履歴 */
  billingHistory: MonthlyBilling[]
  /** 支払い方法 */
  paymentMethod: PaymentMethod
}

// ============================================================
// 端末情報
// ============================================================

/**
 * 端末支払い情報
 */
export interface DevicePayment {
  /** 支払い方法 */
  method: 'lump_sum' | 'installment'
  /** 月額支払い額（分割の場合） */
  monthlyAmount?: number
  /** 残りの支払い回数（分割の場合） */
  remainingInstallments?: number
  /** 総支払い回数（分割の場合） */
  totalInstallments?: number
  /** 支払い済み金額 */
  paidAmount: number
  /** 端末総額 */
  totalPrice: number
}

/**
 * 端末情報レスポンス
 */
export interface DeviceInfoResponse {
  /** 端末ID */
  deviceId: string
  /** 端末名 */
  deviceName: string
  /** メーカー */
  manufacturer: string
  /** 画像URL */
  imageUrl: string
  /** 購入日 */
  purchaseDate: string
  /** IMEI */
  imei: string
  /** ストレージ容量 */
  storage: string
  /** カラー */
  color: string
  /** 支払い情報 */
  payment: DevicePayment
}

// ============================================================
// 通知
// ============================================================

/**
 * 通知
 */
export interface Notification {
  /** 通知ID */
  id: string
  /** タイトル */
  title: string
  /** 本文 */
  body: string
  /** 種別 */
  type: 'info' | 'warning' | 'campaign' | 'system'
  /** 既読かどうか */
  isRead: boolean
  /** 作成日時 */
  createdAt: string
}

/**
 * 通知レスポンス
 */
export interface NotificationsResponse {
  /** 通知一覧 */
  notifications: Notification[]
  /** 未読数 */
  unreadCount: number
}

// ============================================================
// アカウント設定
// ============================================================

/**
 * プロフィール更新リクエスト
 */
export interface UpdateProfileRequest {
  /** 氏名 */
  name: string
  /** メールアドレス */
  email: string
  /** 電話番号 */
  phoneNumber: string
}

/**
 * パスワード変更リクエスト
 */
export interface ChangePasswordRequest {
  /** 現在のパスワード */
  currentPassword: string
  /** 新しいパスワード */
  newPassword: string
}

/**
 * 通知設定
 */
export interface NotificationSettings {
  /** メール通知 */
  emailNotification: boolean
  /** プッシュ通知 */
  pushNotification: boolean
  /** キャンペーン通知 */
  campaignNotification: boolean
  /** 請求通知 */
  billingNotification: boolean
}

/**
 * 通知設定更新リクエスト
 */
export interface UpdateNotificationSettingsRequest {
  /** 通知設定 */
  settings: NotificationSettings
}

// ============================================================
// プラン変更
// ============================================================

/**
 * 利用可能なプラン
 */
export interface AvailablePlan {
  /** プランコード */
  planCode: string
  /** プラン名 */
  planName: string
  /** 月額料金 */
  monthlyPrice: number
  /** データ容量（GB） */
  dataCapacityGB: number
  /** プラン説明 */
  description: string
  /** 特徴リスト */
  features: string[]
  /** 現在のプランかどうか */
  isCurrent: boolean
}

/**
 * プラン変更リクエスト
 */
export interface ChangePlanRequest {
  /** 変更先プランコード */
  planCode: string
}

// ============================================================
// オプションサービス
// ============================================================

/**
 * オプションサービス
 */
export interface OptionService {
  /** オプションID */
  optionId: string
  /** オプション名 */
  optionName: string
  /** 月額料金 */
  monthlyPrice: number
  /** 説明 */
  description: string
  /** 契約中かどうか */
  isSubscribed: boolean
  /** カテゴリ */
  category: 'data' | 'call' | 'insurance' | 'entertainment'
}

/**
 * オプションサービスレスポンス
 */
export interface OptionsResponse {
  /** オプション一覧 */
  options: OptionService[]
}

// ============================================================
// 汎用レスポンス
// ============================================================

/**
 * 成功レスポンス
 */
export interface SuccessResponse {
  /** ステータス */
  status: 'success'
  /** メッセージ */
  message: string
}

/**
 * 支払い方法更新リクエスト
 */
export interface UpdatePaymentMethodRequest {
  /** 支払い方法種別 */
  type: 'credit_card' | 'bank_account'
  /** カード番号（クレジットカードの場合） */
  cardNumber?: string
  /** 有効期限（クレジットカードの場合） */
  expiryDate?: string
  /** セキュリティコード（クレジットカードの場合） */
  securityCode?: string
  /** 口座番号（銀行口座の場合） */
  accountNumber?: string
  /** 銀行コード（銀行口座の場合） */
  bankCode?: string
}
