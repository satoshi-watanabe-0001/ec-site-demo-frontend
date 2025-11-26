import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import './globals.css'

export const metadata: Metadata = {
  title: 'ahamo | ドコモのオンライン専用プラン',
  description: 'ahamoはドコモのオンライン専用プラン。シンプルでおトクな料金プランをご提供します。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-900 text-white">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
