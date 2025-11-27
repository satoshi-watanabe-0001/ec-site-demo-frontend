/**
 * @fileoverview カテゴリ関連の型定義
 * @module types/category
 *
 * 製品カテゴリページで使用する型定義。
 * カテゴリの表示に必要な情報を定義。
 */

/**
 * カテゴリデータの型定義
 *
 * 製品カテゴリの表示に必要な情報を含む。
 */
export interface Category {
  /** カテゴリの一意識別子 */
  id: number
  /** カテゴリ名 */
  name: string
  /** URLスラッグ（例: 'iphone', 'android'） */
  slug: string
  /** カテゴリ画像のURL */
  imageUrl: string
  /** カテゴリの説明（オプション） */
  description?: string
  /** 表示順序 */
  displayOrder: number
}

/**
 * カラーオプションDTO
 * バックエンドAPIから返されるカラー情報
 */
export interface ColorOptionDto {
  /** カラー名 */
  name: string
  /** カラーコード（16進数） */
  hex: string
}

/**
 * キャンペーンバッジDTO
 * バックエンドAPIから返されるキャンペーン情報
 */
export interface CampaignBadgeDto {
  /** キャンペーンコード */
  campaignCode: string
  /** バッジテキスト */
  badgeText: string
}

/**
 * 製品カードDTO
 * バックエンドAPIから返される製品情報
 */
export interface ProductCardDto {
  /** 製品ID */
  productId: number
  /** 製品名 */
  productName: string
  /** メーカー名 */
  manufacturer: string
  /** 販売価格（税込） */
  price: number
  /** 元の価格（割引前、オプション） */
  originalPrice?: number
  /** 月額料金（オプション） */
  monthlyPayment?: number
  /** 製品画像URL配列 */
  imageUrls: string[]
  /** ストレージオプション */
  storageOptions: string[]
  /** カラーオプション */
  colorOptions: ColorOptionDto[]
  /** キャンペーンバッジ */
  campaigns?: CampaignBadgeDto[]
  /** 在庫状況 */
  inStock: boolean
  /** 製品説明（オプション） */
  description?: string
}

/**
 * カテゴリ詳細レスポンス
 * カテゴリ製品一覧APIのレスポンス型
 */
export interface CategoryDetailResponse {
  /** カテゴリコード */
  categoryCode: string
  /** カテゴリ名 */
  categoryName: string
  /** 製品リスト */
  products: ProductCardDto[]
  /** 総件数 */
  totalCount: number
}
