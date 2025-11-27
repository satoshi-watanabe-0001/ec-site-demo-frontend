/**
 * @fileoverview lib/utilsのユニットテスト
 * @module lib/__tests__/utils.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { cn, formatDate, sleep } from '../utils'

describe('cn', () => {
  describe('基本機能', () => {
    test('cn_WithSingleClass_ShouldReturnClass', () => {
      // Arrange
      const input = 'text-red-500'

      // Act
      const result = cn(input)

      // Assert
      expect(result).toBe('text-red-500')
    })

    test('cn_WithMultipleClasses_ShouldMergeClasses', () => {
      // Arrange
      const classes = ['text-red-500', 'bg-blue-500']

      // Act
      const result = cn(...classes)

      // Assert
      expect(result).toBe('text-red-500 bg-blue-500')
    })

    test('cn_WithConditionalClasses_ShouldIncludeOnlyTruthyClasses', () => {
      // Arrange
      const isActive = true
      const isDisabled = false

      // Act
      const result = cn('base-class', isActive && 'active-class', isDisabled && 'disabled-class')

      // Assert
      expect(result).toBe('base-class active-class')
      expect(result).not.toContain('disabled-class')
    })

    test('cn_WithConflictingTailwindClasses_ShouldMergeCorrectly', () => {
      // Arrange
      const baseClass = 'text-red-500'
      const overrideClass = 'text-blue-500'

      // Act
      const result = cn(baseClass, overrideClass)

      // Assert
      expect(result).toBe('text-blue-500')
    })

    test('cn_WithEmptyInput_ShouldReturnEmptyString', () => {
      // Arrange & Act
      const result = cn()

      // Assert
      expect(result).toBe('')
    })

    test('cn_WithUndefinedAndNull_ShouldIgnoreFalsyValues', () => {
      // Arrange & Act
      const result = cn('valid-class', undefined, null, 'another-class')

      // Assert
      expect(result).toBe('valid-class another-class')
    })

    test('cn_WithObjectSyntax_ShouldApplyConditionalClasses', () => {
      // Arrange
      const conditions = {
        'active-class': true,
        'inactive-class': false,
      }

      // Act
      const result = cn('base', conditions)

      // Assert
      expect(result).toBe('base active-class')
    })

    test('cn_WithArraySyntax_ShouldFlattenAndMerge', () => {
      // Arrange
      const classes = ['class-a', ['class-b', 'class-c']]

      // Act
      const result = cn(classes)

      // Assert
      expect(result).toBe('class-a class-b class-c')
    })
  })
})

describe('formatDate', () => {
  describe('基本機能', () => {
    test('formatDate_WithValidDate_ShouldReturnJapaneseFormat', () => {
      // Arrange
      const date = new Date('2025-01-15')

      // Act
      const result = formatDate(date)

      // Assert
      expect(result).toMatch(/2025年1月15日/)
    })

    test('formatDate_WithDifferentMonth_ShouldFormatCorrectly', () => {
      // Arrange
      const date = new Date('2025-12-25')

      // Act
      const result = formatDate(date)

      // Assert
      expect(result).toMatch(/2025年12月25日/)
    })

    test('formatDate_WithFirstDayOfYear_ShouldFormatCorrectly', () => {
      // Arrange
      const date = new Date('2025-01-01')

      // Act
      const result = formatDate(date)

      // Assert
      expect(result).toMatch(/2025年1月1日/)
    })

    test('formatDate_WithLastDayOfYear_ShouldFormatCorrectly', () => {
      // Arrange
      const date = new Date('2025-12-31')

      // Act
      const result = formatDate(date)

      // Assert
      expect(result).toMatch(/2025年12月31日/)
    })
  })
})

describe('sleep', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('基本機能', () => {
    test('sleep_WithMilliseconds_ShouldReturnPromise', () => {
      // Arrange & Act
      const result = sleep(1000)

      // Assert
      expect(result).toBeInstanceOf(Promise)
    })

    test('sleep_WithMilliseconds_ShouldResolveAfterDelay', async () => {
      // Arrange
      const ms = 1000
      let resolved = false

      // Act
      const promise = sleep(ms).then(() => {
        resolved = true
      })

      // Assert - before timer
      expect(resolved).toBe(false)

      // Advance timers
      jest.advanceTimersByTime(ms)
      await promise

      // Assert - after timer
      expect(resolved).toBe(true)
    })

    test('sleep_WithZeroMilliseconds_ShouldResolveImmediately', async () => {
      // Arrange
      const ms = 0
      let resolved = false

      // Act
      const promise = sleep(ms).then(() => {
        resolved = true
      })

      jest.advanceTimersByTime(0)
      await promise

      // Assert
      expect(resolved).toBe(true)
    })
  })
})
