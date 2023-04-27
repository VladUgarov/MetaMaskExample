/* eslint-disable playwright/no-page-pause */
import { createBrowserContext } from "@root/config";

(async () => {
  const context = await createBrowserContext();

  await context.route("**/*", (route) => route.continue());

  const page = await context.newPage();

  await page.pause();
})();
