'use client'

/**
 * @fileoverview マイページダッシュボード
 * @module app/mypage/page
 *
 * EC-278: アカウント管理機能
 * シナリオ1: ダッシュボード表示
 * シナリオ2: 契約情報サマリー表示
 *
 * マイページのメインダッシュボード。契約情報、データ使用量、請求情報、
 * デバイス情報、通知をサマリー形式で表示。
 */

import { useEffect, useState } from 'react'
import {
  ContractSummary,
  DataUsageCard,
  BillingSummary,
  DeviceInfo,
  NotificationPanel,
} from '@/components/mypage/dashboard'
import { useContractStore } from '@/store/contractStore'
import { useDataUsageStore } from '@/store/dataUsageStore'
import { useBillingStore } from '@/store/billingStore'
import {
  getContractSummary,
  getDeviceInfo,
} from '@/services/contractService'
import { getCurrentDataUsage } from '@/services/dataUsageService'
import { getCurrentBilling } from '@/services/billingService'
import { getNotifications } from '@/services/notificationService'
import type { Notification } from '@/types'

/**
 * マイページダッシュボードコンポーネント
 *
 * @returns ダッシュボードページ要素
 */
export default function MyPageDashboard() {
  const { summary, deviceInfo, setSummary, setDeviceInfo, setLoading: setContractLoading, isLoading: contractLoading } = useContractStore()
  const { currentUsage, setCurrentUsage, setLoading: setDataUsageLoading, isLoading: dataUsageLoading } = useDataUsageStore()
  const { currentBilling, setCurrentBilling, setLoading: setBillingLoading, isLoading: billingLoading } = useBillingStore()
  
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsLoading, setNotificationsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setContractLoading(true)
      setDataUsageLoading(true)
      setBillingLoading(true)
      setNotificationsLoading(true)

      try {
        const [contractSummaryRes, deviceInfoRes, dataUsageRes, billingRes, notificationsRes] = await Promise.all([
          getContractSummary(),
          getDeviceInfo(),
          getCurrentDataUsage(),
          getCurrentBilling(),
          getNotifications(),
        ])

        setSummary(contractSummaryRes)
        setDeviceInfo(deviceInfoRes)
        setCurrentUsage(dataUsageRes)
        setCurrentBilling(billingRes)
        setNotifications(notificationsRes.notifications)
        setUnreadCount(notificationsRes.unreadCount)
      } catch (error) {
        console.error('ダッシュボードデータの取得に失敗しました:', error)
      } finally {
        setContractLoading(false)
        setDataUsageLoading(false)
        setBillingLoading(false)
        setNotificationsLoading(false)
      }
    }

    fetchDashboardData()
  }, [setSummary, setDeviceInfo, setCurrentUsage, setCurrentBilling, setContractLoading, setDataUsageLoading, setBillingLoading])

  const handleNotificationClick = (notification: Notification) => {
    console.log('通知クリック:', notification.notificationId)
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">ダッシュボード</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <ContractSummary summary={summary} isLoading={contractLoading} />
        <DataUsageCard usage={currentUsage} isLoading={dataUsageLoading} />
        <BillingSummary billing={currentBilling} isLoading={billingLoading} />
        <DeviceInfo device={deviceInfo} isLoading={contractLoading} />
      </div>

      <div className="mt-6">
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          isLoading={notificationsLoading}
          onNotificationClick={handleNotificationClick}
        />
      </div>
    </div>
  )
}
