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
import { billingHandlers } from './billingHandlers'
import { dataUsageHandlers } from './dataUsageHandlers'
import { planHandlers } from './planHandlers'
import { optionHandlers } from './optionHandlers'
import { notificationHandlers } from './notificationHandlers'

export const handlers = [
  ...productHandlers,
  ...marketingHandlers,
  ...authHandlers,
  ...accountHandlers,
  ...contractHandlers,
  ...billingHandlers,
  ...dataUsageHandlers,
  ...planHandlers,
  ...optionHandlers,
  ...notificationHandlers,
]
