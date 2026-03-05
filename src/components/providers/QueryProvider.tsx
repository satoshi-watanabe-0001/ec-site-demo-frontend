'use client'

/**
 * @fileoverview TanStack Query プロバイダーコンポーネント
 * @module components/providers/QueryProvider
 *
 * アプリケーション全体でTanStack Queryを使用するためのプロバイダー。
 * 5分間のstaleTimeをデフォルトで設定。
 * 開発環境ではMSWの初期化も行う。
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

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
 * 開発環境ではMSWワーカーを自動的に起動する。
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

  const [mswReady, setMswReady] = useState(false)

  // 開発環境でMSWワーカーを初期化
  useEffect(() => {
    async function initMsw() {
      if (process.env.NODE_ENV === 'development') {
        const { enableMocking } = await import('@/lib/msw')
        await enableMocking()
      }
      setMswReady(true)
    }
    initMsw()
  }, [])

  // MSW初期化完了まではローディング表示
  if (!mswReady) {
    return null
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
