/**
 * @fileoverview MSWハンドラーのエクスポート
 * @module mocks/handlers
 *
 * すべてのMSWハンドラーを一括でエクスポート。
 */

import { productHandlers } from './productHandlers'
import { marketingHandlers } from './marketingHandlers'
import { authHandlers } from './authHandlers'
import { accountHandlers } from './accountHandlers'

export const handlers = [
  ...productHandlers,
  ...marketingHandlers,
  ...authHandlers,
  ...accountHandlers,
]
