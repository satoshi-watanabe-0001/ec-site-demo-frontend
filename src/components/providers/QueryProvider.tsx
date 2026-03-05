'use client'

/**
 * @fileoverview TanStack Query プロバイダーコンポーネント
 * @module components/providers/QueryProvider
 *
 * アプリケーション全体でTanStack Queryを使用するためのプロバイダー。
 * 5分間のstaleTimeをデフォルトで設定。
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

/**
 * QueryProviderのProps
 */
interface QueryProviderProps {
  children: React.ReactNode
}

/**
 * TanStack Query プロバイダー
 *
 * QueryClientをReactのstateで管理し、SSR時の再利用を防止する。
 * デフォルトオプションとして5分間のstaleTimeを設定。
 *
 * @param props - コンポーネントプロパティ
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5分間キャッシュ
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
