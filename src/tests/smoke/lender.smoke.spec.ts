import { expect } from "@playwright/test";
import { inputConfig } from "@root/config/inputConfig";
import { test } from "@root/fixtures";
import { MainPage } from "@root/pages";
import { AssetPage } from "@root/pages/AssetPage";

const chainId = 42;

test.describe("Lender Flow", () => {
  test.beforeAll(async ({ shared, metamask }) => {
    await shared.ensureWalletConnected();
    await metamask.chooseNetwork(chainId);
  });

  // Setting a timeout for 2 minutes for awaiting the following actions
  // * Blockchain confirmation
  // * Syncing blockchain state with backend
  test.setTimeout(120_000);

  test("should navigate to listing page", async ({ page, metamask }) => {
    const { nftAddress, tokenId } = inputConfig[chainId];
    const mainPage = new MainPage(page, metamask);

    await mainPage.navigate();
    await mainPage.navigateToListPage(nftAddress, tokenId);

    await page.waitForURL(`**/asset/${nftAddress}/${tokenId}`);
  });

  test("should list", async ({ page, metamask }) => {
    const assetPage = new AssetPage(page, metamask);
    const { nftAddress, tokenId, listingDuration, listingPrice } =
      inputConfig[chainId];

    await assetPage.navigate(nftAddress, tokenId);
    await assetPage.list(listingDuration, listingPrice);

    const mainPage = new MainPage(page, metamask);

    await mainPage.navigate();
    await expect(
      page.locator(
        `[aria-details="NFT card for token ID ${tokenId} of contract ${nftAddress}"]`
      )
    ).toBeVisible();
  });

  test("should update", async ({ page, metamask }) => {
    const assetPage = new AssetPage(page, metamask);
    const { nftAddress, tokenId, updateDuration, updatePrice } =
      inputConfig[chainId];
    await assetPage.navigate(nftAddress, tokenId);
    await assetPage.update(updateDuration, updatePrice);
    await page.reload();
    await expect(
      page.locator('[aria-label="total price for whole renting period"]')
    ).toHaveText(updatePrice);
  });

  test("should cancel", async ({ page, metamask }) => {
    const { nftAddress, tokenId } = inputConfig[chainId];
    const assetPage = new AssetPage(page, metamask);
    const mainPage = new MainPage(page, metamask);

    await assetPage.navigate(nftAddress, tokenId);
    await assetPage.cancel();

    await mainPage.navigate();
    await mainPage.navigateToListPage(nftAddress, tokenId);
    await page.waitForURL(`**/asset/${nftAddress}/${tokenId}`);
  });
});
