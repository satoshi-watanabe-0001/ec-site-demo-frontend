/**
 * @fileoverview マイページダッシュボード
 * @module app/mypage/page
 *
 * EC-278: マイページのメインダッシュボード画面。
 * プラン概要、データ使用量、請求見積もり、端末情報、通知、
 * クイックアクセスリンク、サポートオプションを表示。
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  BarChart3,
  CreditCard,
  Settings,
  Smartphone,
  Bell,
  MessageCircle,
  HelpCircle,
  Mail,
  Phone,
  ChevronRight,
  Wifi,
  AlertTriangle,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import type { ContractDetail } from '@/types/contract'
import type { DataUsage } from '@/types/data-usage'
import type { CurrentBilling } from '@/types/billing'
import type { NotificationsResponse } from '@/types/account'

/** API Base URL */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * クイックアクセスリンクの定義
 */
const quickLinks = [
  { href: '/mypage/contract', label: '契約内容', icon: FileText, description: '契約情報の確認' },
  {
    href: '/mypage/data-usage',
    label: 'データ使用量',
    icon: BarChart3,
    description: '使用量の確認',
  },
  {
    href: '/mypage/billing',
    label: '請求・支払い',
    icon: CreditCard,
    description: '請求情報の確認',
  },
  { href: '/mypage/settings', label: 'アカウント設定', icon: Settings, description: '設定の変更' },
  {
    href: '/mypage/plan',
    label: 'プラン変更',
    icon: Smartphone,
    description: 'プランの確認・変更',
  },
  {
    href: '/mypage/options',
    label: 'オプション管理',
    icon: Smartphone,
    description: 'オプションの管理',
  },
]

/**
 * サポートオプションの定義
 */
const supportOptions = [
  {
    label: 'チャットサポート',
    icon: MessageCircle,
    description: 'AIチャットで相談',
    action: 'chat',
  },
  { label: 'よくある質問', icon: HelpCircle, description: 'FAQを確認', action: 'faq' },
  {
    label: 'お問い合わせフォーム',
    icon: Mail,
    description: 'メールで問い合わせ',
    action: 'contact',
  },
  { label: '電話サポート', icon: Phone, description: '0120-087-360', action: 'phone' },
]

/**
 * 金額のフォーマット
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP').format(amount)
}

/**
 * マイページダッシュボードコンポーネント
 *
 * @returns ダッシュボード要素
 */
