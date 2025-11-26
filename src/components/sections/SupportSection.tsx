/**
 * @fileoverview サポート情報セクションコンポーネント
 * @module components/sections/SupportSection
 *
 * FAQ、チャットサポート、お問い合わせ、各種手続きへの導線を提供するセクション。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { HelpCircle, MessageCircle, Phone, FileText, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * サポートリンクの型定義
 */
interface SupportLink {
  id: string
  title: string
  description: string
  icon: LucideIcon
  href: string
  color: string
}

/**
 * サポートリンクデータ
 */
const supportLinks: SupportLink[] = [
  {
    id: 'faq',
    title: 'よくあるご質問',
    description: 'お客様からよくいただくご質問とその回答をまとめています。',
    icon: HelpCircle,
    href: '/support/faq',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'chat',
    title: 'チャットサポート',
    description: '24時間いつでもチャットでお問い合わせいただけます。',
    icon: MessageCircle,
    href: '/support/chat',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'contact',
    title: 'お問い合わせ',
    description: 'お電話やメールでのお問い合わせはこちらから。',
    icon: Phone,
    href: '/support/contact',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'procedures',
    title: '各種手続き',
    description: '契約内容の変更、オプション追加、解約などの手続きができます。',
    icon: FileText,
    href: '/support/procedures',
    color: 'from-purple-500 to-pink-500',
  },
]

/**
 * サポートカードのProps
 */
interface SupportCardProps {
  link: SupportLink
}

/**
 * サポートカードコンポーネント
 */
function SupportCard({ link }: SupportCardProps): React.ReactElement {
  const IconComponent = link.icon

  return (
    <Link
      href={link.href}
      className="group block bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      aria-labelledby={`support-${link.id}-title`}
    >
      <div className="flex items-start gap-4">
        {/* アイコン */}
        <div
          className={cn(
            'w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110',
            link.color
          )}
        >
          <IconComponent className="w-6 h-6 text-white" aria-hidden="true" />
        </div>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          <h3
            id={`support-${link.id}-title`}
            className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors"
          >
            {link.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{link.description}</p>
        </div>

        {/* 矢印 */}
        <div className="flex-shrink-0 text-gray-400 group-hover:text-orange-500 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  )
}

/**
 * サポート情報セクションコンポーネント
 *
 * @returns サポート情報セクション要素
 */
export function SupportSection(): React.ReactElement {
  return (
    <section className="py-16 md:py-24 bg-white" aria-labelledby="support-section-title">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2
            id="support-section-title"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            サポート
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            お困りのことがあれば、いつでもお気軽にご相談ください。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {supportLinks.map((link) => (
            <SupportCard key={link.id} link={link} />
          ))}
        </div>

        {/* 追加のサポート情報 */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gray-100 rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              お電話でのお問い合わせ
            </h3>
            <p className="text-3xl font-bold text-orange-500 mb-2">
              0120-XXX-XXX
            </p>
            <p className="text-sm text-gray-600">
              受付時間: 9:00〜20:00（年中無休）
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
