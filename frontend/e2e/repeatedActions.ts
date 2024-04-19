import { expect, Page } from '@playwright/test';
import { provideEmail, providePassword } from './auth/repeatedActions';

export async function expectToast(page: Page, message: string) {
    const errorToast = page.locator(`div.Toastify__toast-body`);
    await expect(errorToast).toBeVisible();
    await expect(page.getByText(message)).toBeVisible()
}
export async function performLoginAction(
    page: Page,
    email: string,
    password: string,
  ) {
    await page.goto('login');
    await provideEmail(page, email);
    await providePassword(page, password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/');
  }