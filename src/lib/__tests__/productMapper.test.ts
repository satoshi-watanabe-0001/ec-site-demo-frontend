/**
 * @fileoverview productMapperのユニットテスト
 * @module lib/__tests__/productMapper.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { mapProductCardDtoToDevice, mapProductCardDtosToDevices } from '../productMapper'
import type { ProductCardDto } from '@/types/category'
import type { Device } from '@/types/device'

describe('productMapper', () => {
  describe('mapProductCardDtoToDevice', () => {
    test('mapProductCardDtoToDevice_WithValidDto_ShouldMapAllFields', () => {
      // Arrange
      const dto: ProductCardDto = {
        productId: 1,
        productName: 'iPhone 16 Pro Max',
        manufacturer: 'Apple',
        price: 189800,
        originalPrice: 199800,
        monthlyPayment: 7283,
        imageUrls: ['/images/devices/iphone-16-pro-max.png'],
        storageOptions: ['256GB', '512GB', '1TB'],
        colorOptions: [
          { name: 'ナチュラルチタニウム', hex: '#C4B8A5' },
          { name: 'ブラックチタニウム', hex: '#3C3C3C' },
        ],
        campaigns: [{ campaignCode: 'NEW', badgeText: 'NEW' }],
        inStock: true,
        description: 'A18 Proチップ搭載',
      }

      // Act
      const result = mapProductCardDtoToDevice(dto)

      // Assert
      expect(result.id).toBe('1')
      expect(result.name).toBe('iPhone 16 Pro Max')
      expect(result.manufacturer).toBe('Apple')
      expect(result.price).toBe(189800)
      expect(result.originalPrice).toBe(199800)
      expect(result.monthlyPayment).toBe(7283)
      expect(result.imageUrl).toBe('/images/devices/iphone-16-pro-max.png')
      expect(result.storageOptions).toEqual(['256GB', '512GB', '1TB'])
      expect(result.colorOptions).toEqual([
        { name: 'ナチュラルチタニウム', hex: '#C4B8A5' },
        { name: 'ブラックチタニウム', hex: '#3C3C3C' },
      ])
      expect(result.labels).toEqual(['NEW'])
      expect(result.inStock).toBe(true)
      expect(result.description).toBe('A18 Proチップ搭載')
      expect(result.detailUrl).toBe('/devices/1')
    })

    test('mapProductCardDtoToDevice_WithEmptyImageUrls_ShouldUsePlaceholder', () => {
      // Arrange
      const dto: ProductCardDto = {
        productId: 2,
        productName: 'iPhone 16',
        manufacturer: 'Apple',
        price: 124800,
        imageUrls: [],
        storageOptions: ['128GB'],
        colorOptions: [{ name: 'ブラック', hex: '#1C1C1E' }],
        campaigns: [],
        inStock: true,
      }

      // Act
      const result = mapProductCardDtoToDevice(dto)

      // Assert
      expect(result.imageUrl).toBe('/images/devices/placeholder.png')
    })

    test('mapProductCardDtoToDevice_WithMultipleCampaigns_ShouldMapAllLabels', () => {
      // Arrange
      const dto: ProductCardDto = {
        productId: 3,
        productName: 'iPhone 15',
        manufacturer: 'Apple',
        price: 95800,
        imageUrls: ['/images/devices/iphone-15.png'],
        storageOptions: ['128GB'],
        colorOptions: [{ name: 'ブラック', hex: '#1C1C1E' }],
        campaigns: [
          { campaignCode: 'NEW', badgeText: 'NEW' },
          { campaignCode: 'POPULAR', badgeText: '人気' },
          { campaignCode: 'RECOMMEND', badgeText: 'おすすめ' },
        ],
        inStock: true,
      }

      // Act
      const result = mapProductCardDtoToDevice(dto)

      // Assert
      expect(result.labels).toEqual(['NEW', '人気', 'おすすめ'])
    })

    test('mapProductCardDtoToDevice_WithUnknownCampaign_ShouldFilterOutUnknownLabels', () => {
      // Arrange
      const dto: ProductCardDto = {
        productId: 4,
        productName: 'iPhone SE',
        manufacturer: 'Apple',
        price: 62800,
        imageUrls: ['/images/devices/iphone-se.png'],
        storageOptions: ['64GB'],
        colorOptions: [{ name: 'ホワイト', hex: '#FFFFFF' }],
        campaigns: [
          { campaignCode: 'NEW', badgeText: 'NEW' },
          { campaignCode: 'UNKNOWN', badgeText: '未知のラベル' },
        ],
        inStock: true,
      }

      // Act
      const result = mapProductCardDtoToDevice(dto)

      // Assert
      // 未知のラベルは除外される
      expect(result.labels).toEqual(['NEW'])
    })

    test('mapProductCardDtoToDevice_WithNullCampaigns_ShouldReturnEmptyLabels', () => {
      // Arrange
      const dto: ProductCardDto = {
        productId: 5,
        productName: 'iPhone 14',
        manufacturer: 'Apple',
        price: 85800,
        imageUrls: ['/images/devices/iphone-14.png'],
        storageOptions: ['128GB'],
        colorOptions: [{ name: 'ブルー', hex: '#0000FF' }],
        campaigns: undefined as unknown as ProductCardDto['campaigns'],
        inStock: true,
      }

      // Act
      const result = mapProductCardDtoToDevice(dto)

      // Assert
      expect(result.labels).toEqual([])
    })

    test('mapProductCardDtoToDevice_WithJapaneseBadgeText_ShouldMapCorrectly', () => {
      // Arrange
      const dto: ProductCardDto = {
        productId: 6,
        productName: 'iPhone 13',
        manufacturer: 'Apple',
        price: 75800,
        imageUrls: ['/images/devices/iphone-13.png'],
        storageOptions: ['128GB'],
        colorOptions: [{ name: 'レッド', hex: '#FF0000' }],
        campaigns: [
          { campaignCode: 'NEW_JA', badgeText: '新着' },
          { campaignCode: 'LOW_STOCK', badgeText: '在庫わずか' },
        ],
        inStock: true,
      }

      // Act
      const result = mapProductCardDtoToDevice(dto)

      // Assert
      // 日本語のバッジテキストも正しくマッピングされる
      expect(result.labels).toEqual(['NEW', '在庫わずか'])
    })

    test('mapProductCardDtoToDevice_WithOptionalFields_ShouldHandleUndefined', () => {
      // Arrange
      const dto: ProductCardDto = {
        productId: 7,
        productName: 'iPhone 12',
        manufacturer: 'Apple',
        price: 65800,
        imageUrls: ['/images/devices/iphone-12.png'],
        storageOptions: ['64GB'],
        colorOptions: [{ name: 'グリーン', hex: '#00FF00' }],
        campaigns: [],
        inStock: false,
        // originalPrice, monthlyPayment, description は未定義
      }

      // Act
      const result = mapProductCardDtoToDevice(dto)

      // Assert
      expect(result.originalPrice).toBeUndefined()
      expect(result.monthlyPayment).toBeUndefined()
      expect(result.description).toBeUndefined()
      expect(result.inStock).toBe(false)
    })
  })

  describe('mapProductCardDtosToDevices', () => {
    test('mapProductCardDtosToDevices_WithEmptyArray_ShouldReturnEmptyArray', () => {
      // Arrange
      const dtos: ProductCardDto[] = []

      // Act
      const result = mapProductCardDtosToDevices(dtos)

      // Assert
      expect(result).toEqual([])
    })

    test('mapProductCardDtosToDevices_WithMultipleDtos_ShouldMapAllDtos', () => {
      // Arrange
      const dtos: ProductCardDto[] = [
        {
          productId: 1,
          productName: 'iPhone 16 Pro Max',
          manufacturer: 'Apple',
          price: 189800,
          imageUrls: ['/images/devices/iphone-16-pro-max.png'],
          storageOptions: ['256GB'],
          colorOptions: [{ name: 'ナチュラルチタニウム', hex: '#C4B8A5' }],
          campaigns: [{ campaignCode: 'NEW', badgeText: 'NEW' }],
          inStock: true,
        },
        {
          productId: 2,
          productName: 'iPhone 16 Pro',
          manufacturer: 'Apple',
          price: 159800,
          imageUrls: ['/images/devices/iphone-16-pro.png'],
          storageOptions: ['128GB'],
          colorOptions: [{ name: 'ブラックチタニウム', hex: '#3C3C3C' }],
          campaigns: [{ campaignCode: 'POPULAR', badgeText: '人気' }],
          inStock: true,
        },
      ]

      // Act
      const result = mapProductCardDtosToDevices(dtos)

      // Assert
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('1')
      expect(result[0].name).toBe('iPhone 16 Pro Max')
      expect(result[1].id).toBe('2')
      expect(result[1].name).toBe('iPhone 16 Pro')
    })

    test('mapProductCardDtosToDevices_ShouldPreserveOrder', () => {
      // Arrange
      const dtos: ProductCardDto[] = [
        {
          productId: 3,
          productName: 'iPhone 16 Plus',
          manufacturer: 'Apple',
          price: 139800,
          imageUrls: [],
          storageOptions: [],
          colorOptions: [],
          campaigns: [],
          inStock: true,
        },
        {
          productId: 1,
          productName: 'iPhone 16 Pro Max',
          manufacturer: 'Apple',
          price: 189800,
          imageUrls: [],
          storageOptions: [],
          colorOptions: [],
          campaigns: [],
          inStock: true,
        },
        {
          productId: 2,
          productName: 'iPhone 16 Pro',
          manufacturer: 'Apple',
          price: 159800,
          imageUrls: [],
          storageOptions: [],
          colorOptions: [],
          campaigns: [],
          inStock: true,
        },
      ]

      // Act
      const result = mapProductCardDtosToDevices(dtos)

      // Assert
      // 元の配列の順序が保持される
      expect(result[0].id).toBe('3')
      expect(result[1].id).toBe('1')
      expect(result[2].id).toBe('2')
    })
  })
})
