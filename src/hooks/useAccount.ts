/**
 * @fileoverview アカウント関連カスタムフック
 * @module hooks/useAccount
 *
 * TanStack Queryを使用してアカウント関連データを取得するカスタムフック群。
 */

import { useQuery } from '@tanstack/react-query'
import {
  getAccountInfo,
  getDataUsage,
  getBilling,
  getDeviceInfo,
  getNotifications,
  getOptions,
} from '@/services/accountService'
import type {
  AccountInfoResponse,
  DataUsageResponse,
  BillingResponse,
  DeviceInfoResponse,
  NotificationsResponse,
  OptionsResponse,
} from '@/types'

/**
 * アカウント情報を取得するカスタムフック
 *
 * @param enabled - 自動取得の有効/無効（デフォルト: true）
 * @returns TanStack Queryの結果オブジェクト
 */
export function useAccountInfo(enabled = true) {
  return useQuery<AccountInfoResponse, Error>({
    queryKey: ['account', 'info'],
    queryFn: getAccountInfo,
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  })
}

/**
 * データ通信量を取得するカスタムフック
 *
 * @param enabled - 自動取得の有効/無効（デフォルト: true）
 * @returns TanStack Queryの結果オブジェクト
 */
export function useDataUsage(enabled = true) {
  return useQuery<DataUsageResponse, Error>({
    queryKey: ['account', 'data-usage'],
    queryFn: getDataUsage,
    enabled,
    staleTime: 3 * 60 * 1000, // 3分間キャッシュ
  })
}

/**
 * 請求情報を取得するカスタムフック
 *
 * @param enabled - 自動取得の有効/無効（デフォルト: true）
 * @returns TanStack Queryの結果オブジェクト
 */
export function useBilling(enabled = true) {
  return useQuery<BillingResponse, Error>({
    queryKey: ['account', 'billing'],
    queryFn: getBilling,
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  })
}

/**
 * 端末情報を取得するカスタムフック
 *
 * @param enabled - 自動取得の有効/無効（デフォルト: true）
 * @returns TanStack Queryの結果オブジェクト
 */
export function useDeviceInfo(enabled = true) {
  return useQuery<DeviceInfoResponse, Error>({
    queryKey: ['account', 'device'],
    queryFn: getDeviceInfo,
    enabled,
    staleTime: 10 * 60 * 1000, // 10分間キャッシュ
  })
}

/**
 * 通知一覧を取得するカスタムフック
 *
 * @param enabled - 自動取得の有効/無効（デフォルト: true）
 * @returns TanStack Queryの結果オブジェクト
 */
export function useNotifications(enabled = true) {
  return useQuery<NotificationsResponse, Error>({
    queryKey: ['account', 'notifications'],
    queryFn: getNotifications,
    enabled,
    staleTime: 1 * 60 * 1000, // 1分間キャッシュ
  })
}

/**
 * オプションサービス一覧を取得するカスタムフック
 *
 * @param enabled - 自動取得の有効/無効（デフォルト: true）
 * @returns TanStack Queryの結果オブジェクト
 */
export function useOptions(enabled = true) {
  return useQuery<OptionsResponse, Error>({
    queryKey: ['account', 'options'],
    queryFn: getOptions,
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  })
}
