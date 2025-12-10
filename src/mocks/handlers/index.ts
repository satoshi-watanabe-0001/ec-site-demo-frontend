/**
 * @fileoverview MSWハンドラーのエクスポート
 * @module mocks/handlers
 *
 * すべてのMSWハンドラーを一括でエクスポート。
 */

import { productHandlers } from './productHandlers'
import { marketingHandlers } from './marketingHandlers'
import { authHandlers } from './authHandlers'

export const handlers = [...productHandlers, ...marketingHandlers, ...authHandlers]
