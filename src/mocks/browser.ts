/**
 * @fileoverview MSWブラウザワーカー設定
 * @module mocks/browser
 *
 * 開発環境でAPIリクエストをインターセプトするためのMSWワーカー設定。
 */

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
