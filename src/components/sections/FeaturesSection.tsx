/**
 * @fileoverview ahamoの特徴セクションコンポーネント
 * @module components/sections/FeaturesSection
 *
 * ahamoの5つの主要特徴をカード形式で表示するセクション。
 * lucide-reactアイコンを使用。
 */

'use client'

import React from 'react'
import { Tag, Signal, Globe, CreditCard, MessageCircle, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * 特徴データの型定義
 */
interface Feature {
  id: string
  title: string
  description: string
  icon: LucideIcon
  color: string
}

/**
 * ahamoの5つの主要特徴
 */
const features: Feature[] = [
  {
    id: 'simple-pricing',
    title: 'シンプルな料金体系',
    description: '月額2,970円（税込）のワンプラン。複雑な割引条件なしで、誰でもおトクに使えます。',
    icon: Tag,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: '5g-network',
    title: '高品質な5G通信',
    description: 'ドコモの高品質な5Gネットワークをそのまま利用。快適な通信環境をお届けします。',
    icon: Signal,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'global-roaming',
    title: '海外でもそのまま使える',
    description: '82の国・地域で追加料金なしでデータ通信が可能。海外旅行や出張も安心です。',
    icon: Globe,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'dcard-benefit',
    title: 'dカード特典',
    description: 'dカード GOLDなら毎月のahamo料金の10%がdポイントで還元。さらにおトクに。',
    icon: CreditCard,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'chat-support',
    title: '24時間チャットサポート',
    description: 'いつでもチャットで相談可能。困ったときもすぐにサポートを受けられます。',
    icon: MessageCircle,
    color: 'from-yellow-500 to-orange-500',
  },
]

/**
 * 特徴カードのProps
 */
interface FeatureCardProps {
  feature: Feature
}

/**
 * 特徴カードコンポーネント
 */
function FeatureCard({ feature }: FeatureCardProps): React.ReactElement {
  const IconComponent = feature.icon

  return (
    <article
      className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      aria-labelledby={`feature-${feature.id}-title`}
    >
      {/* アイコン */}
      <div
        className={cn(
          'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 transition-transform group-hover:scale-110',
          feature.color
        )}
      >
        <IconComponent className="w-7 h-7 text-white" aria-hidden="true" />
      </div>

      {/* タイトル */}
      <h3
        id={`feature-${feature.id}-title`}
        className="text-xl font-bold text-gray-900 mb-2"
      >
        {feature.title}
      </h3>

      {/* 説明 */}
      <p className="text-gray-600 leading-relaxed">{feature.description}</p>

      {/* 装飾的なグラデーションライン */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity',
          feature.color
        )}
      />
    </article>
  )
}

/**
 * ahamoの特徴セクションコンポーネント
 *
 * @returns ahamoの特徴セクション要素
 */
export function FeaturesSection(): React.ReactElement {
  return (
    <section className="py-16 md:py-24 bg-white" aria-labelledby="features-section-title">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2
            id="features-section-title"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            ahamoの特徴
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            シンプルでおトク、そして安心。ahamoが選ばれる5つの理由をご紹介します。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.slice(0, 3).map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-6">
          {features.slice(3).map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
