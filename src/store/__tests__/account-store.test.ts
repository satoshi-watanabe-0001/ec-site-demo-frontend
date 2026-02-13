/**
 * @fileoverview account-storeのユニットテスト
 * @module store/__tests__/account-store.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { useAccountStore } from '../account-store'
import { act } from '@testing-library/react'
import type { DashboardData } from '@/types'

jest.mock('@/services/accountService', () => ({
  getDashboardData: jest.fn(),
}))

import { getDashboardData } from '@/services/accountService'

const mockGetDashboardData = getDashboardData as jest.MockedFunction<typeof getDashboardData>

const mockDashboardData: DashboardData = {
  contract: {
    id: 'contract-001',
    planName: 'ahamo',
    monthlyFee: 2970,
    dataCapacity: '30GB',
    contractDate: '2024-01-15',
    phoneNumber: '090-1234-5678',
    options: [],
  },
  dataUsage: {
    contractId: 'contract-001',
    currentMonth: { used: 12800, total: 30720, lastUpdated: '2025-01-20T10:30:00Z' },
    dailyUsage: [],
  },
  billing: {
    contractId: 'contract-001',
    currentBill: {
      basicFee: 2970,
      optionFee: 0,
      callFee: 0,
      total: 2970,
      previousMonthTotal: 2970,
    },
    history: [],
  },
  device: {
    id: 'device-001',
    name: 'iPhone 16 Pro',
    imageUrl: '/images/devices/iphone-16-pro.png',
    purchaseDate: '2024-10-01',
  },
  notifications: {
    unreadCount: 0,
    notifications: [],
  },
}

describe('useAccountStore', () => {
  beforeEach(() => {
    act(() => {
      useAccountStore.getState().clearAccountData()
    })
    mockGetDashboardData.mockClear()
  })

  describe('初期状態', () => {
    test('useAccountStore_InitialState_ShouldHaveNullDashboardData', () => {
      // Arrange & Act
      const state = useAccountStore.getState()

      // Assert
      expect(state.dashboardData).toBeNull()
    })

    test('useAccountStore_InitialState_ShouldNotBeLoading', () => {
      // Arrange & Act
      const state = useAccountStore.getState()

      // Assert
      expect(state.isLoading).toBe(false)
    })

    test('useAccountStore_InitialState_ShouldHaveNullError', () => {
      // Arrange & Act
      const state = useAccountStore.getState()

      // Assert
      expect(state.error).toBeNull()
    })
  })

  describe('fetchDashboardData', () => {
    test('fetchDashboardData_WithValidUserId_ShouldSetDashboardData', async () => {
      // Arrange
      mockGetDashboardData.mockResolvedValueOnce(mockDashboardData)

      // Act
      await act(async () => {
        await useAccountStore.getState().fetchDashboardData('user-001')
      })

      // Assert
      const state = useAccountStore.getState()
      expect(state.dashboardData).toEqual(mockDashboardData)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    test('fetchDashboardData_WhenCalled_ShouldSetLoadingTrue', async () => {
      // Arrange
      let loadingDuringFetch = false
      mockGetDashboardData.mockImplementationOnce(() => {
        loadingDuringFetch = useAccountStore.getState().isLoading
        return Promise.resolve(mockDashboardData)
      })

      // Act
      await act(async () => {
        await useAccountStore.getState().fetchDashboardData('user-001')
      })

      // Assert
      expect(loadingDuringFetch).toBe(true)
    })

    test('fetchDashboardData_WithError_ShouldSetErrorMessage', async () => {
      // Arrange
      mockGetDashboardData.mockRejectedValueOnce(new Error('テストエラー'))

      // Act
      await act(async () => {
        await useAccountStore.getState().fetchDashboardData('user-001')
      })

      // Assert
      const state = useAccountStore.getState()
      expect(state.error).toBe('テストエラー')
      expect(state.isLoading).toBe(false)
      expect(state.dashboardData).toBeNull()
    })

    test('fetchDashboardData_WithNonErrorThrow_ShouldSetDefaultMessage', async () => {
      // Arrange
      mockGetDashboardData.mockRejectedValueOnce('unknown error')

      // Act
      await act(async () => {
        await useAccountStore.getState().fetchDashboardData('user-001')
      })

      // Assert
      const state = useAccountStore.getState()
      expect(state.error).toBe('データの取得に失敗しました。')
    })
  })

  describe('clearAccountData', () => {
    test('clearAccountData_WhenDataExists_ShouldResetToInitialState', async () => {
      // Arrange
      mockGetDashboardData.mockResolvedValueOnce(mockDashboardData)
      await act(async () => {
        await useAccountStore.getState().fetchDashboardData('user-001')
      })

      // Act
      act(() => {
        useAccountStore.getState().clearAccountData()
      })

      // Assert
      const state = useAccountStore.getState()
      expect(state.dashboardData).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })
})
