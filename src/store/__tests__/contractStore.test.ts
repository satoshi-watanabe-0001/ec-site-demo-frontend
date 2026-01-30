/**
 * @fileoverview contractStoreのユニットテスト
 * @module store/__tests__/contractStore.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { useContractStore } from '../contractStore'
import { act } from '@testing-library/react'
import type { ContractSummary, ContractDetails, DeviceInfo } from '@/types'

describe('useContractStore', () => {
  beforeEach(() => {
    act(() => {
      useContractStore.getState().reset()
    })
  })

  describe('初期状態', () => {
    test('useContractStore_InitialState_ShouldHaveNullSummary', () => {
      // Arrange & Act
      const state = useContractStore.getState()

      // Assert
      expect(state.summary).toBeNull()
    })

    test('useContractStore_InitialState_ShouldHaveNullDetails', () => {
      // Arrange & Act
      const state = useContractStore.getState()

      // Assert
      expect(state.details).toBeNull()
    })

    test('useContractStore_InitialState_ShouldHaveNullDeviceInfo', () => {
      // Arrange & Act
      const state = useContractStore.getState()

      // Assert
      expect(state.deviceInfo).toBeNull()
    })

    test('useContractStore_InitialState_ShouldNotBeLoading', () => {
      // Arrange & Act
      const state = useContractStore.getState()

      // Assert
      expect(state.isLoading).toBe(false)
    })

    test('useContractStore_InitialState_ShouldHaveNullError', () => {
      // Arrange & Act
      const state = useContractStore.getState()

      // Assert
      expect(state.error).toBeNull()
    })
  })

  describe('setSummary', () => {
    test('setSummary_WithValidSummary_ShouldSetSummary', () => {
      // Arrange
      const summary: ContractSummary = {
        contractId: 'CNT-001',
        phoneNumber: '090-1234-5678',
        planName: 'ahamo',
        dataCapacity: 20,
        monthlyFee: 2970,
        status: 'active',
        contractStartDate: '2023-04-01',
      }

      // Act
      act(() => {
        useContractStore.getState().setSummary(summary)
      })

      // Assert
      const state = useContractStore.getState()
      expect(state.summary).toEqual(summary)
    })

    test('setSummary_WithValidSummary_ShouldClearError', () => {
      // Arrange
      act(() => {
        useContractStore.getState().setError('テストエラー')
      })
      const summary: ContractSummary = {
        contractId: 'CNT-001',
        phoneNumber: '090-1234-5678',
        planName: 'ahamo',
        dataCapacity: 20,
        monthlyFee: 2970,
        status: 'active',
        contractStartDate: '2023-04-01',
      }

      // Act
      act(() => {
        useContractStore.getState().setSummary(summary)
      })

      // Assert
      const state = useContractStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe('setDetails', () => {
    test('setDetails_WithValidDetails_ShouldSetDetails', () => {
      // Arrange
      const details: ContractDetails = {
        contractId: 'CNT-001',
        phoneNumber: '090-1234-5678',
        contractStartDate: '2023-04-01',
        plan: {
          id: 'plan-001',
          name: 'ahamo',
          dataCapacity: 20,
          monthlyFee: 2970,
        },
        options: [],
        simInfo: {
          simType: 'eSIM',
          iccid: '8981100012345678901',
          activationDate: '2023-04-01',
        },
        contractor: {
          name: '山田 太郎',
          nameKana: 'ヤマダ タロウ',
          birthDate: '1990-01-15',
          address: {
            postalCode: '100-0001',
            prefecture: '東京都',
            city: '千代田区',
            street: '千代田1-1-1',
          },
          email: 'test@docomo.ne.jp',
          phone: '090-1234-5678',
        },
        status: 'active',
      }

      // Act
      act(() => {
        useContractStore.getState().setDetails(details)
      })

      // Assert
      const state = useContractStore.getState()
      expect(state.details).toEqual(details)
    })
  })

  describe('setDeviceInfo', () => {
    test('setDeviceInfo_WithValidDeviceInfo_ShouldSetDeviceInfo', () => {
      // Arrange
      const deviceInfo: DeviceInfo = {
        deviceId: 'device-001',
        name: 'iPhone 16 Pro',
        manufacturer: 'Apple',
        modelNumber: 'A3293',
        imei: '35912345678901*',
        purchaseDate: '2024-09-20',
        warrantyEndDate: '2025-09-19',
        installmentBalance: 89760,
        installmentRemainingMonths: 18,
      }

      // Act
      act(() => {
        useContractStore.getState().setDeviceInfo(deviceInfo)
      })

      // Assert
      const state = useContractStore.getState()
      expect(state.deviceInfo).toEqual(deviceInfo)
    })
  })

  describe('setLoading', () => {
    test('setLoading_WithTrue_ShouldSetIsLoadingTrue', () => {
      // Arrange & Act
      act(() => {
        useContractStore.getState().setLoading(true)
      })

      // Assert
      const state = useContractStore.getState()
      expect(state.isLoading).toBe(true)
    })

    test('setLoading_WithFalse_ShouldSetIsLoadingFalse', () => {
      // Arrange
      act(() => {
        useContractStore.getState().setLoading(true)
      })

      // Act
      act(() => {
        useContractStore.getState().setLoading(false)
      })

      // Assert
      const state = useContractStore.getState()
      expect(state.isLoading).toBe(false)
    })
  })

  describe('setError', () => {
    test('setError_WithErrorMessage_ShouldSetError', () => {
      // Arrange & Act
      act(() => {
        useContractStore.getState().setError('テストエラー')
      })

      // Assert
      const state = useContractStore.getState()
      expect(state.error).toBe('テストエラー')
    })

    test('setError_WithErrorMessage_ShouldSetIsLoadingFalse', () => {
      // Arrange
      act(() => {
        useContractStore.getState().setLoading(true)
      })

      // Act
      act(() => {
        useContractStore.getState().setError('テストエラー')
      })

      // Assert
      const state = useContractStore.getState()
      expect(state.isLoading).toBe(false)
    })

    test('setError_WithNull_ShouldClearError', () => {
      // Arrange
      act(() => {
        useContractStore.getState().setError('テストエラー')
      })

      // Act
      act(() => {
        useContractStore.getState().setError(null)
      })

      // Assert
      const state = useContractStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe('reset', () => {
    test('reset_WhenCalled_ShouldResetAllState', () => {
      // Arrange
      const summary: ContractSummary = {
        contractId: 'CNT-001',
        phoneNumber: '090-1234-5678',
        planName: 'ahamo',
        dataCapacity: 20,
        monthlyFee: 2970,
        status: 'active',
        contractStartDate: '2023-04-01',
      }
      act(() => {
        useContractStore.getState().setSummary(summary)
        useContractStore.getState().setLoading(true)
        useContractStore.getState().setError('テストエラー')
      })

      // Act
      act(() => {
        useContractStore.getState().reset()
      })

      // Assert
      const state = useContractStore.getState()
      expect(state.summary).toBeNull()
      expect(state.details).toBeNull()
      expect(state.deviceInfo).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })
})
