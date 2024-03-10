import { test, expect, Page } from "@playwright/test";
import { expectToast, performLoginAction } from "../repeatedActions";

// Use the same page for all tests here
test.describe.configure({ mode: "serial" });
let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await performLoginAction(page, "first@mail.com", "123");
});

test.afterAll(async () => {
  await page.close();
});

test.beforeEach(async () => {
  await page.goto('/listing/details/211111111111111111111111');
});

test("Creates comment", async () => {
   await page.locator("input#commentText").fill("test comment");
   await page.getByTestId("buttonPostComment").click();
   await expectToast(page, "Comment created");
});

test("Loads comments", async () => {
    // Reload page to get latest info
    await page.reload();
    await expect(page.getByText("test comment")).toBeVisible();
});

test("Deletes comment", async () => {
  // Click delete button
  await page.getByTestId("buttonDeleteComment").click();
  await page.locator('button[type="Submit"]:has-text("Delete")').click();
  // Comment should disappear
  await expect(page.getByText("test comment")).toBeHidden();
  // Check after reload too
  await page.reload();
  await expect(page.getByText("test comment")).toBeHidden();
});
