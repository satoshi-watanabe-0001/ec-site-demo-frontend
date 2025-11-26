/**
 * @fileoverview ニュース関連の型定義
 * @module types/news
 *
 * お知らせ・ニュースセクションで使用するニュースデータの型定義。
 */

/**
 * ニュースカテゴリの型定義
 */
export type NewsCategory =
  | 'お知らせ'
  | 'キャンペーン'
  | 'メンテナンス'
  | '新機能'
  | '重要'
  | '端末'
  | 'サービス'

/**
 * ニュース記事の型定義
 */
export interface NewsItem {
  /** ニュースID */
  id: string
  /** ニュースタイトル */
  title: string
  /** 公開日 */
  publishedAt: string
  /** ニュースカテゴリ */
  category: NewsCategory
  /** ニュース概要（オプション） */
  summary?: string
  /** 詳細ページURL */
  detailUrl: string
  /** 重要フラグ */
  isImportant?: boolean
}

/**
 * ニュースAPIレスポンスの型定義
 */
export interface NewsResponse {
  /** ニュースリスト */
  news: NewsItem[]
  /** 総件数 */
  totalCount: number
}