export default function MyPageDashboard(): React.ReactElement {
  const { user } = useAuthStore()
  const [contract, setContract] = useState<ContractDetail | null>(null)
  const [dataUsage, setDataUsage] = useState<DataUsage | null>(null)
  const [billing, setBilling] = useState<CurrentBilling | null>(null)
  const [notifications, setNotifications] = useState<NotificationsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [contractRes, dataUsageRes, billingRes, notificationsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/account/contract`),
          fetch(`${BASE_URL}/api/v1/account/data-usage`),
          fetch(`${BASE_URL}/api/v1/account/billing/current`),
          fetch(`${BASE_URL}/api/v1/account/notifications`),
        ])

        if (contractRes.ok) setContract(await contractRes.json())
        if (dataUsageRes.ok) setDataUsage(await dataUsageRes.json())
        if (billingRes.ok) setBilling(await billingRes.json())
        if (notificationsRes.ok) setNotifications(await notificationsRes.json())
      } catch (error) {
        console.error('ダッシュボードデータの取得に失敗しました:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400" role="status" aria-label="読み込み中">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
          <p>読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-white">マイページ</h1>
        <p className="text-slate-400 mt-1">こんにちは、{user?.name || 'ゲスト'}さん</p>
      </div>

      {/* 通知バナー */}
      {notifications && notifications.unreadCount > 0 && (
        <Link
          href="/mypage/settings"
          className="flex items-center gap-3 bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 hover:bg-blue-900/50 transition-colors"
          aria-label={`${notifications.unreadCount}件の未読通知`}
        >
          <Bell className="h-5 w-5 text-blue-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-blue-300 text-sm font-medium">
              {notifications.unreadCount}件の未読通知があります
            </p>
            {notifications.notifications[0] && (
              <p className="text-slate-400 text-xs mt-0.5">
                {notifications.notifications[0].title}
              </p>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </Link>
      )}

      {/* メインカード群 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* プラン概要カード */}
        <div className="bg-slate-800 rounded-lg p-6" aria-label="現在のプラン">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">現在のプラン</h2>
            <Link href="/mypage/plan" className="text-blue-400 text-sm hover:text-blue-300">
              変更する
            </Link>
          </div>
          {contract ? (
            <div>
              <p className="text-2xl font-bold text-white">{contract.currentPlan.name}</p>
              <p className="text-slate-400 mt-1">
                月額 ¥{formatCurrency(contract.currentPlan.monthlyPrice)}（税込）
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                <Wifi className="h-4 w-4" />
                <span>データ容量: {contract.currentPlan.dataCapacity}GB</span>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">データを取得できませんでした</p>
          )}
        </div>

        {/* データ使用量カード */}
        <div className="bg-slate-800 rounded-lg p-6" aria-label="データ使用量">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">データ使用量</h2>
            <Link href="/mypage/data-usage" className="text-blue-400 text-sm hover:text-blue-300">
              詳細を見る
            </Link>
          </div>
          {dataUsage ? (
            <div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-white">{dataUsage.usedData}GB</span>
                <span className="text-slate-400 pb-1">/ {dataUsage.totalCapacity}GB</span>
              </div>
              {/* プログレスバー */}
              <div
                className="w-full bg-slate-700 rounded-full h-3"
                role="progressbar"
                aria-valuenow={dataUsage.usagePercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`データ使用量: ${dataUsage.usagePercentage}%`}
              >
                <div
                  className={`h-3 rounded-full transition-all ${
                    dataUsage.usagePercentage >= 90
                      ? 'bg-red-500'
                      : dataUsage.usagePercentage >= 70
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(dataUsage.usagePercentage, 100)}%` }}
                />
              </div>
              <p className="text-slate-400 text-sm mt-2">
                残り {dataUsage.remainingData}GB
                {dataUsage.isThrottled && (
                  <span className="text-red-400 ml-2 inline-flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    速度制限中
                  </span>
                )}
              </p>
            </div>
          ) : (
            <p className="text-slate-500">データを取得できませんでした</p>
          )}
        </div>

        {/* 請求見積もりカード */}
        <div className="bg-slate-800 rounded-lg p-6" aria-label="今月の請求見積もり">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">今月の請求見積もり</h2>
            <Link href="/mypage/billing" className="text-blue-400 text-sm hover:text-blue-300">
              詳細を見る
            </Link>
          </div>
          {billing ? (
            <div>
              <p className="text-3xl font-bold text-white">
                ¥{formatCurrency(billing.totalAmount)}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                {billing.isConfirmed ? '確定' : '見積もり（税込）'}
              </p>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>基本料金</span>
                  <span>¥{formatCurrency(billing.basicCharge)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>オプション</span>
                  <span>¥{formatCurrency(billing.optionCharges)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">データを取得できませんでした</p>
          )}
        </div>

        {/* 端末情報カード */}
        <div className="bg-slate-800 rounded-lg p-6" aria-label="ご利用端末">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">ご利用端末</h2>
            <Link href="/mypage/contract" className="text-blue-400 text-sm hover:text-blue-300">
              詳細を見る
            </Link>
          </div>
          {contract ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Smartphone className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-white font-medium">{contract.device.name}</p>
                <p className="text-slate-400 text-sm">
                  {contract.device.color} / {contract.device.storage}
                </p>
                {contract.device.installmentInfo && (
                  <p className="text-slate-400 text-sm mt-1">
                    分割残: {contract.device.installmentInfo.remainingInstallments}回 （月額 ¥
                    {formatCurrency(contract.device.installmentInfo.monthlyAmount)}）
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-slate-500">データを取得できませんでした</p>
          )}
        </div>
      </div>

      {/* クイックアクセスリンク */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">各種手続き</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-slate-800 rounded-lg p-4 text-center hover:bg-slate-700 transition-colors group"
              aria-label={link.label}
            >
              <link.icon className="h-6 w-6 text-slate-400 group-hover:text-blue-400 mx-auto mb-2 transition-colors" />
              <p className="text-sm text-slate-300 group-hover:text-white font-medium">
                {link.label}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* サポートオプション */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">サポート</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {supportOptions.map(option => (
            <Button
              key={option.action}
              variant="outline"
              className="bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600 p-4 h-auto flex flex-col items-center gap-2"
              aria-label={option.label}
            >
              <option.icon className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-300">{option.label}</span>
              <span className="text-xs text-slate-500">{option.description}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
