/**
 * @fileoverview アカウント管理関連の型定義
 * @module types/account
 *
 * マイページ・アカウント管理APIのリクエスト・レスポンス型を定義。
 * アカウントサービスとの通信で使用される。
 */

/**
 * 契約者情報の型定義
 */
export interface ContractInfo {
  /** ユーザーID */
  userId: string
  /** 契約者名 */
  name: string
  /** フリガナ */
  nameKana: string
  /** 生年月日 */
  dateOfBirth: string
  /** 郵便番号 */
  postalCode: string
  /** 住所 */
  address: string
  /** 電話番号 */
  phoneNumber: string
  /** メールアドレス */
  email: string
  /** 契約電話番号 */
  contractPhoneNumber: string
  /** 契約日 */
  contractDate: string
  /** 現在のプランID */
  currentPlanId: string
  /** 現在のプラン名 */
  currentPlanName: string
  /** 契約中オプション */
  activeOptions: string[]
}

/**
 * データ使用量サマリーの型定義
 */
export interface DataUsageSummary {
  /** 使用済みデータ量（GB） */
  usedAmount: number
  /** 残りデータ量（GB） */
  remainingAmount: number
  /** データ容量上限（GB） */
  totalCapacity: number
  /** 最終更新日時 */
  lastUpdated: string
  /** 使用率（%） */
  usagePercentage: number
}

/**
 * 日別データ使用量の型定義
 */
export interface DailyDataUsage {
  /** 日付 */
  date: string
  /** 使用量（GB） */
  amount: number
}

/**
 * 月別データ使用量の型定義
 */
export interface MonthlyDataUsage {
  /** 年月（YYYY-MM） */
  month: string
  /** 使用量（GB） */
  amount: number
  /** データ容量上限（GB） */
  capacity: number
}

/**
 * データチャージ履歴の型定義
 */
export interface DataChargeHistory {
  /** チャージID */
  chargeId: string
  /** チャージ日時 */
  chargeDate: string
  /** チャージ量（GB） */
  amount: number
  /** 料金 */
  price: number
  /** 有効期限 */
  expirationDate: string
}

/**
 * 請求情報の型定義
 */
export interface BillingInfo {
  /** 請求月（YYYY-MM） */
  billingMonth: string
  /** 基本料金 */
  basicFee: number
  /** 通話料金 */
  callCharges: number
  /** オプション料金 */
  optionCharges: number
  /** 合計金額 */
  totalAmount: number
  /** 前月比（円） */
  previousMonthDiff: number
  /** 支払い状態 */
  paymentStatus: 'paid' | 'pending' | 'overdue'
}

/**
 * 請求履歴の型定義
 */
export interface BillingHistory {
  /** 請求月 */
  billingMonth: string
  /** 合計金額 */
  totalAmount: number
  /** 支払い状態 */
  paymentStatus: 'paid' | 'pending' | 'overdue'
  /** 明細ダウンロードURL */
  detailUrl: string
}

/**
 * 支払い方法の型定義
 */
export interface PaymentMethod {
  /** 支払い方法ID */
  paymentMethodId: string
  /** 支払い種別 */
  type: 'credit_card' | 'bank_transfer' | 'convenience_store'
  /** カード番号の下4桁（クレジットカードの場合） */
  lastFourDigits?: string
  /** カードブランド（クレジットカードの場合） */
  cardBrand?: string
  /** 有効期限（クレジットカードの場合） */
  expirationDate?: string
  /** 銀行名（口座振替の場合） */
  bankName?: string
  /** メインの支払い方法かどうか */
  isPrimary: boolean
}

/**
 * オプションサービスの型定義
 */
export interface OptionService {
  /** オプションID */
  optionId: string
  /** オプション名 */
  name: string
  /** 月額料金 */
  monthlyFee: number
  /** 説明 */
  description: string
  /** 契約状態 */
  status: 'active' | 'available' | 'unavailable'
  /** カテゴリ */
  category: string
}

/**
 * 通知設定の型定義
 */
export interface NotificationSettings {
  /** メール通知の有効/無効 */
  emailEnabled: boolean
  /** SMS通知の有効/無効 */
  smsEnabled: boolean
  /** 通知カテゴリ設定 */
  categories: NotificationCategory[]
}

/**
 * 通知カテゴリの型定義
 */
export interface NotificationCategory {
  /** カテゴリID */
  categoryId: string
  /** カテゴリ名 */
  name: string
  /** 有効/無効 */
  enabled: boolean
}

/**
 * 契約端末情報の型定義
 */
export interface DeviceInfo {
  /** 端末名 */
  deviceName: string
  /** 端末画像URL */
  imageUrl: string
  /** 購入日 */
  purchaseDate: string
  /** 支払い状態 */
  paymentStatus: string
  /** 残債金額 */
  remainingPayment: number
}

/**
 * 通知・お知らせの型定義
 */
export interface Notification {
  /** 通知ID */
  notificationId: string
  /** タイトル */
  title: string
  /** 内容 */
  content: string
  /** 日付 */
  date: string
  /** 既読/未読 */
  isRead: boolean
  /** 重要度 */
  importance: 'normal' | 'important' | 'urgent'
}

/**
 * ダッシュボードレスポンスの型定義
 */
export interface DashboardResponse {
  /** 契約情報サマリー */
  contract: {
    planName: string
    monthlyFee: number
    dataCapacity: number
  }
  /** データ使用状況 */
  dataUsage: DataUsageSummary
  /** 請求予定額 */
  billing: BillingInfo
  /** 契約端末情報 */
  device: DeviceInfo
  /** 通知・お知らせ */
  notifications: {
    unreadCount: number
    items: Notification[]
  }
}

/**
 * データ使用量詳細レスポンスの型定義
 */
export interface DataUsageDetailResponse {
  /** サマリー */
  summary: DataUsageSummary
  /** 日別使用量 */
  dailyUsage: DailyDataUsage[]
  /** 月別使用量 */
  monthlyUsage: MonthlyDataUsage[]
  /** チャージ履歴 */
  chargeHistory: DataChargeHistory[]
}

/**
 * 請求詳細レスポンスの型定義
 */
export interface BillingDetailResponse {
  /** 今月の請求情報 */
  currentBilling: BillingInfo
  /** 請求履歴 */
  billingHistory: BillingHistory[]
  /** 支払い方法 */
  paymentMethods: PaymentMethod[]
}

/**
 * プロフィール更新リクエストの型定義
 */
export interface UpdateProfileRequest {
  /** メールアドレス */
  email?: string
  /** 電話番号 */
  phoneNumber?: string
  /** 郵便番号 */
  postalCode?: string
  /** 住所 */
  address?: string
}

/**
 * パスワード変更リクエストの型定義
 */
export interface ChangePasswordRequest {
  /** 現在のパスワード */
  currentPassword: string
  /** 新しいパスワード */
  newPassword: string
  /** 新しいパスワード（確認用） */
  confirmPassword: string
}

/**
 * プラン変更リクエストの型定義
 */
export interface ChangePlanRequest {
  /** 新しいプランID */
  newPlanId: string
  /** 適用時期 */
  applyTiming: 'next_month' | 'immediate'
}

/**
 * APIレスポンスの共通型定義
 */
export interface ApiResponse<T = void> {
  /** ステータス */
  status: 'success' | 'error'
  /** メッセージ */
  message: string
  /** データ */
  data?: T
}
