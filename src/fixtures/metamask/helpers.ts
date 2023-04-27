import { Page } from "@playwright/test";
import { config } from "@root/config";

export const initializeHelpers = (page: Page) => {
  const unlock = async () => {
    const unlockButton = page.locator("button", { hasText: "Unlock" });

    if ((await unlockButton.count()) === 1) {
      await page.locator("#password").type(config.metamaskPassword);
      await unlockButton.click();
      await unlockButton.isHidden();

      return true;
    }

    return false;
  };

  const importWallet = async () => {
    await page.reload({ waitUntil: "networkidle" });
    await page.click('button:has-text("Get Started")');
    await page.click('button:has-text("Import Wallet")');
    await page.click('button:has-text("No Thanks")');

    await page
      .locator(".first-time-flow__seedphrase input")
      .type(config.metamaskSeedPhrase);

    await page.locator("#password").type(config.metamaskPassword);
    await page.locator("#confirm-password").type(config.metamaskPassword);

    await page
      .locator(".first-time-flow__checkbox.first-time-flow__terms")
      .click();

    await page.click('button:has-text("Import")');

    await page.click('button:has-text("All Done")');
    await page.click('[data-testid="popover-close"]');
  };

  const waitForNotification = async (triggerPromise: Promise<any>) => {
    await Promise.all([
      new Promise((resolve) => {
        const context = page.context();

        const handleNewPage = (page: Page) => {
          if (page.url().endsWith("notification.html")) {
            resolve(true);
            context.off("page", handleNewPage);
          }
        };

        context.on("page", handleNewPage);
      }),
      triggerPromise,
    ]);
  };

  const confirmTransaction = async (triggerPromise: Promise<any>) => {
    await waitForNotification(triggerPromise);
    await page.reload();
    await page.locator('button:has-text("Confirm")').click();
  };

  const rejectTransaction = async () => {
    await page.reload();
    await page.click('button:has-text("Reject")');
  };

  const disconnectWallet = async () => {
    await page.reload({ waitUntil: "networkidle" });
    await page.click('button[data-testid="account-options-menu-button"]');
    await page.click(
      'button[data-testid="account-options-menu__connected-sites"]'
    );

    await page.click(".connected-sites-list__trash");
    await page.click('button:has-text("Disconnect")');
  };

  const connectWallet = async () => {
    await page.reload({ waitUntil: "networkidle" });
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Connect")');
  };

  const returnToMainPage = async () => {
    await page.click(".app-header__logo-container");
  };

  const ensureTestNetworksEnabled = async () => {
    await page.click(".account-menu__icon");
    await page.click('.account-menu__item:has-text("Settings")');
    await page.click('.tab-bar__tab__content__title:has-text("Advanced")');

    const toggleShowNetwork = page.locator(
      '[data-testid="advanced-setting-show-testnet-conversion"]:has-text("Show test networks") .toggle-button--off > div:nth-child(1) '
    );
    if ((await toggleShowNetwork.count()) == 1) {
      await toggleShowNetwork.click();
    }

    await returnToMainPage();
  };

  const chooseNetwork = async (chainId: number) => {
    await ensureTestNetworksEnabled();
    await page.click('.network-display[role="button"]');
    const networkConfig = config.networks[chainId];
    const network = page.locator(
      `li.dropdown-menu-item:has-text("${networkConfig.name}")`
    );

    if ((await network.count()) > 0) {
      await network.click();
    } else {
      await page.click('button:has-text("Add Network")');

      await page.type(".form-field:nth-child(1) input", networkConfig.name);
      await page.type(".form-field:nth-child(2) input", networkConfig.rpc);
      await page.type(
        ".form-field:nth-child(3) input",
        networkConfig.chainId.toString()
      );
      await page.type(".form-field:nth-child(4) input", networkConfig.symbol);
      await page.type(
        ".form-field:nth-child(5) input",
        networkConfig.explorerURL
      );
      await page.click('button:has-text("Save")');
    }
  };

  return {
    unlock,
    importWallet,
    connectWallet,
    confirmTransaction,
    rejectTransaction,
    disconnectWallet,
    chooseNetwork,
  };
};
