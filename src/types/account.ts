/**
 * @fileoverview アカウント管理関連の型定義
 * @module types/account
 *
 * マイページ（アカウント管理ポータル）で使用される型を定義。
 * ダッシュボード、契約、データ使用量、請求、設定、プラン変更、オプション管理に対応。
 */

// ============================================================
// ダッシュボード
// ============================================================

/**
 * ダッシュボードレスポンスの型定義
 */
export interface DashboardResponse {
  /** 契約プラン情報 */
  plan: ContractPlan
  /** データ使用量 */
  dataUsage: DataUsage
  /** 請求概要 */
  billing: BillingSummary
  /** 契約端末情報 */
  device: ContractDevice | null
  /** 通知一覧 */
  notifications: NotificationItem[]
}

// ============================================================
// 契約
// ============================================================

/**
 * 契約プラン情報
 */
export interface ContractPlan {
  /** プランID */
  planId: string
  /** プラン名 */
  planName: string
  /** 月額料金（税込） */
  monthlyPrice: number
  /** データ容量（GB） */
  dataCapacity: number
  /** 契約開始日 */
  contractStartDate: string
  /** 契約ステータス */
  status: 'active' | 'suspended' | 'cancelled'
}

/**
 * 契約端末情報
 */
export interface ContractDevice {
  /** 端末ID */
  deviceId: string
  /** 端末名 */
  deviceName: string
  /** メーカー */
  manufacturer: string
  /** 購入日 */
  purchaseDate: string
  /** IMEI番号 */
  imei: string
  /** 分割払い残回数 */
  installmentRemaining: number
  /** 分割払い月額 */
  installmentMonthly: number
}

/**
 * 契約詳細レスポンス
 */
export interface ContractDetailResponse {
  /** 契約プラン */
  plan: ContractPlan
  /** 電話番号 */
  phoneNumber: string
  /** 契約端末 */
  device: ContractDevice | null
  /** SIM情報 */
  sim: SimInfo
  /** 契約オプション一覧 */
  options: ContractOption[]
}

/**
 * SIM情報
 */
export interface SimInfo {
  /** SIMタイプ */
  simType: 'physical' | 'eSIM'
  /** ICCID */
  iccid: string
}

/**
 * 契約オプション情報
 */
export interface ContractOption {
  /** オプションID */
  optionId: string
  /** オプション名 */
  optionName: string
  /** 月額料金 */
  monthlyPrice: number
  /** 登録日 */
  enrolledDate: string
}

// ============================================================
// データ使用量
// ============================================================

/**
 * データ使用量情報
 */
export interface DataUsage {
  /** 使用済みデータ量（GB） */
  usedData: number
  /** 残りデータ量（GB） */
  remainingData: number
  /** 合計データ量（GB） */
  totalData: number
  /** 更新日時 */
  updatedAt: string
}

/**
 * データ使用量詳細レスポンス
 */
export interface DataUsageDetailResponse {
  /** 現在の使用量 */
  current: DataUsage
  /** 日別使用量履歴 */
  dailyHistory: DailyDataUsage[]
  /** 月別使用量履歴 */
  monthlyHistory: MonthlyDataUsage[]
}

/**
 * 日別データ使用量
 */
export interface DailyDataUsage {
  /** 日付 */
  date: string
  /** 使用量（GB） */
  usage: number
}

/**
 * 月別データ使用量
 */
export interface MonthlyDataUsage {
  /** 年月 */
  month: string
  /** 使用量（GB） */
  usage: number
  /** データ容量（GB） */
  capacity: number
}

// ============================================================
// 請求・支払い
// ============================================================

/**
 * 請求概要
 */
export interface BillingSummary {
  /** 当月請求額 */
  currentMonth: number
  /** 請求日 */
  billingDate: string
  /** 支払い方法 */
  paymentMethod: string
  /** 支払いステータス */
  paymentStatus: 'paid' | 'pending' | 'overdue'
}

/**
 * 請求詳細レスポンス
 */
