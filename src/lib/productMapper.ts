/**
 * @fileoverview 製品データマッピング関数
 * @module lib/productMapper
 *
 * バックエンドAPIのDTO（ProductCardDto）をフロントエンドのDevice型に変換する。
 * API仕様変更時はこのファイルのみ修正すればUI側の型は守られる。
 */

import type { ProductCardDto } from '@/types/category'
import type { Device, DeviceLabel, ColorOption } from '@/types/device'

/**
 * キャンペーンバッジテキストをDeviceLabelに変換
 *
 * バックエンドのcampaigns配列からbadgeTextを抽出し、
 * フロントエンドのDeviceLabel型に変換する。
 * 未知のラベルは除外される。
 *
 * @param badgeText - キャンペーンバッジテキスト
 * @returns DeviceLabel型の値、または未知の場合はnull
 */
function mapBadgeToLabel(badgeText: string): DeviceLabel | null {
  const labelMap: Record<string, DeviceLabel> = {
    NEW: 'NEW',
    新着: 'NEW',
    人気: '人気',
    おすすめ: 'おすすめ',
    在庫わずか: '在庫わずか',
  }
  return labelMap[badgeText] ?? null
}

/**
 * ProductCardDtoをDevice型に変換
 *
 * バックエンドAPIから返されるProductCardDtoを
 * フロントエンドのDevice型に変換する。
 *
 * 変換ルール:
 * - productId (number) → id (string): toString()で変換
 * - productName → name: 直接マッピング
 * - imageUrls (array) → imageUrl (single): 最初の画像を使用
 * - campaigns (array) → labels (array): badgeTextをDeviceLabelに変換
 * - colorOptions: 直接マッピング（型が同じ）
 *
 * @param dto - バックエンドAPIから返されるProductCardDto
 * @returns フロントエンドのDevice型
 */
export function mapProductCardDtoToDevice(dto: ProductCardDto): Device {
  // キャンペーンバッジをラベルに変換
  const labels: DeviceLabel[] = (dto.campaigns ?? [])
    .map(campaign => mapBadgeToLabel(campaign.badgeText))
    .filter((label): label is DeviceLabel => label !== null)

  // カラーオプションの変換（型が同じなので直接マッピング）
  const colorOptions: ColorOption[] = dto.colorOptions.map(color => ({
    name: color.name,
    hex: color.hex,
  }))

  return {
    id: dto.productId.toString(),
    name: dto.productName,
    manufacturer: dto.manufacturer,
    imageUrl: dto.imageUrls[0] ?? '/images/devices/placeholder.png',
    price: dto.price,
    originalPrice: dto.originalPrice,
    labels,
    description: dto.description,
    inStock: dto.inStock,
    // 詳細ページURLはproductIdから生成
    detailUrl: `/devices/${dto.productId}`,
    storageOptions: dto.storageOptions,
    colorOptions,
    monthlyPayment: dto.monthlyPayment,
  }
}

/**
 * ProductCardDto配列をDevice配列に変換
 *
 * @param dtos - ProductCardDtoの配列
 * @returns Device型の配列
 */
export function mapProductCardDtosToDevices(dtos: ProductCardDto[]): Device[] {
  return dtos.map(mapProductCardDtoToDevice)
}
