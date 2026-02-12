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
import { contractHandlers } from './contractHandlers'
import { dataUsageHandlers } from './dataUsageHandlers'
import { billingHandlers } from './billingHandlers'

export const handlers = [
  ...productHandlers,
  ...marketingHandlers,
  ...authHandlers,
  ...accountHandlers,
  ...contractHandlers,
  ...dataUsageHandlers,
  ...billingHandlers,
]