export interface BillingDetailResponse {
  /** 請求概要 */
  summary: BillingSummary
  /** 請求内訳 */
  breakdown: BillingBreakdownItem[]
  /** 請求履歴 */
  history: BillingHistoryItem[]
}

/**
 * 請求内訳
 */
export interface BillingBreakdownItem {
  /** 項目名 */
  label: string
  /** 金額 */
  amount: number
}

/**
 * 請求履歴
 */
export interface BillingHistoryItem {
  /** 請求年月 */
  month: string
  /** 請求額 */
  amount: number
  /** 支払いステータス */
  status: 'paid' | 'pending' | 'overdue'
  /** 支払い日 */
  paidAt: string | null
}

// ============================================================
// アカウント設定
// ============================================================

/**
 * アカウント設定レスポンス
 */
export interface AccountSettingsResponse {
  /** ユーザー名 */
  name: string
  /** メールアドレス */
  email: string
  /** 電話番号 */
  phoneNumber: string
  /** 通知設定 */
  notifications: NotificationSettings
}

/**
 * 通知設定
 */
export interface NotificationSettings {
  /** メール通知 */
  email: boolean
  /** SMS通知 */
  sms: boolean
  /** データ量警告 */
  dataWarning: boolean
  /** 請求通知 */
  billing: boolean
}

/**
 * アカウント設定更新リクエスト
 */
export interface UpdateSettingsRequest {
  /** ユーザー名 */
  name: string
  /** メールアドレス */
  email: string
  /** 通知設定 */
  notifications: NotificationSettings
}

/**
 * パスワード変更リクエスト
 */
export interface ChangePasswordRequest {
  /** 現在のパスワード */
  currentPassword: string
  /** 新しいパスワード */
  newPassword: string
  /** 新しいパスワード（確認） */
  confirmPassword: string
}

// ============================================================
// プラン変更
// ============================================================

/**
 * 利用可能プラン
 */
export interface AvailablePlan {
  /** プランID */
  planId: string
  /** プラン名 */
  planName: string
  /** 月額料金（税込） */
  monthlyPrice: number
  /** データ容量（GB） */
  dataCapacity: number
  /** プラン説明 */
  description: string
  /** 特徴一覧 */
  features: string[]
  /** 現在のプランかどうか */
  isCurrent: boolean
}

/**
 * プラン一覧レスポンス
 */
export interface PlansResponse {
  /** 現在のプランID */
  currentPlanId: string
  /** 利用可能プラン一覧 */
  plans: AvailablePlan[]
}

/**
 * プラン変更リクエスト
 */
export interface ChangePlanRequest {
  /** 変更先プランID */
  planId: string
}

// ============================================================
// オプション管理
// ============================================================

/**
 * 利用可能オプション
 */
export interface AvailableOption {
  /** オプションID */
  optionId: string
  /** オプション名 */
  optionName: string
  /** 月額料金 */
  monthlyPrice: number
  /** 説明 */
  description: string
  /** 登録済みかどうか */
  isEnrolled: boolean
  /** カテゴリ */
  category: string
}

/**
 * オプション一覧レスポンス
 */
export interface OptionsResponse {
  /** 利用可能オプション一覧 */
  options: AvailableOption[]
}

// ============================================================
// 通知
// ============================================================

/**
 * 通知項目
 */
export interface NotificationItem {
  /** 通知ID */
  id: string
  /** タイトル */
  title: string
  /** メッセージ */
  message: string
  /** 種別 */
  type: 'info' | 'warning' | 'billing' | 'campaign'
  /** 日時 */
  createdAt: string
  /** 既読かどうか */
  isRead: boolean
}

// ============================================================
// 共通
// ============================================================

/**
 * API成功レスポンス
 */
export interface ApiSuccessResponse {
  /** ステータス */
  status: 'success'
  /** メッセージ */
  message: string
}

/**
 * APIエラーレスポンス
 */
export interface ApiErrorResponse {
  /** ステータス */
  status: 'error'
  /** エラーメッセージ */
  message: string
  /** タイムスタンプ */
  timestamp: string
}
