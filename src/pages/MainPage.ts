import { config } from "@root/config";
import { BasePage } from "./BasePage";

export class MainPage extends BasePage {
  url = `${config.host}/`;

  elements = {
    connectWalletButton: this.page.locator("button", {
      hasText: /connect wallet/gi,
    }),
    connectMetamaskButton: this.page.locator("button", {
      hasText: /MetaMask/,
    }),
    connectWalletConnectButton: this.page.locator("button", {
      hasText: /WalletConnect/gi,
    }),
    logoutButton: this.page.locator('[role="menuitem"]', {
      hasText: /log out/gi,
    }),
    lendTabToggleButton: this.page.locator("button", {
      hasText: /lend/gi,
    }),
    MyNFTs: this.page.locator("button", {
      hasText: /MyNFTs/,
    }),
    accountMenuButton: this.page.locator('[aria-label="account menu"]'),
  };

  async login() {
    if (await this.isWalletConnected()) {
      return;
    }

    await this.elements.connectWalletButton.click();
    await this.elements.connectMetamaskButton.click();
    await this.metamask.connectWallet();
  }

  async logout() {
    if (!(await this.isWalletConnected())) {
      return;
    }

    await this.elements.accountMenuButton.click();
    await this.elements.logoutButton.click();
    await this.metamask.disconnectWallet();
  }

  private async isWalletConnected() {
    return (await this.elements.connectWalletButton.count()) === 0;
  }

  async navigateToListPage(nftAddress: string, tokenId: string) {
    await this.elements.lendTabToggleButton.click();

    await this.page
      .locator(
        `[aria-details="NFT card for token ID ${tokenId} of contract ${nftAddress}"]`
      )
      .locator("a", { hasText: /List/ })
      .click();
  }
}
