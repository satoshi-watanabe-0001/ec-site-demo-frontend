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
