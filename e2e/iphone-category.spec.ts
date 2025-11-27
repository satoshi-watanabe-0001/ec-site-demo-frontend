/**
 * @fileoverview iPhoneカテゴリページのE2Eテスト
 * @module e2e/iphone-category.spec
 *
 * PBI-DP-002: iPhoneカテゴリページ閲覧機能 (EC-269)
 *
 * organization-standards準拠:
 * - Page Object Modelパターン
 * - 明示的待機（sleepではなく要素の出現を待つ）
 * - テストの独立性
 * - 失敗時のスクリーンショット（Playwright設定で自動）
 */

import { test, expect, type Page } from '@playwright/test'

/**
 * iPhoneカテゴリページのPage Object
 * UIの変更に強い構造を提供
 */
class IPhoneCategoryPage {
  constructor(private page: Page) {}

  /** ページに移動 */
  async goto() {
    await this.page.goto('/products/iphone')
  }

  /** ページタイトルを取得 */
  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  /** キャンペーンバナーのタイトルを取得 */
  async getCampaignBannerTitle() {
    return this.page.locator('h2:has-text("iPhone特別キャンペーン")').textContent()
  }

  /** キャンペーンバナーが表示されているか */
  async isCampaignBannerVisible() {
    return this.page.locator('text=iPhone特別キャンペーン実施中！').isVisible()
  }

  /** 製品数を取得 */
  async getProductCount() {
    const text = await this.page.locator('text=/\\d+件の製品が見つかりました/').textContent()
    const match = text?.match(/(\d+)件/)
    return match ? parseInt(match[1], 10) : 0
  }

  /** 製品カードの数を取得 */
  async getProductCardCount() {
    return this.page.locator('article').count()
  }

  /** ソートオプションを選択 */
  async selectSortOption(value: 'name' | 'price') {
    await this.page.selectOption('#sort', value)
  }

  /** 最初の製品名を取得 */
  async getFirstProductName() {
    return this.page.locator('article h3').first().textContent()
  }

  /** ドコモオンラインショップリンクが存在するか */
  async hasDocomoShopLink() {
    return this.page.locator('a:has-text("ドコモオンラインショップで購入")').first().isVisible()
  }

  /** ドコモオンラインショップリンクの数を取得 */
  async getDocomoShopLinkCount() {
    return this.page.locator('a:has-text("ドコモオンラインショップで購入")').count()
  }

  /** 特定の製品名が表示されているか */
  async isProductVisible(productName: string) {
    return this.page.locator(`text=${productName}`).isVisible()
  }

  /** ストレージオプションが表示されているか */
  async hasStorageOptions() {
    return this.page.locator('text=容量:').first().isVisible()
  }

  /** カラーオプションが表示されているか */
  async hasColorOptions() {
    return this.page.locator('text=カラー:').first().isVisible()
  }

  /** 月額料金が表示されているか */
  async hasMonthlyPayment() {
    return this.page.locator('text=/月々.*円〜/').first().isVisible()
  }
}

/**
 * 製品カテゴリページのPage Object
 */
class ProductCategoryPage {
  constructor(private page: Page) {}

  /** ページに移動 */
  async goto() {
    await this.page.goto('/products')
  }

  /** iPhoneカテゴリカードをクリック */
  async clickIPhoneCategory() {
    await this.page.locator('a[href="/products/iphone"]').click()
  }

  /** iPhoneカテゴリカードが表示されているか */
  async isIPhoneCategoryVisible() {
    return this.page.locator('text=iPhone').first().isVisible()
  }
}

test.describe('iPhoneカテゴリページ (EC-269)', () => {
  let iPhonePage: IPhoneCategoryPage

  test.beforeEach(async ({ page }) => {
    iPhonePage = new IPhoneCategoryPage(page)
  })

  test.describe('ページ表示', () => {
    test('iPhoneカテゴリページにアクセスするとページタイトルが表示される', async () => {
      // Arrange & Act
      await iPhonePage.goto()

      // Assert
      const title = await iPhonePage.getPageTitle()
      expect(title).toBe('iPhone')
    })

    test('キャンペーンバナーが表示される', async () => {
      // Arrange & Act
      await iPhonePage.goto()

      // Assert
      const isVisible = await iPhonePage.isCampaignBannerVisible()
      expect(isVisible).toBe(true)
    })

    test('5件のiPhone製品が表示される', async () => {
      // Arrange & Act
      await iPhonePage.goto()

      // Assert
      const count = await iPhonePage.getProductCount()
      expect(count).toBe(5)
    })

    test('製品カードが5件表示される', async () => {
      // Arrange & Act
      await iPhonePage.goto()

      // Assert
      const cardCount = await iPhonePage.getProductCardCount()
      expect(cardCount).toBe(5)
    })

    test('ドコモオンラインショップリンクが表示される', async () => {
      // Arrange & Act
      await iPhonePage.goto()

      // Assert
      const hasLink = await iPhonePage.hasDocomoShopLink()
      expect(hasLink).toBe(true)
    })
  })

  test.describe('製品情報表示', () => {
    test('iPhone 16 Pro Maxが表示される', async () => {
      // Arrange & Act
      await iPhonePage.goto()

      // Assert
      const isVisible = await iPhonePage.isProductVisible('iPhone 16 Pro Max')
      expect(isVisible).toBe(true)
    })

    test('ストレージオプションが表示される', async () => {
      // Arrange & Act
      await iPhonePage.goto()

      // Assert
      const hasStorage = await iPhonePage.hasStorageOptions()
      expect(hasStorage).toBe(true)
    })

    test('カラーオプションが表示される', async () => {
      // Arrange & Act
      await iPhonePage.goto()

      // Assert
      const hasColors = await iPhonePage.hasColorOptions()
      expect(hasColors).toBe(true)
    })

    test('月額料金が表示される', async () => {
      // Arrange & Act
      await iPhonePage.goto()

      // Assert
      const hasMonthly = await iPhonePage.hasMonthlyPayment()
      expect(hasMonthly).toBe(true)
    })
  })

  test.describe('ソート機能', () => {
    test('価格順でソートすると最高価格の製品が最初に表示される', async () => {
      // Arrange
      await iPhonePage.goto()

      // Act
      await iPhonePage.selectSortOption('price')

      // Assert
      const firstName = await iPhonePage.getFirstProductName()
      expect(firstName).toBe('iPhone 16 Pro Max')
    })

    test('名前順でソートするとアルファベット順に表示される', async () => {
      // Arrange
      await iPhonePage.goto()

      // Act
      await iPhonePage.selectSortOption('name')

      // Assert
      const firstName = await iPhonePage.getFirstProductName()
      expect(firstName).toBe('iPhone 15')
    })
  })
})

test.describe('製品ページからiPhoneページへの遷移 (EC-269)', () => {
  test('製品カテゴリページからiPhoneカテゴリページに遷移できる', async ({ page }) => {
    // Arrange
    const productPage = new ProductCategoryPage(page)
    const iPhonePage = new IPhoneCategoryPage(page)

    // Act
    await productPage.goto()
    await productPage.clickIPhoneCategory()

    // Assert
    await page.waitForURL('/products/iphone')
    const title = await iPhonePage.getPageTitle()
    expect(title).toBe('iPhone')
  })
})
