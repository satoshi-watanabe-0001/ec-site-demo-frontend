/**
 * @fileoverview マイページレイアウト
 * @module app/mypage/layout
 *
 * マイページ配下の全ルートに動的レンダリングを適用。
 * TanStack QueryのuseQueryフックを使用するため、
 * ビルド時の静的生成を無効化する。
 */

export const dynamic = 'force-dynamic'

export default function MypageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
