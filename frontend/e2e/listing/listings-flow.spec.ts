import { test, expect, Page } from "@playwright/test";
import { performLoginAction } from "../repeatedActions";
import dayjs from "dayjs";

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

// test.beforeEach(async () => {
//   await page.goto('/content/themes');
// });

test("Loads listings", async () => {
  // Get first listing. If one of them is there, they all are
  const theme = page.locator("div.listing-card").first();

  await expect(theme).toBeVisible();
});
const propertyType = "Listing for e2e CRUD";
const size = "150";
const description = "This listing is used for crud in the e2e tests";
const location = "E2E";
const year = "2000";
const startsOn = dayjs().add(2, "day");
const endsOn = dayjs().add(4, "day");
const startingPrice = "5000";
const buyoutPrice = "10000";

test("Creates listing", async () => {
  await page.goto("/listing/create");

  // Fill out form
  await page.locator("input#propertyType").fill(propertyType);
  await page.locator("input#size").fill(size);
  await page.locator("textarea#listingDescription").fill(description);
  await page.locator("input#location").fill(location);
  await page.locator("input#buildYear").fill(year);
  await page
    .getByTestId("startsOn")
    .locator("input")
    .fill(startsOn.format("MM/DD/YYYY hh:mm A"));
  await page
    .getByTestId("endsOn")
    .locator("input")
    .fill(endsOn.format("MM/DD/YYYY hh:mm A"));
  await page.locator("input#startingPrice").fill(startingPrice);
  await page.locator("input#buyoutPrice").fill(buyoutPrice);

  await page.locator('button[type="submit"]').click();
  await page.waitForURL("/");
  await expect(page).toHaveURL("/");
});

test("Views listing details", async () => {
  // Click created listing
  await page.getByText(propertyType).click();

  // Check if details are on screen
  await expect(
    page
      .locator("div#listing-headline")
      .getByText(`${propertyType} - ${location}`)
  ).toBeVisible();
  await expect(page.locator(`span:has-text("Pending")`)).toBeVisible();
  await expect(
    page.getByText(
      `Bidding starts on ${startsOn.format("DD/MM/YYYY HH:mm").toString()}`
    )
  ).toBeVisible();
  await expect(page.locator('a:has-text("first_user")')).toBeVisible();
  await expect(page.getByText(`Property type : ${propertyType}`)).toBeVisible();
  await expect(page.getByText(`Size : ${size}m²`)).toBeVisible();
  await expect(page.getByText(`Location : ${location}`)).toBeVisible();
  await expect(page.getByText(`Build year : ${year}`)).toBeVisible();
  await expect(page.getByText(description)).toBeVisible();
  await page.getByTestId("listingInfoDropdown").click();
  await expect(
    page.getByText(`Starting price : ${startingPrice}€`)
  ).toBeVisible();
  await expect(page.getByText(`Buyout price : ${buyoutPrice}€`)).toBeVisible();
  await expect(
    page.getByText(
      `Bidding start date : ${startsOn.format("DD/MM/YYYY HH:mm")}`
    )
  ).toBeVisible();
  await expect(
    page.getByText(`Bidding end date : ${endsOn.format("DD/MM/YYYY HH:mm")}`)
  ).toBeVisible();
});

test("Edits listing details", async () => {
  const propertyType = "NEW for e2e CRUD";
  const size = "100";
  const description = "This listing has been edited";
  const location = "EDIT";
  const year = "2022";
  const startsOn = dayjs().add(3, "day");
  const endsOn = dayjs().add(5, "day");
  const startingPrice = "15000";
  const buyoutPrice = "30000";

  // Click edit button
  await page.getByTestId("buttonEditListing").click();
  await page.waitForURL("/listing/edit/**");

  // Fill out form
  await page.locator("input#propertyType").fill(propertyType);
  await page.locator("input#size").fill(size);
  await page.locator("textarea#listingDescription").fill(description);
  await page.locator("input#location").fill(location);
  await page.locator("input#buildYear").fill(year);
  await page
    .getByTestId("startsOn")
    .locator("input")
    .fill(startsOn.format("MM/DD/YYYY hh:mm A"));
  await page
    .getByTestId("endsOn")
    .locator("input")
    .fill(endsOn.format("MM/DD/YYYY hh:mm A"));
  await page.locator("input#startingPrice").fill(startingPrice);
  await page.locator("input#buyoutPrice").fill(buyoutPrice);

  await page.locator('button[type="submit"]').click();

  // Check if details are on screen
  await page.getByText(propertyType).click();
  await expect(
    page
      .locator("div#listing-headline")
      .getByText(`${propertyType} - ${location}`)
  ).toBeVisible();
  await expect(page.locator(`span:has-text("Pending")`)).toBeVisible();
  await expect(
    page.getByText(
      `Bidding starts on ${startsOn.format("DD/MM/YYYY HH:mm").toString()}`
    )
  ).toBeVisible();
  await expect(page.locator('a:has-text("first_user")')).toBeVisible();
  await expect(page.getByText(`Property type : ${propertyType}`)).toBeVisible();
  await expect(page.getByText(`Size : ${size}m²`)).toBeVisible();
  await expect(page.getByText(`Location : ${location}`)).toBeVisible();
  await expect(page.getByText(`Build year : ${year}`)).toBeVisible();
  await expect(page.getByText(description)).toBeVisible();
  await page.getByTestId("listingInfoDropdown").click();
  await expect(
    page.getByText(`Starting price : ${startingPrice}€`)
  ).toBeVisible();
  await expect(page.getByText(`Buyout price : ${buyoutPrice}€`)).toBeVisible();
  await expect(
    page.getByText(
      `Bidding start date : ${startsOn.format("DD/MM/YYYY HH:mm")}`
    )
  ).toBeVisible();
  await expect(
    page.getByText(`Bidding end date : ${endsOn.format("DD/MM/YYYY HH:mm")}`)
  ).toBeVisible();
});

test("Deletes listing", async () => {
  // Click delete button
  await page.getByTestId("buttonDeleteListing").click();
  await page.locator('button[type="Submit"]:has-text("Delete")').click();
  await page.waitForURL("/");

  // Listing should not be visible anymore
  await expect(page.getByText(propertyType)).toBeHidden();
});
