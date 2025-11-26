/**
 * @fileoverview アクティブパス検出フック
 * @module hooks/use-active-path
 *
 * 現在のURLパスに基づいてナビゲーション項目のアクティブ状態を判定する。
 * ネストされたルートや動的ルートにも対応。
 */

'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

/**
 * パスがアクティブかどうかを判定するフック
 *
 * @param path - 判定対象のパス
 * @param exact - 完全一致で判定するかどうか（デフォルト: false）
 * @returns パスがアクティブかどうか
 *
 * @example
 * ```tsx
 * const isActive = useActivePath('/products')
 * // /products, /products/123 などでtrue
 *
 * const isExactActive = useActivePath('/', true)
 * // / でのみtrue
 * ```
 */
export function useActivePath(path: string, exact: boolean = false): boolean {
  const pathname = usePathname()

  return useMemo(() => {
    if (exact) {
      return pathname === path
    }

    // ルートパスの場合は完全一致で判定
    if (path === '/') {
      return pathname === '/'
    }

    // それ以外は前方一致で判定（ネストされたルートに対応）
    return pathname === path || pathname.startsWith(`${path}/`)
  }, [pathname, path, exact])
}

/**
 * 複数のパスに対してアクティブ状態を一括で取得するフック
 *
 * @param paths - 判定対象のパスの配列
 * @returns 各パスのアクティブ状態を含むオブジェクト
 *
 * @example
 * ```tsx
 * const activeStates = useActivePathMap(['/products', '/pricing', '/support'])
 * // { '/products': true, '/pricing': false, '/support': false }
 * ```
 */
export function useActivePathMap(paths: string[]): Record<string, boolean> {
  const pathname = usePathname()

  return useMemo(() => {
    const result: Record<string, boolean> = {}

    for (const path of paths) {
      if (path === '/') {
        result[path] = pathname === '/'
      } else {
        result[path] = pathname === path || pathname.startsWith(`${path}/`)
      }
    }

    return result
  }, [pathname, paths])
}
