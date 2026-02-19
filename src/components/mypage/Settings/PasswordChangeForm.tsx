'use client'

import React, { useState } from 'react'

interface PasswordChangeFormProps {
  onSubmit: (data: { currentPassword: string; newPassword: string }) => Promise<void>
}

export function PasswordChangeForm({ onSubmit }: PasswordChangeFormProps): React.ReactElement {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '新しいパスワードが一致しません' })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'パスワードは8文字以上で入力してください' })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ currentPassword, newPassword })
      setMessage({ type: 'success', text: 'パスワードを変更しました' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setMessage({ type: 'error', text: '現在のパスワードが正しくありません' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="password-change-form">
      <h2 className="text-lg font-bold text-white mb-4">パスワード変更</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="current-password" className="block text-sm text-slate-400 mb-1">
            現在のパスワード
          </label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="new-password" className="block text-sm text-slate-400 mb-1">
            新しいパスワード
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-500 focus:outline-none"
            required
            minLength={8}
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-sm text-slate-400 mb-1">
            新しいパスワード（確認）
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-500 focus:outline-none"
            required
            minLength={8}
          />
        </div>
        {message && (
          <div
            className={`p-3 rounded text-sm ${
              message.type === 'success'
                ? 'bg-teal-500/20 text-teal-400'
                : 'bg-red-500/20 text-red-400'
            }`}
            data-testid="password-form-message"
          >
            {message.text}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="password-submit-button"
        >
          {isSubmitting ? '変更中...' : 'パスワードを変更'}
        </button>
      </form>
    </div>
  )
}
