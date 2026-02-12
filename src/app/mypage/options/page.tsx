/**
 * @fileoverview オプション管理ページ
 * @module app/mypage/options/page
 *
 * 契約中オプションと追加可能オプションの管理。
 */

'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import {
  getContractInfo,
  getAvailableOptions,
  addOption,
  removeOption,
} from '@/services/contractService'
import { OptionManager } from '@/components/mypage'

export default function OptionsPage(): React.ReactElement {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()
  const [resultMessage, setResultMessage] = useState('')

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const { data: contract, isLoading: contractLoading } = useQuery({
    queryKey: ['contract'],
    queryFn: () => getContractInfo('mock-token'),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })

  const { data: availableOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ['availableOptions'],
    queryFn: () => getAvailableOptions('mock-token'),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })

  const addMutation = useMutation({
    mutationFn: (optionId: string) => addOption('mock-token', optionId),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['contract'] })
      queryClient.invalidateQueries({ queryKey: ['availableOptions'] })
      setResultMessage(data.message)
      setTimeout(() => setResultMessage(''), 3000)
    },
    onError: () => {
      setResultMessage('オプション追加に失敗しました')
      setTimeout(() => setResultMessage(''), 3000)
    },
  })

  const removeMutation = useMutation({
    mutationFn: (optionId: string) => removeOption('mock-token', optionId),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['contract'] })
      setResultMessage(data.message)
      setTimeout(() => setResultMessage(''), 3000)
    },
    onError: () => {
      setResultMessage('オプション解約に失敗しました')
      setTimeout(() => setResultMessage(''), 3000)
    },
  })

  if (!isAuthenticated) {
    return <div />
  }

  const isLoading = contractLoading || optionsLoading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-slate-700" />
            <div className="h-48 rounded-xl bg-slate-800" />
            <div className="h-48 rounded-xl bg-slate-800" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/mypage"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            マイページに戻る
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">オプション管理</h1>
        </div>

        {resultMessage && (
          <div
            className={`mb-6 rounded-lg p-3 text-sm ${
              resultMessage.includes('失敗')
                ? 'bg-red-900/20 text-red-400'
                : 'bg-green-900/20 text-green-400'
            }`}
            role="alert"
          >
            {resultMessage}
          </div>
        )}

        {contract && availableOptions && (
          <OptionManager
            currentOptions={contract.details.options}
            availableOptions={availableOptions}
            onAddOption={optionId => addMutation.mutate(optionId)}
            onRemoveOption={optionId => removeMutation.mutate(optionId)}
            isLoading={addMutation.isPending || removeMutation.isPending}
          />
        )}
      </div>
    </div>
  )
}
