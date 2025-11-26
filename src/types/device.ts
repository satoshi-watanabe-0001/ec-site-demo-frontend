/**
 * @fileoverview 端末関連の型定義
 * @module types/device
 *
 * 人気端末セクションで使用する端末情報の型定義。
 */

/**
 * 端末ラベルの型定義
 */
export type DeviceLabel = 'NEW' | '人気' | 'おすすめ' | '在庫わずか'

/**
 * 端末情報の型定義
 */
export interface Device {
  /** 端末ID */
  id: string
  /** 端末名 */
  name: string
  /** メーカー名 */
  manufacturer: string
  /** 端末画像URL */
  imageUrl: string
  /** 販売価格（税込） */
  price: number
  /** 元の価格（割引前、オプション） */
  originalPrice?: number
  /** 端末ラベル */
  labels: DeviceLabel[]
  /** 端末の説明 */
  description?: string
  /** 在庫状況 */
  inStock: boolean
  /** 詳細ページURL */
  detailUrl: string
}

/**
 * 人気端末APIレスポンスの型定義
 */
export interface PopularDevicesResponse {
  /** 端末リスト */
  devices: Device[]
  /** 総件数 */
  totalCount: number
}
