/**
 * @fileoverview OptionServiceListコンポーネントのユニットテスト
 * @module components/mypage/PlanManagement/__tests__/OptionServiceList.test
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { OptionServiceList } from '../OptionServiceList'
import type { OptionService } from '@/types'

describe('OptionServiceList', () => {
  const mockOptions: OptionService[] = [
    {
      id: 'O001',
      name: 'かけ放題オプション',
      monthlyFee: 1100,
      description: '国内通話が24時間かけ放題',
      isSubscribed: true,
      category: '通話',
    },
    {
      id: 'O002',
      name: '端末補償サービス',
      monthlyFee: 825,
      description: '故障・紛失時の端末補償',
      isSubscribed: false,
      category: '補償',
    },
  ]
  const mockOnSubscribe = jest.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    mockOnSubscribe.mockClear()
  })

  test('OptionServiceList_WithOptions_ShouldRenderAllOptions', () => {
    render(<OptionServiceList options={mockOptions} onSubscribe={mockOnSubscribe} />)

    expect(screen.getByText('かけ放題オプション')).toBeInTheDocument()
    expect(screen.getByText('端末補償サービス')).toBeInTheDocument()
  })

  test('OptionServiceList_WithSubscribedOption_ShouldShowSubscribedBadge', () => {
    render(<OptionServiceList options={mockOptions} onSubscribe={mockOnSubscribe} />)

    expect(screen.getByText('加入中')).toBeInTheDocument()
  })

  test('OptionServiceList_WithUnsubscribedOption_ShouldShowSubscribeButton', () => {
    render(<OptionServiceList options={mockOptions} onSubscribe={mockOnSubscribe} />)

    expect(screen.getByTestId('subscribe-option-button-O002')).toHaveTextContent('加入する')
  })

  test('OptionServiceList_WhenSubscribeClicked_ShouldCallOnSubscribe', async () => {
    render(<OptionServiceList options={mockOptions} onSubscribe={mockOnSubscribe} />)

    fireEvent.click(screen.getByTestId('subscribe-option-button-O002'))

    await waitFor(() => {
      expect(mockOnSubscribe).toHaveBeenCalledWith('O002')
    })
  })

  test('OptionServiceList_WhenSubscribeSucceeds_ShouldShowSuccessMessage', async () => {
    render(<OptionServiceList options={mockOptions} onSubscribe={mockOnSubscribe} />)

    fireEvent.click(screen.getByTestId('subscribe-option-button-O002'))

    await waitFor(() => {
      expect(screen.getByTestId('option-subscribe-message')).toHaveTextContent(
        'オプションサービスに加入しました'
      )
    })
  })

  test('OptionServiceList_WhenSubscribeFails_ShouldShowErrorMessage', async () => {
    mockOnSubscribe.mockRejectedValueOnce(new Error('加入失敗'))
    render(<OptionServiceList options={mockOptions} onSubscribe={mockOnSubscribe} />)

    fireEvent.click(screen.getByTestId('subscribe-option-button-O002'))

    await waitFor(() => {
      expect(screen.getByTestId('option-subscribe-message')).toHaveTextContent('加入に失敗しました')
    })
  })

  test('OptionServiceList_WithOptions_ShouldRenderMonthlyFees', () => {
    render(<OptionServiceList options={mockOptions} onSubscribe={mockOnSubscribe} />)

    expect(screen.getByText('¥1,100')).toBeInTheDocument()
    expect(screen.getByText('¥825')).toBeInTheDocument()
  })

  test('OptionServiceList_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(<OptionServiceList options={mockOptions} onSubscribe={mockOnSubscribe} />)

    expect(screen.getByText('オプションサービス')).toBeInTheDocument()
  })

  test('OptionServiceList_WithDefaultProps_ShouldHaveTestId', () => {
    render(<OptionServiceList options={mockOptions} onSubscribe={mockOnSubscribe} />)

    expect(screen.getByTestId('option-service-list')).toBeInTheDocument()
  })
})
