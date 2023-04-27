import "module-alias/register";

import { PlaywrightTestConfig } from "@playwright/test";
import { config as testsConfig } from "@root/config";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const config: PlaywrightTestConfig = {
  retries: process.env.CI === "true" ? 2 : 1,
  testDir: "src/tests",
  use: {
    headless: false,
    trace: {
      mode: "retain-on-failure",
      screenshots: true,
    },
    browserName: "chromium",
    viewport: { width: 1440, height: 800 },
    locale: "en-US",
    launchOptions: {
      headless: false,
      args: [
        `--disable-extensions-except=${testsConfig.metamaskPath}`,
        `--load-extension=${testsConfig.metamaskPath}`,
      ],
    },
  },

  projects: [
    {
      name: "Smoke",
      testMatch: /.*smoke.spec.ts/,
      retries: 0,
    },
  ],

  globalSetup: require.resolve(
    path.join(__dirname, "./src/config/globalSetup")
  ),
};

export default config;
