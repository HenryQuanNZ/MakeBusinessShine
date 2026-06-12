import { test, expect } from '@playwright/test';
import { routes } from './routes';

const enRoutes = routes.filter((r) => r.lang === 'en');
const zhRoutes = routes.filter((r) => r.lang === 'zh');

for (const route of enRoutes) {
  test(`EN → ZH toggle preserves the current page (${route.path})`, async ({ page }) => {
    await page.goto(route.path);
    const target = route.path === '/' ? '/zh/' : `/zh${route.path}`;
    await page.getByLabel('Switch language to Chinese').click();
    await expect(page).toHaveURL(new RegExp(`${target.replace(/\//g, '\\/')}$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  });
}

for (const route of zhRoutes) {
  test(`ZH → EN toggle preserves the current page (${route.path})`, async ({ page }) => {
    await page.goto(route.path);
    const target = route.path === '/zh/' ? '/' : route.path.replace(/^\/zh/, '');
    await page.getByLabel('切换到英文').click();
    await expect(page).toHaveURL(new RegExp(`${target.replace(/\//g, '\\/')}$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-NZ');
  });
}
