/**
 * @fileoverview アカウント関連の型定義
 * @module types/account
 *
 * マイページで使用するアカウント情報、契約情報、データ使用量、
 * 請求情報、オプションサービスの型定義。
 */

/**
 * 通知情報の型定義
 */
export interface AccountNotification {
  /** 通知ID */
  id: string
  /** 通知タイトル */
  title: string
  /** 通知メッセージ */
  message: string
  /** 通知日時 */
  date: string
  /** 既読フラグ */
  isRead: boolean
  /** 通知タイプ */
  type: 'info' | 'warning' | 'campaign' | 'billing'
}

/**
 * 契約端末情報の型定義
 */
export interface ContractDevice {
  /** 端末名 */
  name: string
  /** メーカー名 */
  manufacturer: string
  /** 端末画像URL */
  imageUrl: string
  /** 購入日 */
  purchaseDate: string
  /** 分割払い残回数（0の場合は完済） */
  installmentRemaining: number
  /** 月々の分割払い金額 */
  monthlyInstallment: number
}

/**
 * ダッシュボードサマリーレスポンスの型定義
 */
export interface AccountDashboardResponse {
  /** ユーザーID */
  userId: string
  /** ユーザー名 */
  userName: string
  /** 現在のプラン名 */
  currentPlan: string
  /** 月額料金（税込） */
  monthlyCharge: number
  /** データ使用量（GB） */
  dataUsed: number
  /** データ容量（GB） */
  dataLimit: number
  /** 請求締め日 */
  billingDate: string
  /** 今月の請求予定額（税込） */
  currentBillAmount: number
  /** 契約端末情報 */
  device: ContractDevice
  /** 通知一覧 */
  notifications: AccountNotification[]
}

/**
 * オプションサービスの型定義
 */
export interface ContractOption {
  /** オプションID */
  id: string
  /** オプション名 */
  name: string
  /** 月額料金（税込） */
  monthlyPrice: number
  /** 説明 */
  description: string
  /** 契約開始日 */
  startDate: string
}

/**
 * 契約情報レスポンスの型定義
 */
export interface ContractInfoResponse {
  /** 契約ID */
  contractId: string
  /** 契約者名 */
  contractorName: string
  /** 電話番号 */
  phoneNumber: string
  /** メールアドレス */
  email: string
  /** 契約プラン名 */
  planName: string
  /** プランID */
  planId: string
  /** 月額料金（税込） */
  monthlyCharge: number
  /** データ容量（GB） */
  dataCapacity: number
  /** 無料通話時間（分） */
  freeCallMinutes: number
  /** 契約開始日 */
  contractStartDate: string
  /** 契約更新日 */
  contractRenewalDate: string
  /** SIMタイプ */
  simType: 'eSIM' | 'nanoSIM'
  /** 契約端末情報 */
  device: ContractDevice
  /** 契約中のオプション */
  options: ContractOption[]
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
export interface MonthlyUsage {
  /** 年月 */
  month: string
  /** 使用量（GB） */
  usage: number
  /** データ容量（GB） */
  limit: number
}

/**
 * データ使用量レスポンスの型定義
 */
export interface DataUsageResponse {
  /** 現在の使用量（GB） */
  currentUsage: number
  /** データ容量（GB） */
  dataLimit: number
  /** 使用率（%） */
  usagePercentage: number
  /** 残りデータ量（GB） */
  remainingData: number
  /** 請求期間開始日 */
  billingPeriodStart: string
  /** 請求期間終了日 */
  billingPeriodEnd: string
  /** 日別使用量（過去30日） */
  dailyUsage: DailyUsage[]
  /** 月別使用量（過去6ヶ月） */
  monthlyUsage: MonthlyUsage[]
}

/**
 * 請求明細項目の型定義
 */
export interface BillingItem {
  /** 項目名 */
  name: string
  /** 金額（税込） */
  amount: number
}

/**
 * 月別請求情報の型定義
 */
export interface MonthlyBill {
  /** 年月 */
  month: string
  /** 合計金額（税込） */
  totalAmount: number
  /** 請求明細 */
  items: BillingItem[]
  /** 支払いステータス */
  status: 'paid' | 'pending' | 'overdue'
  /** 支払い日 */
  paymentDate?: string
}

/**
 * 支払い方法の型定義
 */
export interface PaymentMethodInfo {
  /** 支払い方法タイプ */
  type: 'credit_card' | 'bank_transfer' | 'convenience_store'
  /** 表示名（例: VISA **** 1234） */
  displayName: string
  /** カード会社（クレジットカードの場合） */
  cardBrand?: string
  /** カード番号下4桁（クレジットカードの場合） */
  lastFourDigits?: string
  /** 有効期限（クレジットカードの場合） */
  expiryDate?: string
}

/**
 * 請求情報レスポンスの型定義
 */
export interface BillingInfoResponse {
  /** 今月の請求予定額（税込） */
  currentMonthAmount: number
  /** 今月の請求明細 */
  currentMonthItems: BillingItem[]
  /** 支払い方法 */
  paymentMethod: PaymentMethodInfo
  /** 請求締め日 */
  billingDate: string
  /** 引き落とし日 */
  paymentDueDate: string
  /** 過去の請求履歴 */
  billingHistory: MonthlyBill[]
}

/**
 * 利用可能なオプションサービスの型定義
 */
export interface AvailableOption {
  /** オプションID */
  id: string
  /** オプション名 */
  name: string
  /** 月額料金（税込） */
  monthlyPrice: number
  /** 説明 */
  description: string
  /** 特徴リスト */
  features: string[]
  /** カテゴリ */
  category: string
}

/**
 * オプションサービスレスポンスの型定義
 */
export interface AccountOptionsResponse {
  /** 契約中のオプション */
  subscribedOptions: ContractOption[]
  /** 利用可能なオプション */
  availableOptions: AvailableOption[]
}

/**
 * プロフィール更新リクエストの型定義
 */
export interface UpdateProfileRequest {
  /** 氏名 */
  name?: string
  /** メールアドレス */
  email?: string
  /** 電話番号 */
  phoneNumber?: string
}

/**
 * パスワード変更リクエストの型定義
 */
export interface ChangePasswordRequest {
  /** 現在のパスワード */
  currentPassword: string
  /** 新しいパスワード */
  newPassword: string
}

/**
 * 通知設定の型定義
 */
export interface NotificationSettings {
  /** メール通知 */
  emailNotifications: boolean
  /** キャンペーン通知 */
  campaignNotifications: boolean
  /** 請求通知 */
  billingNotifications: boolean
  /** データ使用量アラート */
  dataUsageAlerts: boolean
}

/**
 * プラン変更リクエストの型定義
 */
export interface PlanChangeRequest {
  /** 新しいプランID */
  newPlanId: string
}

/**
 * プラン変更レスポンスの型定義
 */
export interface PlanChangeResponse {
  /** 変更成功フラグ */
  success: boolean
  /** メッセージ */
  message: string
  /** 変更適用日 */
  effectiveDate: string
}

/**
 * オプション追加リクエストの型定義
 */
export interface AddOptionRequest {
  /** オプションID */
  optionId: string
}

/**
 * API共通レスポンスの型定義
 */
export interface AccountApiResponse {
  /** 成功フラグ */
  success: boolean
  /** メッセージ */
  message: string
}
