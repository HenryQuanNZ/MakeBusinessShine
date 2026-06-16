import { test, expect } from '@playwright/test';

const enNav = [
  { name: 'Home',     href: '/' },
  { name: 'Packages', href: '/packages/' },
  { name: 'Work',     href: '/work/' },
  { name: 'About',    href: '/about/' },
  { name: 'Contact',  href: '/contact/' },
];

const zhNav = [
  { name: '首页', href: '/zh/' },
  { name: '套餐', href: '/zh/packages/' },
  { name: '案例', href: '/zh/work/' },
  { name: '关于', href: '/zh/about/' },
  { name: '联系', href: '/zh/contact/' },
];

for (const link of enNav) {
  test(`EN nav: clicking "${link.name}" from home goes to ${link.href}`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: link.name, exact: true }).first().click();
    await expect(page).toHaveURL(new RegExp(`${link.href.replace(/\//g, '\\/')}$`));
  });
}

for (const link of zhNav) {
  test(`ZH nav: clicking "${link.name}" from /zh/ goes to ${link.href}`, async ({ page }) => {
    await page.goto('/zh/');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: link.name, exact: true }).first().click();
    await expect(page).toHaveURL(new RegExp(`${link.href.replace(/\//g, '\\/')}$`));
  });
}

