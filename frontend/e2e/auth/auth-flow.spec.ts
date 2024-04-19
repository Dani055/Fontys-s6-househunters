import { test, expect, Page } from '@playwright/test';
import { provideEmail, providePassword } from './repeatedActions';
import { expectToast } from '../repeatedActions';

// Use the same page for all tests here
test.describe.configure({ mode: 'serial' });
let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('register');
});

test.afterAll(async () => {
  await page.close();
});
const email = 'third@mail.com';
test('Invalid email', async () => {
  await provideEmail(page, 'a');

  // Input type=email handles invalid emails, just checking if the page is the same;
  await expect(page).toHaveURL('/register');
});
test('Missing fields', async () => {
  // Email field must be unique
  await provideEmail(page, email);
  await page.getByTestId('terms-checkbox').check();
  await page.locator('button[type="submit"]').click();
  await expectToast(page, "User validation failed: username: Path `username` is required., firstName: Path `firstName` is required., lastName: Path `lastName` is required.");
});
test('Register user', async () => {
    // Email field must be unique
    await provideEmail(page, email);
    // Fill out rest of form
    await page.locator('input#firstName').fill("Third");
    await page.locator('input#lastName').fill("User");
    await page.locator('input#address').fill("third avenue 123");
    await page.locator('input#phone').fill("+123");
    await page.locator('input#username').fill("third_user");
    await providePassword(page, '123');

    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
  });
  test('Login user', async () => {
    await page.goto('login');
    await provideEmail(page, email);
    await providePassword(page, '123');

    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });
  test('Logout', async () => {
    await page.goto('/profile');

    await page.locator('div#profileDropdown').click();
    await page.locator('a#logoutButton').click();
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });