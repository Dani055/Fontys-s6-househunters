import { test, expect, Page } from "@playwright/test";
import { expectToast, performLoginAction } from "../repeatedActions";

// Use the same page for all tests here
test.describe.configure({ mode: "serial" });
let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await performLoginAction(page, "second@mail.com", "123");
});

test.afterAll(async () => {
  await page.close();
});

test.beforeEach(async () => {
  await page.goto('/listing/details/211111111111111111111111');
});

test("Bid too low", async () => {
    // Fill in
   await page.locator("input#bidAmount").fill("200");
   await page.getByTestId("buttonPostBid").click();
   await page.locator('button[type="Submit"]:has-text("Confirm")').click();

   // Expect error
   await expectToast(page, "Bid is not above the minimum amount");
});

test("Creates  2 bids", async () => {
    // Fill in
    await page.locator("input#bidAmount").fill("2100");
    await page.getByTestId("buttonPostBid").click();
    await page.locator('button[type="Submit"]:has-text("Confirm")').click();
    await expectToast(page, "Bid created");

    await page.locator("input#bidAmount").fill("2200");
    await page.getByTestId("buttonPostBid").click();
    await page.locator('button[type="Submit"]:has-text("Confirm")').click();

    // Check if bids are appended locally
    await expect(page.locator('p:has-text("Leading bid: second_user")')).toBeVisible();
    await expect(page.locator('h3#leadingBidH3:has-text("2200€")')).toBeVisible();
    await expect(page.getByText('Bid history (2)')).toBeVisible();
    await expect(page.locator('p:has-text(" second_user bid 2100€")')).toBeVisible();
 });
 test("Loads bids", async () => {
    // Reload page to get latest info
    await page.reload();
    await expect(page.locator('p:has-text("Leading bid: second_user")')).toBeVisible();
    await expect(page.locator('h3#leadingBidH3:has-text("2200€")')).toBeVisible();
    await expect(page.getByText('Bid history (2)')).toBeVisible();
    await expect(page.locator('p:has-text(" second_user bid 2100€")')).toBeVisible();
});

test("Bid lower than leading bid", async () => {
    // Fill in
    await page.locator("input#bidAmount").fill("2000");
    await page.getByTestId("buttonPostBid").click();
    await page.locator('button[type="Submit"]:has-text("Confirm")').click();
    
    // Expect error
    await expectToast(page, "Bid is less than the current highest bid");
 });
 
