import { BrowserContext, Page, test as base } from "@playwright/test";
import { initializeHelpers, setupMetamask } from "@root/fixtures/metamask";
import { config, createBrowserContext } from "@root/config";
import { MainPage } from "@root/pages";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

export const test = base.extend<
  {
    shared: {
      ensureWalletConnected(): Promise<void>;
    };
  },
  {
    globalContext: BrowserContext;
    metamaskPage: Page;
    metamask: ReturnType<typeof initializeHelpers>;
  }
>({
  globalContext: [
    async ({}, use) => {
      const contextId = nanoid();
      const context = await createBrowserContext(contextId);

      if (config.authCookie) {
        await context.addCookies(JSON.parse(config.authCookie));
      } else {
        const page = await context.newPage();

        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto("https://auth.takeus.io");
        await page.click('button:has-text("Sign in with Google")');
        await page.fill('input[type="email"]', config.googleUser);
        await page.click("#identifierNext");
        await page.fill('input[type="password"]', config.googlePassword);
        await page.click("#passwordNext");
        await page.waitForNavigation({ url: "https://auth.takeus.io" });

        const cookies = await context.cookies();

        fs.writeFileSync(
          config.sharedCookiePath,
          JSON.stringify([
            cookies.find((cookie) => cookie.name === "_oauth2_proxy"),
          ])
        );

        await page.close();
      }

      await use(context);
      await context.close();

      fs.rmSync(path.join(config.statePath, contextId), { recursive: true });
    },
    { scope: "worker" },
  ],
  page: async ({ globalContext }, use) => {
    const page = await globalContext.newPage();
    await use(page);
    await page.close();
  },
  shared: async ({ globalContext, metamask }, use) => {
    const ensureWalletConnected = async () => {
      const page = await globalContext.newPage();
      const mainPage = new MainPage(page, metamask);
      await mainPage.navigate();
      await mainPage.login();
    };

    await use({ ensureWalletConnected });
  },
  metamaskPage: [
    async ({ globalContext }, use) => {
      const page = await setupMetamask(globalContext);
      await use(page);
    },
    { scope: "worker" },
  ],
  metamask: [
    async ({ metamaskPage }, use) => {
      const helpers = initializeHelpers(metamaskPage);
      await use(helpers);
    },
    { scope: "worker" },
  ],
});
