/**
 * @fileoverview ahamoトップページ
 * @module app/page
 *
 * ahamoのメインランディングページ。
 * 6つのセクションで構成されたフル機能のトップページ。
 */

import {
  PricingSection,
  PopularDevicesSection,
  CampaignSection,
  FeaturesSection,
  NewsSection,
  SupportSection,
} from '@/components/sections'
import { GradientButton } from '@/components/ui/gradient-button'

/**
 * ヒーローセクションコンポーネント
 *
 * @returns ヒーローセクション要素
 */
function HeroSection(): React.ReactElement {
  return (
    <section
      className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-20 md:py-32"
      aria-labelledby="hero-title"
    >
      <div className="container mx-auto px-4 text-center">
        <h1
          id="hero-title"
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
        >
          シンプルで、おトク。
          <br />
          それが ahamo。
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
          月額2,970円（税込）で20GB + 5分以内の国内通話無料。
          <br />
          ドコモの高品質ネットワークをそのままに。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GradientButton size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
            今すぐ申し込む
          </GradientButton>
          <button
            className="inline-flex items-center justify-center px-12 py-4 text-lg font-semibold rounded-lg border-2 border-white text-white bg-transparent hover:bg-white/10 transition-all duration-300"
          >
            料金シミュレーション
          </button>
        </div>
      </div>

      {/* 装飾的な背景要素 */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>
    </section>
  )
}

/**
 * ahamoトップページコンポーネント
 *
 * @returns トップページ要素
 */
export default function Home(): React.ReactElement {
  return (
    <main>
      {/* ヒーローセクション */}
      <HeroSection />

      {/* 料金プランセクション */}
      <PricingSection />

      {/* 人気端末セクション */}
      <PopularDevicesSection />

      {/* キャンペーン情報セクション */}
      <CampaignSection />

      {/* ahamoの特徴セクション */}
      <FeaturesSection />

      {/* お知らせ・ニュースセクション */}
      <NewsSection />

      {/* サポート情報セクション */}
      <SupportSection />
    </main>
  )
}
