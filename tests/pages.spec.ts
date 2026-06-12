import { test, expect } from '@playwright/test';
import { routes } from './routes';

for (const route of routes) {
  test.describe(`page ${route.path}`, () => {
    test('returns 200 and renders expected title', async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status(), `${route.path} response status`).toBe(200);
      await expect(page).toHaveTitle(new RegExp(route.titleIncludes));
    });

    test('sets <html lang> for the locale', async ({ page }) => {
      await page.goto(route.path);
      const lang = await page.locator('html').getAttribute('lang');
      const expected = route.lang === 'zh' ? 'zh-CN' : 'en-NZ';
      expect(lang).toBe(expected);
    });

    test('emits a canonical URL and a description', async ({ page }) => {
      await page.goto(route.path);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical, `${route.path} canonical`).toContain(route.path);
      const desc = await page.locator('meta[name="description"]').getAttribute('content');
      expect(desc?.length ?? 0, `${route.path} description length`).toBeGreaterThan(20);
    });

    test('no horizontal scroll at 380px', async ({ page }) => {
      await page.setViewportSize({ width: 380, height: 720 });
      await page.goto(route.path);
      const { documentWidth, viewportWidth } = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }));
      expect(
        documentWidth,
        `${route.path} document scrollWidth should fit viewport`,
      ).toBeLessThanOrEqual(viewportWidth);
    });
  });
}
