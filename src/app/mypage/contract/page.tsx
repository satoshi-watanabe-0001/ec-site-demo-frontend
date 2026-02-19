'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { getContract } from '@/services/ContractApiService'
import type { ContractInfo } from '@/types'
import { ContractDetailCard, DeviceDetailCard } from '@/components/mypage/ContractInfo'

export default function ContractPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [contract, setContract] = useState<ContractInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchContract = async () => {
      try {
        const data = await getContract()
        setContract(data.contract)
      } catch {
        setError('契約情報の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchContract()
  }, [isAuthenticated, router])

  if (!isAuthenticated) return <div />

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8" data-testid="contract-loading">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-48" />
          <div className="h-64 bg-slate-800 rounded-lg" />
          <div className="h-48 bg-slate-800 rounded-lg" />
        </div>
      </div>
    )
  }

  if (error || !contract) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-500/20 text-red-400 p-4 rounded-lg" data-testid="contract-error">
          {error || 'データの取得に失敗しました'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid="contract-page">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/mypage"
          className="text-slate-400 hover:text-white transition-colors"
        >
          ← マイページ
        </Link>
        <h1 className="text-2xl font-bold text-white">契約情報</h1>
      </div>
      <div className="space-y-6">
        <ContractDetailCard contract={contract} />
        <DeviceDetailCard device={contract.device} />
      </div>
    </div>
  )
}
