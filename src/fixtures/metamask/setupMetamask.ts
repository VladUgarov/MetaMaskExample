import { BrowserContext, Page } from "@playwright/test";
import { initializeHelpers } from "./helpers";

const waitForBackgroundPage = async (
  browserContext: BrowserContext
): Promise<Page> => {
  const backgroundPages = browserContext.backgroundPages();
  if (backgroundPages.length > 0) {
    return backgroundPages[0];
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return waitForBackgroundPage(browserContext);
};

const getHomeScreen = ((): ((browser: BrowserContext) => Promise<Page>) => {
  let page: Page;

  return async (browser) => {
    return new Promise((resolve, reject) => {
      for (const existingPage of browser.pages()) {
        if (existingPage.url().match("chrome-extension://[a-z]+/home.html")) {
          page = existingPage;
          resolve(page);

          return;
        }
      }

      if (page) {
        resolve(page);
        return;
      }

      browser.on("page", async (target) => {
        if (target.url().match("chrome-extension://[a-z]+/home.html")) {
          try {
            page = target;
            resolve(target);
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  };
})();

export const setupMetamask = async (browserContext: BrowserContext) => {
  const bgPage = await waitForBackgroundPage(browserContext);
  const regex = /chrome-extension:\/\/(?<id>[a-z]+)\/background.html/;

  const extensionId = bgPage.url().match(regex)?.groups?.id;
  if (!extensionId) {
    throw new Error("Metamask is not installed");
  }

  const page = await getHomeScreen(browserContext);

  const metamask = initializeHelpers(page);
  await page.waitForLoadState("networkidle");

  if (!(await metamask.unlock())) {
    await metamask.importWallet();
  }

  return page;
};
