import { test as setup, expect, Page } from '@playwright/test';

setup('Loads index', async ({ page }) => {
  await waitForAppToBeReady(page);

  await expect(page).toHaveTitle('House Hunters');

  await expect(page.getByTestId('logo')).toBeVisible();
});

// Healthcheck that waits for docker compose to start in the pipeline
async function waitForAppToBeReady(page: Page) {
  let retries = 0;
  const maxRetries = 6;
  while (retries < maxRetries) {
    try {
      await page.goto('/');
      break;
    } catch (error) {
      // Wait for a short duration before retrying.
      await page.waitForTimeout(10000);
      retries += 1;
    }
  }
  if (retries >= maxRetries) {
    throw new Error('App did not become ready within the expected time.');
  }
}
