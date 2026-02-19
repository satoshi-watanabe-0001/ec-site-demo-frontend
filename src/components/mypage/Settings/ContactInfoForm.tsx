'use client'

import React, { useState } from 'react'

interface ContactInfoFormProps {
  initialEmail: string
  initialPhone: string
  initialAddress: string
  onSubmit: (data: { email: string; phone: string; address: string }) => Promise<void>
}

export function ContactInfoForm({
  initialEmail,
  initialPhone,
  initialAddress,
  onSubmit,
}: ContactInfoFormProps): React.ReactElement {
  const [email, setEmail] = useState(initialEmail)
  const [phone, setPhone] = useState(initialPhone)
  const [address, setAddress] = useState(initialAddress)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    try {
      await onSubmit({ email, phone, address })
      setMessage({ type: 'success', text: '連絡先情報を更新しました' })
    } catch {
      setMessage({ type: 'error', text: '更新に失敗しました。もう一度お試しください。' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="contact-info-form">
      <h2 className="text-lg font-bold text-white mb-4">連絡先情報</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contact-email" className="block text-sm text-slate-400 mb-1">
            メールアドレス
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="block text-sm text-slate-400 mb-1">
            電話番号
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="contact-address" className="block text-sm text-slate-400 mb-1">
            住所
          </label>
          <input
            id="contact-address"
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-500 focus:outline-none"
            required
          />
        </div>
        {message && (
          <div
            className={`p-3 rounded text-sm ${
              message.type === 'success'
                ? 'bg-teal-500/20 text-teal-400'
                : 'bg-red-500/20 text-red-400'
            }`}
            data-testid="contact-form-message"
          >
            {message.text}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="contact-submit-button"
        >
          {isSubmitting ? '更新中...' : '連絡先を更新'}
        </button>
      </form>
    </div>
  )
}
