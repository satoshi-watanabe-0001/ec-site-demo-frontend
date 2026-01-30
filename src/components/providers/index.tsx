'use client'

/**
 * @fileoverview アプリケーションプロバイダー
 * @module components/providers
 *
 * アプリケーション全体で使用するプロバイダーをまとめたコンポーネント。
 */

import { MSWProvider } from './MSWProvider'

/**
 * プロバイダーのプロパティ
 */
interface ProvidersProps {
  children: React.ReactNode
}

/**
 * アプリケーションプロバイダーコンポーネント
 *
 * MSWプロバイダーなど、アプリケーション全体で必要なプロバイダーをラップする。
 *
 * @param props - プロバイダーのプロパティ
 * @returns プロバイダー要素
 */
export function Providers({ children }: ProvidersProps) {
  return <MSWProvider>{children}</MSWProvider>
}
