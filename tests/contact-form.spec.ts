import { test, expect, type Request } from '@playwright/test';

const FORMSPREE_URL = 'https://formspree.io/f/mojzklan';

async function stubFormspree(page: import('@playwright/test').Page) {
  await page.route(FORMSPREE_URL, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, next: '/thanks' }),
    }),
  );
}

test('EN contact form: fields render, submit POSTs the expected payload', async ({ page }) => {
  await stubFormspree(page);
  await page.goto('/contact/');

  await expect(page.locator('form')).toHaveAttribute('action', FORMSPREE_URL);

  await page.fill('#name', 'QA Bot');
  await page.fill('#business', 'Aro Valley Plumbing');
  await page.fill('#email', 'bot@example.com');
  await page.selectOption('#budget', 'standard');
  await page.fill('#message', 'CI submission — please ignore.');

  const [request] = await Promise.all([
    page.waitForRequest((req: Request) => req.url() === FORMSPREE_URL && req.method() === 'POST'),
    page.getByRole('button', { name: 'Send' }).click(),
  ]);

  const body = request.postData() ?? '';
  expect(body).toContain('name=QA+Bot');
  expect(body).toContain('business=Aro+Valley+Plumbing');
  expect(body).toContain('email=bot%40example.com');
  expect(body).toContain('budget=standard');
});

test('ZH contact form: fields render, submit POSTs the expected payload', async ({ page }) => {
  await stubFormspree(page);
  await page.goto('/zh/contact/');

  await expect(page.locator('form')).toHaveAttribute('action', FORMSPREE_URL);

  await page.fill('#name', '测试');
  await page.fill('#business', '惠灵顿小店');
  await page.fill('#email', 'bot@example.com');
  await page.selectOption('#budget', 'bilingual');
  await page.fill('#message', '自动化测试提交。');

  const [request] = await Promise.all([
    page.waitForRequest((req: Request) => req.url() === FORMSPREE_URL && req.method() === 'POST'),
    page.getByRole('button', { name: '发送' }).click(),
  ]);

  const body = request.postData() ?? '';
  expect(body).toContain('budget=bilingual');
  expect(body).toContain('email=bot%40example.com');
});

test('honeypot field is present and hidden', async ({ page }) => {
  await page.goto('/contact/');
  const honeypot = page.locator('input[name="_gotcha"]');
  await expect(honeypot).toHaveCount(1);
  await expect(honeypot).toBeHidden();
});
