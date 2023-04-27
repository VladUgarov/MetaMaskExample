import { chromium } from "@playwright/test";
import path from "path";
import { config } from ".";

const { metamaskPath } = config;

const isCI = process.env.CI === "true";

const ciOptions = {
  args: [
    "--ignore-certificate-errors",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-accelerated-2d-canvas",
    "--disable-gpu",
  ],
};

export const createBrowserContext = async (id = "default") => {
  return chromium.launchPersistentContext(path.join(config.statePath, id), {
    headless: false,
    ...(isCI && ciOptions),
    args: [
      ...(isCI ? ciOptions.args : []),
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      "--lang=en-US",
    ],
  });
};
