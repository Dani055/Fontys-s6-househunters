import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 40 * 1000,
  retries: process.env.CI ? 1 : 0,
  workers: 3,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 7000,
  },

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'list',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    video: 'off',
    baseURL: 'http://localhost:3000',
    trace: process.env.CI ? 'on-first-retry' : 'on',
  },

  /* Configure test suite order and dependiencies */
  projects: [
    {
      name: 'setup',
      testDir: './e2e',
      testMatch: /global.setup\.ts/,
    },
    {
      name: 'Auth tests',
      testDir: './e2e/auth',
      testMatch: '*.spec.ts',
      dependencies: ['setup'],
    },
    {
      name: 'Listing tests',
      testDir: './e2e/listing',
      testMatch: '*.spec.ts',
      dependencies: ['setup'],
    },
    {
      name: 'Comment tests',
      testDir: './e2e/comment',
      testMatch: '*.spec.ts',
      dependencies: ['setup'],
    },
    {
      name: 'Bid tests',
      testDir: './e2e/bid',
      testMatch: '*.spec.ts',
      dependencies: ['setup'],
    },
  ],
});
