import { expect } from "@playwright/test";
import { test } from "@root/fixtures";
import { MainPage } from "@root/pages";

test.describe("Authorization", () => {
  test("should login", async ({ page, metamask }) => {
    const mainPage = new MainPage(page, metamask);

    await mainPage.navigate();
    await mainPage.login();

    await expect(mainPage.elements.connectWalletButton).not.toBeVisible();
  });

  test("should logout", async ({ page, metamask }) => {
    const mainPage = new MainPage(page, metamask);

    await mainPage.navigate();
    await mainPage.logout();

    await expect(mainPage.elements.connectWalletButton).toBeVisible();
  });
});
