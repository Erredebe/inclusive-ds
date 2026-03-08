import { expect, test } from '@playwright/test';

test('storybook loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Storybook/i);
});
