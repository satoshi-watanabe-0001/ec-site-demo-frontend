'use client'

/**
 * @fileoverview 連絡先情報編集フォームコンポーネント
 * @module components/mypage/settings/ContactInfoForm
 *
 * アカウントの連絡先情報を編集するフォーム。
 */

import { useState } from 'react'
import type { AccountProfile, UpdateAccountProfileRequest } from '@/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/**
 * 連絡先情報編集フォームコンポーネントのProps
 */
interface ContactInfoFormProps {
  /** アカウントプロファイル */
  profile: AccountProfile | null
  /** 読み込み中かどうか */
  isLoading?: boolean
  /** 送信中かどうか */
  isSubmitting?: boolean
  /** 送信時のコールバック */
  onSubmit?: (data: UpdateAccountProfileRequest) => Promise<void>
  /** 追加のクラス名 */
  className?: string
}

/**
 * 連絡先情報編集フォームコンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @returns 連絡先情報編集フォーム
 */
export function ContactInfoForm({
  profile,
  isLoading,
  isSubmitting,
  onSubmit,
  className,
}: ContactInfoFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UpdateAccountProfileRequest>({
    email: profile?.email || '',
    phoneNumber: profile?.phoneNumber || '',
    postalCode: profile?.postalCode || '',
    address: profile?.address || '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof UpdateAccountProfileRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSubmit) return

    try {
      await onSubmit(formData)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました')
    }
  }

  const handleCancel = () => {
    setFormData({
      email: profile?.email || '',
      phoneNumber: profile?.phoneNumber || '',
      postalCode: profile?.postalCode || '',
      address: profile?.address || '',
    })
    setIsEditing(false)
    setError(null)
  }

  if (isLoading) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-32 rounded bg-slate-700" />
          <div className="space-y-4">
            <div className="h-10 w-full rounded bg-slate-700" />
            <div className="h-10 w-full rounded bg-slate-700" />
            <div className="h-10 w-full rounded bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <h3 className="mb-4 text-lg font-semibold text-white">連絡先情報</h3>
        <p className="text-slate-400">連絡先情報を取得できませんでした</p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">連絡先情報</h3>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm">
            編集
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-500/20 p-3 text-sm text-red-400" role="alert">
          {error}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-slate-400">
              メールアドレス
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="mb-1 block text-sm text-slate-400">
              電話番号
            </label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={e => handleInputChange('phoneNumber', e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="mb-1 block text-sm text-slate-400">
              郵便番号
            </label>
            <Input
              id="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={e => handleInputChange('postalCode', e.target.value)}
              disabled={isSubmitting}
              placeholder="123-4567"
            />
          </div>

          <div>
            <label htmlFor="address" className="mb-1 block text-sm text-slate-400">
              住所
            </label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={e => handleInputChange('address', e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : '保存'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              キャンセル
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400">メールアドレス</p>
            <p className="mt-1 text-white">{profile.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">電話番号</p>
            <p className="mt-1 text-white">{profile.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">郵便番号</p>
            <p className="mt-1 text-white">{profile.postalCode}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">住所</p>
            <p className="mt-1 text-white">{profile.address}</p>
          </div>
        </div>
      )}
    </div>
  )
}
