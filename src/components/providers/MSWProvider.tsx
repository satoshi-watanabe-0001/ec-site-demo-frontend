'use client'

/**
 * @fileoverview MSWプロバイダーコンポーネント
 * @module components/providers/MSWProvider
 *
 * 開発環境でMSWを初期化し、APIリクエストをモックするためのプロバイダー。
 */

import { useEffect, useState } from 'react'

/**
 * MSWプロバイダーのプロパティ
 */
interface MSWProviderProps {
  children: React.ReactNode
}

/**
 * MSWプロバイダーコンポーネント
 *
 * 開発環境でMSWを初期化し、子コンポーネントをレンダリングする。
 * MSWの初期化が完了するまでローディング状態を表示。
 *
 * @param props - プロバイダーのプロパティ
 * @returns MSWプロバイダー要素
 */
export function MSWProvider({ children }: MSWProviderProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initMSW = async () => {
      if (process.env.NODE_ENV === 'development') {
        const { enableMocking } = await import('@/lib/msw')
        await enableMocking()
      }
      setIsReady(true)
    }

    initMSW()
  }, [])

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="animate-pulse text-slate-400">読み込み中...</div>
      </div>
    )
  }

  return <>{children}</>
}
