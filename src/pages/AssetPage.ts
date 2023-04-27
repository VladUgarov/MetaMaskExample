import { config } from "@root/config";
import { BasePage } from "./BasePage";

export class AssetPage extends BasePage {
  chainId = 42;

  elements = {
    durationInput: this.page.locator('input[name="duration"]'),
    priceInput: this.page.locator('input[name="price"]'),
    vaultNameInput: this.page.locator('input[name="name"]'),
    listButton: this.page.locator("button", {
      hasText: /list on marketplace/gi,
    }),
    cancelButton: this.page.locator("button", {
      hasText: /cancel listing/gi,
    }),
    updateButton: this.page.locator("button", {
      hasText: /update listing/gi,
    }),
    createVaultButton: this.page.locator("button", {
      hasText: /create vault/gi,
    }),
    currencyDropdown: this.page.locator('[aria-label="select payment token"]'),
    modalUpdateButton: this.page.locator("button", {
      hasText: /^update erc/gi,
    }),
    modalListButton: this.page.locator("button", {
      hasText: /^list erc/gi,
    }),
    modalConfirmButton: this.page.locator("button", {
      hasText: /confirm/gi,
    }),
    doneButton: this.page.locator('button:has-text("Done")'),
  };

  async approve() {
    const approve = this.page.locator("button", {
      hasText: /approve/gi,
    });

    if ((await approve.count()) > 0) {
      await this.metamask.confirmTransaction(approve.click());
    }
  }

  async navigate(nftAddress: string, tokenId: string): Promise<void> {
    this.url = `${config.host}/asset/${nftAddress}/${tokenId}`;
    return super.navigate();
  }

  async list(
    duration: string,
    price: string,
    paymentTokenName = "Kovan USD Pegged Poken (USDT)"
  ) {
    await this.elements.durationInput.type(duration);
    await this.elements.priceInput.type(price);
    await this.elements.currencyDropdown.click();
    await this.page
      .locator(`[role="option"]`, { hasText: paymentTokenName })
      .click();

    await this.elements.listButton.click();
    await this.approve();

    const trigger = this.elements.modalListButton.click();

    await this.metamask.confirmTransaction(trigger);
    await this.elements.doneButton.click();
  }

  async update(duration: string, price: string) {
    await this.elements.updateButton.click();
    await this.elements.durationInput.fill(duration);
    await this.elements.priceInput.fill(price);

    await this.approve();

    const trigger = this.elements.modalUpdateButton.click();

    await this.metamask.confirmTransaction(trigger);
    await this.elements.doneButton.click();
  }

  async cancel() {
    await this.elements.cancelButton.click();

    const trigger = this.elements.modalConfirmButton.click();

    await this.metamask.confirmTransaction(trigger);
    await this.elements.doneButton.click();
  }
}
