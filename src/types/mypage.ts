/**
 * @fileoverview マイページ関連の型定義
 * @module types/mypage
 *
 * ahamoアカウント管理システムで使用する型定義。
 * 契約情報、データ使用量、請求情報、端末情報、通知等を定義。
 */

/**
 * ahamoプラン名の型定義
 */
export type AhamoPlanName = 'ahamo' | 'ahamo大盛り'

/**
 * プラン情報の型定義
 */
export interface PlanInfo {
  /** プランID */
  planId: string
  /** プラン名 */
  planName: AhamoPlanName
  /** 月額料金（税込） */
  monthlyFee: number
  /** データ容量（GB） */
  dataCapacity: number
  /** 5分以内通話無料フラグ */
  freeCallIncluded: boolean
}

/**
 * 契約オプションの型定義
 */
export interface ContractOption {
  /** オプションID */
  optionId: string
  /** オプション名 */
  optionName: string
  /** 月額料金（税込） */
  monthlyFee: number
  /** 契約開始日 */
  startDate: string
  /** オプション説明 */
  description: string
  /** オプションカテゴリ */
  category: 'call' | 'insurance' | 'data' | 'other'
}

/**
 * 契約情報の型定義
 */
export interface ContractInfo {
  /** ユーザーID */
  userId: string
  /** 電話番号 */
  phoneNumber: string
  /** 契約日 */
  contractDate: string
  /** プラン情報 */
  plan: PlanInfo
  /** 契約オプション */
  options: ContractOption[]
  /** 契約者名 */
  contractorName: string
  /** メールアドレス */
  email: string
  /** SIMタイプ */
  simType: 'eSIM' | 'nanoSIM'
}

/**
 * 日別データ使用量の型定義
 */
export interface DailyUsage {
  /** 日付 */
  date: string
  /** 使用量（GB） */
  usage: number
}

/**
 * 月別データ使用量の型定義
 */
export interface MonthlyUsageHistory {
  /** 年月 */
  month: string
  /** 使用量（GB） */
  usage: number
  /** データ容量（GB） */
  capacity: number
}

/**
 * データ使用量の型定義
 */
export interface DataUsage {
  /** 当月使用量（GB） */
  currentUsage: number
  /** 当月残量（GB） */
  remaining: number
  /** データ容量合計（GB） */
  totalCapacity: number
  /** 最終更新日時 */
  lastUpdated: string
  /** 日別使用量 */
  dailyUsage: DailyUsage[]
  /** 月別履歴 */
  monthlyHistory: MonthlyUsageHistory[]
}

/**
 * 請求明細項目の型定義
 */
export interface BillingItem {
  /** 項目名 */
  itemName: string
  /** 金額 */
  amount: number
}

/**
 * 月別請求情報の型定義
 */
export interface MonthlyBilling {
  /** 年月 */
  month: string
  /** 基本料金 */
  basicFee: number
  /** 通話料金 */
  callFee: number
  /** オプション料金 */
  optionFee: number
  /** 割引額 */
  discount: number
  /** 合計金額（税込） */
  totalAmount: number
  /** 明細項目 */
  items: BillingItem[]
  /** 確定済みフラグ */
  isConfirmed: boolean
}

/**
 * 支払い方法の型定義
 */
export interface PaymentMethod {
  /** 支払い方法タイプ */
  type: 'credit_card' | 'bank_account'
  /** カード番号下4桁またはブランド名 */
  displayName: string
  /** 有効期限（クレジットカードの場合） */
  expiryDate?: string
}

/**
 * 請求情報の型定義
 */
export interface BillingInfo {
  /** 当月見込み */
  currentMonthEstimate: MonthlyBilling
  /** 請求履歴 */
  history: MonthlyBilling[]
  /** 支払い方法 */
  paymentMethod: PaymentMethod
}

/**
 * 端末情報の型定義
 */
export interface DeviceInfo {
  /** 端末ID */
  deviceId: string
  /** 端末名 */
  name: string
  /** 端末画像URL */
  imageUrl: string
  /** 購入日 */
  purchaseDate: string
  /** 残りの支払い回数 */
  remainingPayments: number
  /** 月々の支払い額 */
  monthlyPayment: number
  /** 残債合計 */
  remainingBalance: number
  /** IMEI番号 */
  imei: string
}

/**
 * 通知情報の型定義
 */
export interface NotificationInfo {
  /** 通知ID */
  id: string
  /** タイトル */
  title: string
  /** 本文 */
  message: string
  /** 通知日時 */
  createdAt: string
  /** 既読フラグ */
  isRead: boolean
  /** 重要フラグ */
  isImportant: boolean
  /** 通知カテゴリ */
  category: 'system' | 'campaign' | 'billing' | 'contract'
}

/**
 * ダッシュボードデータの型定義
 */
export interface DashboardData {
  /** 契約情報 */
  contract: ContractInfo
  /** データ使用量 */
  dataUsage: DataUsage
  /** 請求情報 */
  billing: BillingInfo
  /** 端末情報 */
  device: DeviceInfo | null
  /** 通知一覧 */
  notifications: NotificationInfo[]
}

/**
 * プラン変更リクエストの型定義
 */
export interface PlanChangeRequest {
  /** 変更先プランID */
  newPlanId: string
}

/**
 * プラン変更レスポンスの型定義
 */
export interface PlanChangeResponse {
  /** 成功フラグ */
  success: boolean
  /** メッセージ */
  message: string
  /** 適用日 */
  effectiveDate: string
}

/**
 * オプション変更リクエストの型定義
 */
export interface OptionChangeRequest {
  /** オプションID */
  optionId: string
  /** アクション */
  action: 'add' | 'remove'
}

/**
 * オプション変更レスポンスの型定義
 */
export interface OptionChangeResponse {
  /** 成功フラグ */
  success: boolean
  /** メッセージ */
  message: string
}

/**
 * プロフィール更新リクエストの型定義
 */
export interface ProfileUpdateRequest {
  /** 表示名 */
  name?: string
  /** メールアドレス */
  email?: string
}

/**
 * パスワード変更リクエストの型定義
 */
export interface PasswordChangeRequest {
  /** 現在のパスワード */
  currentPassword: string
  /** 新しいパスワード */
  newPassword: string
}

/**
 * 通知設定の型定義
 */
export interface NotificationPreferences {
  /** メール通知 */
  emailNotification: boolean
  /** キャンペーン通知 */
  campaignNotification: boolean
  /** 請求通知 */
  billingNotification: boolean
  /** データ使用量アラート */
  dataUsageAlert: boolean
  /** データ使用量アラート閾値（%） */
  dataUsageAlertThreshold: number
}

/**
 * 設定更新レスポンスの型定義
 */
export interface SettingsUpdateResponse {
  /** 成功フラグ */
  success: boolean
  /** メッセージ */
  message: string
}

/**
 * 利用可能オプション一覧の型定義
 */
export interface AvailableOption {
  /** オプションID */
  optionId: string
  /** オプション名 */
  optionName: string
  /** 月額料金（税込） */
  monthlyFee: number
  /** オプション説明 */
  description: string
  /** カテゴリ */
  category: 'call' | 'insurance' | 'data' | 'other'
  /** 契約済みフラグ */
  isSubscribed: boolean
}
