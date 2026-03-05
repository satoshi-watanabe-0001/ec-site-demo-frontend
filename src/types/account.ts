/**
 * @fileoverview アカウント管理関連の型定義
 * @module types/account
 *
 * マイページで使用するアカウント情報の型定義。
 * 契約情報、データ使用量、請求情報、オプションサービスなどを含む。
 */

/**
 * 契約情報の型定義
 */
export interface ContractInfo {
  /** 契約者名 */
  name: string
  /** 契約者名（カナ） */
  nameKana: string
  /** 生年月日 */
  birthday: string
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
  /** 契約中のオプションID一覧 */
  subscribedOptionIds: string[]
}

/**
 * 日別データ使用量の型定義
 */
export interface DailyDataUsage {
  /** 日付 */
  date: string
  /** 使用量（GB） */
  usageGb: number
}

/**
 * 月別データ使用量の型定義
 */
export interface MonthlyDataUsage {
  /** 年月 */
  month: string
  /** 使用量（GB） */
  usageGb: number
  /** データ容量（GB） */
  capacityGb: number
}

/**
 * データチャージ履歴の型定義
 */
export interface DataChargeHistory {
  /** チャージ日 */
  date: string
  /** チャージ量（GB） */
  amountGb: number
  /** 料金 */
  price: number
  /** 有効期限 */
  expiryDate: string
}

/**
 * データ使用量情報の型定義
 */
export interface DataUsage {
  /** 使用済みデータ量（GB） */
  usedGb: number
  /** データ容量合計（GB） */
  totalGb: number
  /** 残りデータ量（GB） */
  remainingGb: number
  /** 日別使用量（当月） */
  dailyUsage: DailyDataUsage[]
  /** 月別使用量（過去6ヶ月） */
  monthlyUsage: MonthlyDataUsage[]
  /** データチャージ履歴 */
  chargeHistory: DataChargeHistory[]
}

/**
 * 請求明細項目の型定義
 */
export interface BillingItem {
  /** 項目名 */
  name: string
  /** 金額 */
  amount: number
}

/**
 * 支払い方法の型定義
 */
export interface PaymentMethod {
  /** 支払い種別（クレジットカード/口座振替） */
  type: 'credit_card' | 'bank_transfer'
  /** カードブランドまたは銀行名 */
  provider: string
  /** カード下4桁または口座番号下4桁 */
  lastFourDigits: string
  /** 有効期限（クレジットカードのみ） */
  expiryDate?: string
}

/**
 * 支払い履歴の型定義
 */
export interface PaymentHistory {
  /** 対象年月 */
  month: string
  /** 合計金額 */
  totalAmount: number
  /** 支払いステータス */
  status: 'paid' | 'pending' | 'overdue'
  /** 支払い日 */
  paidDate?: string
}

/**
 * 請求情報の型定義
 */
export interface BillingInfo {
  /** 当月請求明細 */
  currentMonth: {
    /** 対象年月 */
    month: string
    /** 明細項目 */
    items: BillingItem[]
    /** 合計金額（税込） */
    totalAmount: number
    /** 先月との差額 */
    differenceFromLastMonth: number
  }
  /** 支払い方法 */
  paymentMethod: PaymentMethod
  /** 支払い履歴 */
  paymentHistory: PaymentHistory[]
}

/**
 * オプションサービスの型定義
 */
export interface OptionService {
  /** オプションID */
  id: string
  /** オプション名 */
  name: string
  /** 月額料金 */
  monthlyFee: number
  /** オプション説明 */
  description: string
  /** 契約中フラグ */
  isSubscribed: boolean
  /** カテゴリ */
  category: 'call' | 'data' | 'insurance' | 'other'
}

/**
 * 通知の型定義
 */
export interface Notification {
  /** 通知ID */
  id: string
  /** 通知タイトル */
  title: string
  /** 通知本文 */
  body: string
  /** 既読フラグ */
  isRead: boolean
  /** 通知日時 */
  timestamp: string
  /** 通知種別 */
  type: 'info' | 'warning' | 'campaign' | 'billing'
}

/**
 * ダッシュボード情報の型定義
 */
export interface DashboardData {
  /** 現在のプラン情報 */
  currentPlan: {
    /** プランID */
    id: string
    /** プラン名 */
    name: string
    /** 月額料金 */
    price: number
    /** データ容量（GB） */
    dataCapacity: number
  }
  /** データ使用量サマリー */
  dataUsageSummary: {
    /** 使用済み（GB） */
    usedGb: number
    /** 合計容量（GB） */
    totalGb: number
    /** 残り（GB） */
    remainingGb: number
  }
  /** 請求サマリー */
  billingSummary: {
    /** 当月合計 */
    currentMonthTotal: number
    /** 先月合計 */
    lastMonthTotal: number
    /** 差額 */
    difference: number
  }
  /** 端末情報 */
  deviceInfo: {
    /** 端末名 */
    name: string
    /** 端末画像URL */
    imageUrl: string
    /** 購入日 */
    purchaseDate: string
    /** 残り分割支払い回数 */
    remainingPayments?: number
    /** 月額分割金額 */
    monthlyPayment?: number
  } | null
  /** 通知一覧 */
  notifications: Notification[]
}

/**
 * 利用可能プランの型定義
 */
export interface AvailablePlan {
  /** プランID */
  id: string
  /** プラン名 */
  name: string
  /** 月額料金 */
  price: number
  /** データ容量（GB） */
  dataCapacity: number
  /** 無料通話時間（分） */
  freeCallMinutes: number
  /** プラン説明 */
  description: string
  /** 特徴リスト */
  features: string[]
  /** 現在のプランかどうか */
  isCurrent: boolean
}

/**
 * プラン変更リクエストの型定義
 */
export interface PlanChangeRequest {
  /** 変更先プランID */
  newPlanId: string
  /** 適用タイミング（来月/即時） */
  applyTiming: 'next_month' | 'immediate'
}

/**
 * プロフィール更新リクエストの型定義
 */
export interface ProfileUpdateRequest {
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
export interface PasswordChangeRequest {
  /** 現在のパスワード */
  currentPassword: string
  /** 新しいパスワード */
  newPassword: string
}

/**
 * API成功レスポンスの型定義
 */
export interface AccountApiResponse<T = void> {
  /** ステータス */
  status: 'success'
  /** レスポンスデータ */
  data?: T
  /** メッセージ */
  message?: string
}

/**
 * APIエラーレスポンスの型定義
 */
export interface AccountApiErrorResponse {
  /** ステータス */
  status: 'error'
  /** エラーメッセージ */
  message: string
  /** タイムスタンプ */
  timestamp: string
}
