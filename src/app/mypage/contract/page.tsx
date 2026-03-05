'use client'

/**
 * @fileoverview 契約情報ページ
 * @module app/mypage/contract/page
 *
 * 契約の詳細情報を表示するページ。
 * プラン情報、端末情報、契約オプション等を確認可能。
 */

import { useContractInfo } from '@/hooks/useContractInfo'

/**
 * 契約情報ページコンポーネント
 */
export default function ContractPage() {
  const { data, isLoading, error } = useContractInfo()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">契約情報</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg bg-slate-800 p-6">
              <div className="mb-3 h-4 w-1/4 rounded bg-slate-700" />
              <div className="space-y-2">
                <div className="h-3 w-3/4 rounded bg-slate-700" />
                <div className="h-3 w-1/2 rounded bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">契約情報</h1>
        <div className="rounded-lg bg-red-900/20 p-6 text-center" role="alert">
          <p className="text-red-400">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">契約情報</h1>

      {/* 基本契約情報 */}
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">基本情報</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-400">契約ID</dt>
            <dd className="mt-1 font-medium">{data.contractId}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">契約者名</dt>
            <dd className="mt-1 font-medium">{data.contractorName}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">電話番号</dt>
            <dd className="mt-1 font-medium">{data.phoneNumber}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">メールアドレス</dt>
            <dd className="mt-1 font-medium">{data.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">SIMタイプ</dt>
            <dd className="mt-1 font-medium">{data.simType}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">契約開始日</dt>
            <dd className="mt-1 font-medium">{data.contractStartDate}</dd>
          </div>
        </dl>
      </div>

      {/* プラン情報 */}
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">プラン情報</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-400">契約プラン</dt>
            <dd className="mt-1 text-xl font-bold text-blue-400">{data.planName}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">月額料金</dt>
            <dd className="mt-1 text-xl font-bold">
              ¥{data.monthlyCharge.toLocaleString()}
              <span className="text-sm font-normal text-slate-400">（税込）</span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">データ容量</dt>
            <dd className="mt-1 font-medium">{data.dataCapacity}GB</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">無料通話</dt>
            <dd className="mt-1 font-medium">{data.freeCallMinutes}分/回</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">契約更新日</dt>
            <dd className="mt-1 font-medium">{data.contractRenewalDate}</dd>
          </div>
        </dl>
      </div>

      {/* 端末情報 */}
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">端末情報</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-slate-700">
            <span className="text-3xl" aria-hidden="true">
              📱
            </span>
          </div>
          <dl className="grid gap-2">
            <div>
              <dt className="text-sm text-slate-400">端末名</dt>
              <dd className="font-medium">
                {data.device.name}（{data.device.manufacturer}）
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">購入日</dt>
              <dd className="font-medium">{data.device.purchaseDate}</dd>
            </div>
            {data.device.installmentRemaining > 0 && (
              <div>
                <dt className="text-sm text-slate-400">分割払い</dt>
                <dd className="font-medium">
                  残り{data.device.installmentRemaining}回（月々¥
                  {data.device.monthlyInstallment.toLocaleString()}）
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* 契約オプション */}
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">契約中のオプション</h2>
        {data.options.length === 0 ? (
          <p className="text-sm text-slate-400">契約中のオプションはありません</p>
        ) : (
          <div className="space-y-3">
            {data.options.map(option => (
              <div
                key={option.id}
                className="flex items-center justify-between rounded-md bg-slate-700 p-4"
              >
                <div>
                  <p className="font-medium">{option.name}</p>
                  <p className="text-sm text-slate-400">{option.description}</p>
                  <p className="text-xs text-slate-500">契約開始: {option.startDate}</p>
                </div>
                <p className="text-lg font-bold">
                  ¥{option.monthlyPrice.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400">/月</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
