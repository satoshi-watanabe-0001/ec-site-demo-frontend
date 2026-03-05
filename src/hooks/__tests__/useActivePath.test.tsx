/**
 * @fileoverview useActivePathのユニットテスト
 * @module hooks/__tests__/useActivePath.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 */

import React from 'react'
import { renderHook } from '@testing-library/react'
import { useActivePath, useActivePathMap } from '../use-active-path'

// Mock next/navigation
const mockPathname = jest.fn().mockReturnValue('/')
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

describe('useActivePath', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/')
  })

  describe('完全一致モード', () => {
    test('useActivePath_ExactMatchOnSamePath_ShouldReturnTrue', () => {
      mockPathname.mockReturnValue('/products')
      const { result } = renderHook(() => useActivePath('/products', true))
      expect(result.current).toBe(true)
    })

    test('useActivePath_ExactMatchOnDifferentPath_ShouldReturnFalse', () => {
      mockPathname.mockReturnValue('/products/iphone')
      const { result } = renderHook(() => useActivePath('/products', true))
      expect(result.current).toBe(false)
    })
  })

  describe('前方一致モード', () => {
    test('useActivePath_PrefixMatchOnSamePath_ShouldReturnTrue', () => {
      mockPathname.mockReturnValue('/products')
      const { result } = renderHook(() => useActivePath('/products'))
      expect(result.current).toBe(true)
    })

    test('useActivePath_PrefixMatchOnNestedPath_ShouldReturnTrue', () => {
      mockPathname.mockReturnValue('/products/iphone')
      const { result } = renderHook(() => useActivePath('/products'))
      expect(result.current).toBe(true)
    })

    test('useActivePath_PrefixMatchOnDifferentPath_ShouldReturnFalse', () => {
      mockPathname.mockReturnValue('/about')
      const { result } = renderHook(() => useActivePath('/products'))
      expect(result.current).toBe(false)
    })

    test('useActivePath_RootPath_ShouldOnlyMatchExactRoot', () => {
      mockPathname.mockReturnValue('/')
      const { result } = renderHook(() => useActivePath('/'))
      expect(result.current).toBe(true)
    })

    test('useActivePath_RootPathOnOtherPage_ShouldReturnFalse', () => {
      mockPathname.mockReturnValue('/products')
      const { result } = renderHook(() => useActivePath('/'))
      expect(result.current).toBe(false)
    })
  })
})

describe('useActivePathMap', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/')
  })

  test('useActivePathMap_WithMultiplePaths_ShouldReturnCorrectStates', () => {
    mockPathname.mockReturnValue('/products')
    const { result } = renderHook(() => useActivePathMap(['/products', '/pricing', '/support']))

    expect(result.current['/products']).toBe(true)
    expect(result.current['/pricing']).toBe(false)
    expect(result.current['/support']).toBe(false)
  })

  test('useActivePathMap_WithRootPath_ShouldHandleCorrectly', () => {
    mockPathname.mockReturnValue('/')
    const { result } = renderHook(() => useActivePathMap(['/', '/products']))

    expect(result.current['/']).toBe(true)
    expect(result.current['/products']).toBe(false)
  })

  test('useActivePathMap_WithNestedPath_ShouldMatchParent', () => {
    mockPathname.mockReturnValue('/products/iphone')
    const { result } = renderHook(() => useActivePathMap(['/products', '/pricing']))

    expect(result.current['/products']).toBe(true)
    expect(result.current['/pricing']).toBe(false)
  })
})
