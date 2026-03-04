# EC-Site Mypage E2E Testing

This skill covers how to test the authenticated mypage/account management features of the EC-Site frontend.

## Prerequisites

### Dev Server
- Run `pnpm dev` from the repo root to start Next.js dev server on `localhost:3000`
- Uses Turbopack for fast compilation
- Server is ready when you see "Ready in Xms" in the console

### MSW (Mock Service Worker) Initialization
- **CRITICAL**: The `enableMocking()` function in `src/lib/msw.ts` may not be called automatically from the app entrypoint
- To enable MSW for testing, you may need to create a temporary client-side provider:
  1. Create `src/components/providers/MSWProvider.tsx` with `'use client'` directive
  2. Import and call `enableMocking()` from `@/lib/msw` in a `useEffect`
  3. Wrap the app content in `src/app/layout.tsx` with the provider
  4. **IMPORTANT**: Revert these changes after testing (`git restore`) - do NOT commit them
- Without MSW initialization, all API calls under `/api/v1/account/*` will fail
- MSW handlers are defined in `src/mocks/handlers/accountHandlers.ts` and `authHandlers.ts`

## Test Credentials
- Email: `test@docomo.ne.jp`
- Password: `password123`
- These are hardcoded in `src/mocks/handlers/authHandlers.ts`

## Test Flow

### 1. Login
- Navigate to `http://localhost:3000/login`
- Enter email and password in the form fields
- Click "ログイン" button
- Expected: Redirect to `/mypage` dashboard

### 2. Dashboard Verification (`/mypage`)
Verify these 5 sections are displayed with mock data:
- **契約情報サマリー**: Plan name (ahamo), monthly fee (¥2,970), data capacity (20GB)
- **データ使用状況**: Used/remaining data with progress bar
- **請求予定額**: Basic fee, call charges, total amount, previous month comparison
- **契約端末情報**: Device name (iPhone 16 Pro Max), purchase date, payment status
- **通知・お知らせ**: Notification list with unread count badge

### 3. Subpage Navigation
The sidebar has 7 navigation items. Click each to verify:
- **ダッシュボード** (`/mypage`) - Main dashboard
- **契約情報** (`/mypage/contract`) - Contract holder info and contract details
- **データ使用量** (`/mypage/data-usage`) - Daily usage graph, monthly trends, charge history
- **請求・支払い** (`/mypage/billing`) - Current charges, billing history table, payment method
- **プラン変更** (`/mypage/plan`) - Current plan display, ahamo/ahamo大盛り options
- **オプション管理** (`/mypage/options`) - Subscribed options, available options with add/cancel
- **設定** (`/mypage/settings`) - Contact info form, password change, notification toggles

### 4. Logout
- Click "ログアウト" in sidebar
- Expected: Redirect to `/login` page
- Header should show "新規登録" and "ログイン" buttons instead of "マイページ"

## Authentication Guard
- All `/mypage/*` routes are protected by `useAuthStore` check in `src/app/mypage/layout.tsx`
- If not authenticated, redirects to `/login`
- After login, auth store persists `user` and `isAuthenticated` to localStorage (but NOT `accessToken` - security measure)

## Common Issues
- If pages show loading skeletons indefinitely, MSW is likely not initialized
- If login fails, check browser console for MSW registration messages
- The sidebar active state highlights the current page in blue/orange
- Plan IDs: `ahamo` and `ahamo-large` (not `ahamo-oomori`)

## Devin Secrets Needed
No secrets required - all test data is mocked via MSW with hardcoded credentials.
