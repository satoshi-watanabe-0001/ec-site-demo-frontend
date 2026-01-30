'use client'

/**
 * @fileoverview パスワード変更フォームコンポーネント
 * @module components/mypage/settings/PasswordChangeForm
 *
 * アカウントのパスワードを変更するフォーム。
 */

import { useState } from 'react'
import type { ChangePasswordRequest } from '@/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/**
 * パスワード変更フォームコンポーネントのProps
 */
interface PasswordChangeFormProps {
  /** 送信中かどうか */
  isSubmitting?: boolean
  /** 送信時のコールバック */
  onSubmit?: (data: ChangePasswordRequest) => Promise<void>
  /** 追加のクラス名 */
  className?: string
}

/**
 * パスワード変更フォームコンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @returns パスワード変更フォーム
 */
export function PasswordChangeForm({ isSubmitting, onSubmit, className }: PasswordChangeFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: keyof ChangePasswordRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
    setSuccess(false)
  }

  const validateForm = (): boolean => {
    if (!formData.currentPassword) {
      setError('現在のパスワードを入力してください')
      return false
    }
    if (!formData.newPassword) {
      setError('新しいパスワードを入力してください')
      return false
    }
    if (formData.newPassword.length < 8) {
      setError('新しいパスワードは8文字以上で入力してください')
      return false
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('新しいパスワードと確認用パスワードが一致しません')
      return false
    }
    if (formData.currentPassword === formData.newPassword) {
      setError('新しいパスワードは現在のパスワードと異なるものを設定してください')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSubmit) return

    if (!validateForm()) return

    try {
      await onSubmit(formData)
      setSuccess(true)
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setTimeout(() => {
        setIsExpanded(false)
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'パスワードの変更に失敗しました')
    }
  }

  const handleCancel = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setIsExpanded(false)
    setError(null)
    setSuccess(false)
  }

  return (
    <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">パスワード変更</h3>
        {!isExpanded && (
          <Button onClick={() => setIsExpanded(true)} variant="ghost" size="sm">
            変更する
          </Button>
        )}
      </div>

      {!isExpanded ? (
        <p className="text-sm text-slate-400">
          セキュリティのため、定期的なパスワード変更をお勧めします
        </p>
      ) : (
        <>
          {error && (
            <div className="mb-4 rounded bg-red-500/20 p-3 text-sm text-red-400" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded bg-green-500/20 p-3 text-sm text-green-400" role="status">
              パスワードを変更しました
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="mb-1 block text-sm text-slate-400">
                現在のパスワード
              </label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={e => handleInputChange('currentPassword', e.target.value)}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="mb-1 block text-sm text-slate-400">
                新しいパスワード
              </label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={e => handleInputChange('newPassword', e.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <p className="mt-1 text-xs text-slate-500">8文字以上で入力してください</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm text-slate-400">
                新しいパスワード（確認）
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={e => handleInputChange('confirmPassword', e.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '変更中...' : 'パスワードを変更'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
