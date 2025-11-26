/**
 * @fileoverview 検索バーコンポーネント
 * @module components/layout/header/search-bar
 *
 * ヘッダー内の検索機能を提供するコンポーネント。
 * 展開/折りたたみ機能とデバウンス処理を実装。
 */

'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * 検索バーコンポーネントのProps型定義
 */
interface SearchBarProps {
  /** 検索実行時のコールバック */
  onSearch?: (query: string) => void
  /** プレースホルダーテキスト */
  placeholder?: string
  /** 追加のCSSクラス */
  className?: string
}

/**
 * 検索バーコンポーネント
 *
 * 展開/折りたたみ可能な検索バー。
 * デバウンス処理により、入力中の過度なAPI呼び出しを防止。
 * アクセシビリティ対応（role="search"、aria-expanded）。
 *
 * @param props - 検索バーのプロパティ
 * @returns 検索バー要素
 */
export function SearchBar({
  onSearch,
  placeholder = '機種名やキーワードで検索',
  className,
}: SearchBarProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * 検索バーを展開する
   */
  const handleExpand = useCallback(() => {
    setIsExpanded(true)
  }, [])

  /**
   * 検索バーを折りたたむ
   */
  const handleCollapse = useCallback(() => {
    setIsExpanded(false)
    setQuery('')
  }, [])

  /**
   * 検索クエリの変更を処理
   * デバウンス処理により300ms後に検索を実行
   */
  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value
      setQuery(newQuery)

      // 既存のタイマーをクリア
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // 新しいタイマーを設定（300msのデバウンス）
      debounceTimerRef.current = setTimeout(() => {
        if (onSearch && newQuery.trim()) {
          onSearch(newQuery.trim())
        }
      }, 300)
    },
    [onSearch]
  )

  /**
   * Enterキーで検索を実行
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && query.trim() && onSearch) {
        // デバウンスタイマーをクリアして即座に検索
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
        onSearch(query.trim())
      } else if (e.key === 'Escape') {
        handleCollapse()
      }
    },
    [query, onSearch, handleCollapse]
  )

  // 展開時に入力フィールドにフォーカス
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <div
      className={cn('relative flex items-center', className)}
      role="search"
      aria-label="サイト内検索"
    >
      {isExpanded ? (
        <div className="flex items-center bg-slate-700 rounded-lg overflow-hidden">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-48 sm:w-64 px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            aria-expanded={isExpanded}
            aria-label="検索キーワードを入力"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCollapse}
            className="text-gray-400 hover:text-white hover:bg-slate-600 mr-1"
            aria-label="検索を閉じる"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExpand}
          className="text-gray-300 hover:text-white hover:bg-slate-700"
          aria-label="検索を開く"
          aria-expanded={isExpanded}
        >
          <Search className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
