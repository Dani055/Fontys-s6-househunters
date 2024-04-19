import { Page } from '@playwright/test';

export async function provideEmail(page: Page, email: string) {
  // wait for form to load
  await page.locator('input#email').fill(email);
}

export async function providePassword(page: Page, password: string) {
  await page.locator('input#password').fill(password);
}
