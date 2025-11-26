/**
 * @fileoverview 料金プランセクションコンポーネント
 * @module components/sections/PricingSection
 *
 * ahamoの料金プランと大盛りオプションを表示するセクション。
 * レスポンシブデザインとアクセシビリティ対応。
 */

'use client'

import React from 'react'
import { GradientButton } from '@/components/ui/gradient-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PricingPlan, PricingOption } from '@/types'

/**
 * ahamoベーシックプランのデータ
 */
const basicPlan: PricingPlan = {
  id: 'ahamo-basic',
  name: 'ahamo',
  price: 2970,
  dataCapacity: 20,
  freeCallMinutes: 5,
  description: 'シンプルでおトクな料金プラン',
  features: [
    '月額2,970円（税込）',
    'データ容量20GB',
    '5分以内の国内通話無料',
    '5G対応',
    '海外82の国・地域でそのまま使える',
  ],
  isRecommended: true,
}

/**
 * 大盛りオプションのデータ
 */
const oomoriOption: PricingOption = {
  id: 'oomori-option',
  name: '大盛りオプション',
  additionalPrice: 1980,
  additionalDataCapacity: 80,
  description: 'データをたっぷり使いたい方に',
}

/**
 * 料金プランカードのProps
 */
interface PlanCardProps {
  plan: PricingPlan
  className?: string
}

/**
 * 料金プランカードコンポーネント
 */
function PlanCard({ plan, className }: PlanCardProps): React.ReactElement {
  return (
    <article
      className={cn(
        'relative rounded-2xl bg-white p-6 shadow-lg border-2 transition-transform hover:scale-[1.02]',
        plan.isRecommended ? 'border-orange-500' : 'border-gray-200',
        className
      )}
      aria-labelledby={`plan-${plan.id}-title`}
    >
      {plan.isRecommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-4 py-1 rounded-full">
          おすすめ
        </span>
      )}

      <header className="text-center mb-6">
        <h3 id={`plan-${plan.id}-title`} className="text-2xl font-bold text-gray-900 mb-2">
          {plan.name}
        </h3>
        <p className="text-gray-600">{plan.description}</p>
      </header>

      <div className="text-center mb-6">
        <span className="text-4xl md:text-5xl font-bold text-gray-900">
          {plan.price.toLocaleString()}
        </span>
        <span className="text-lg text-gray-600">円/月（税込）</span>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <div className="text-center">
          <span className="block text-2xl font-bold text-orange-500">{plan.dataCapacity}GB</span>
          <span className="text-sm text-gray-600">データ容量</span>
        </div>
        <div className="text-center">
          <span className="block text-2xl font-bold text-orange-500">{plan.freeCallMinutes}分</span>
          <span className="text-sm text-gray-600">無料通話</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6" aria-label="プランの特徴">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-3">
        <GradientButton className="w-full" size="lg">
          申し込む
        </GradientButton>
        <Button variant="outline" className="w-full">
          詳細を見る
        </Button>
      </div>
    </article>
  )
}

/**
 * オプションカードのProps
 */
interface OptionCardProps {
  option: PricingOption
  className?: string
}

/**
 * オプションカードコンポーネント
 */
function OptionCard({ option, className }: OptionCardProps): React.ReactElement {
  return (
    <article
      className={cn(
        'rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-6 shadow-lg border border-orange-200',
        className
      )}
      aria-labelledby={`option-${option.id}-title`}
    >
      <header className="text-center mb-4">
        <h3 id={`option-${option.id}-title`} className="text-xl font-bold text-gray-900 mb-2">
          {option.name}
        </h3>
        <p className="text-gray-600">{option.description}</p>
      </header>

      <div className="text-center mb-4">
        <span className="text-lg text-gray-600">+</span>
        <span className="text-3xl md:text-4xl font-bold text-gray-900 mx-2">
          {option.additionalPrice.toLocaleString()}
        </span>
        <span className="text-lg text-gray-600">円/月（税込）</span>
      </div>

      <div className="text-center mb-6">
        <span className="inline-block bg-orange-500 text-white text-lg font-bold px-4 py-2 rounded-lg">
          +{option.additionalDataCapacity}GB
        </span>
        <p className="text-sm text-gray-600 mt-2">
          合計{basicPlan.dataCapacity + option.additionalDataCapacity}GBまで使える！
        </p>
      </div>

      <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-50">
        オプションを追加
      </Button>
    </article>
  )
}

/**
 * 料金プランセクションコンポーネント
 *
 * @returns 料金プランセクション要素
 */
export function PricingSection(): React.ReactElement {
  return (
    <section className="py-16 md:py-24 bg-gray-50" aria-labelledby="pricing-section-title">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2
            id="pricing-section-title"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            料金プラン
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            シンプルでわかりやすい料金体系。必要に応じてオプションを追加できます。
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PlanCard plan={basicPlan} />
          <OptionCard option={oomoriOption} />
        </div>

        <footer className="text-center mt-8">
          <p className="text-sm text-gray-500">
            ※ 料金は税込表示です。別途ユニバーサルサービス料がかかります。
          </p>
        </footer>
      </div>
    </section>
  )
}
