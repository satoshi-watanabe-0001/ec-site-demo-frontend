'use client'

import React, { useState } from 'react'
import type { OptionService } from '@/types'

interface OptionServiceListProps {
  options: OptionService[]
  onSubscribe: (optionId: string) => Promise<void>
}

export function OptionServiceList({
  options,
  onSubscribe,
}: OptionServiceListProps): React.ReactElement {
  const [subscribingId, setSubscribingId] = useState<string | null>(null)
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(
    new Set(options.filter(o => o.isSubscribed).map(o => o.id))
  )
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubscribe = async (optionId: string) => {
    setSubscribingId(optionId)
    setMessage(null)
    try {
      await onSubscribe(optionId)
      setSubscribedIds(prev => new Set([...prev, optionId]))
      setMessage({ type: 'success', text: 'オプションサービスに加入しました' })
    } catch {
      setMessage({ type: 'error', text: '加入に失敗しました。もう一度お試しください。' })
    } finally {
      setSubscribingId(null)
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="option-service-list">
      <h2 className="text-lg font-bold text-white mb-4">オプションサービス</h2>
      {message && (
        <div
          className={`p-3 rounded text-sm mb-4 ${
            message.type === 'success'
              ? 'bg-teal-500/20 text-teal-400'
              : 'bg-red-500/20 text-red-400'
          }`}
          data-testid="option-subscribe-message"
        >
          {message.text}
        </div>
      )}
      <div className="space-y-3">
        {options.map(option => {
          const isSubscribed = subscribedIds.has(option.id)
          return (
            <div
              key={option.id}
              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
              data-testid={`option-item-${option.id}`}
            >
              <div>
                <p className="text-white font-medium">{option.name}</p>
                <p className="text-xs text-slate-400 mt-1">{option.description}</p>
              </div>
              <div className="text-right flex items-center gap-4">
                <p className="text-lg font-bold text-white">
                  ¥{option.monthlyFee.toLocaleString()}
                  <span className="text-xs text-slate-400">/月</span>
                </p>
                {isSubscribed ? (
                  <span className="px-3 py-1.5 bg-teal-500/20 text-teal-400 text-sm rounded">
                    加入中
                  </span>
                ) : (
                  <button
                    onClick={() => handleSubscribe(option.id)}
                    disabled={subscribingId === option.id}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid={`subscribe-option-button-${option.id}`}
                  >
                    {subscribingId === option.id ? '処理中...' : '加入する'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
