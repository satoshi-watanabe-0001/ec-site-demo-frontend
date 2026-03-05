/**
 * @fileoverview MSWプロバイダーコンポーネント
 * @module components/providers/MSWProvider
 *
 * 開発環境でMSW（Mock Service Worker）を初期化するプロバイダー。
 * MSWの初期化が完了するまで子コンポーネントのレンダリングを遅延させる。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { enableMocking } from '@/lib/msw'

/**
 * MSWプロバイダーコンポーネント
 *
 * 開発環境ではMSWの初期化完了を待ってから子コンポーネントをレンダリング。
 * 本番環境では即座に子コンポーネントをレンダリング。
 *
 * @param props - コンポーネントのProps
 * @returns MSWプロバイダー要素
 */
export function MSWProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement | null {
  const [isReady, setIsReady] = useState(process.env.NODE_ENV !== 'development')

  useEffect(() => {
    enableMocking().then(() => {
      setIsReady(true)
    })
  }, [])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
