import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Frontend Template',
  description: 'Next.js frontend template with TypeScript and Tailwind CSS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
