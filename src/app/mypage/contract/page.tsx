'use client'

/**
 * @fileoverview 契約情報ページ
 * @module app/mypage/contract/page
 *
 * EC-278: アカウント管理機能
 * シナリオ3: 契約情報詳細表示
 *
 * 契約者情報、契約詳細、デバイス情報を表示するページ。
 */

import { useEffect } from 'react'
import { ContractorInfo, ContractDetails } from '@/components/mypage/contract'
import { DeviceInfo } from '@/components/mypage/dashboard'
import { useContractStore } from '@/store/contractStore'
import { getContractDetails, getDeviceInfo } from '@/services/contractService'

/**
 * 契約情報ページコンポーネント
 *
 * @returns 契約情報ページ要素
 */
export default function ContractPage() {
  const { details, deviceInfo, setDetails, setDeviceInfo, setLoading, isLoading } = useContractStore()

  useEffect(() => {
    const fetchContractData = async () => {
      setLoading(true)

      try {
        const [detailsRes, deviceRes] = await Promise.all([
          getContractDetails(),
          getDeviceInfo(),
        ])

        setDetails(detailsRes)
        setDeviceInfo(deviceRes)
      } catch (error) {
        console.error('契約情報の取得に失敗しました:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContractData()
  }, [setDetails, setDeviceInfo, setLoading])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">契約情報</h1>

      <div className="space-y-6">
        <ContractorInfo details={details} isLoading={isLoading} />
        <ContractDetails details={details} isLoading={isLoading} />
        <DeviceInfo device={deviceInfo} isLoading={isLoading} />
      </div>
    </div>
  )
}
