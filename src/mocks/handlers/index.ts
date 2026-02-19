/**
 * @fileoverview MSWハンドラーのエクスポート
 * @module mocks/handlers
 *
 * すべてのMSWハンドラーを一括でエクスポート。
 */

import { productHandlers } from './productHandlers'
import { marketingHandlers } from './marketingHandlers'
import { authHandlers } from './authHandlers'
import { contractHandlers } from './contractHandlers'
import { accountHandlers } from './accountHandlers'
import { planHandlers } from './planHandlers'

export const handlers = [
  ...productHandlers,
  ...marketingHandlers,
  ...authHandlers,
  ...contractHandlers,
  ...accountHandlers,
  ...planHandlers,
]
