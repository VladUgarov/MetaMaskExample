import { Locator, Page } from "@playwright/test";
import { initializeHelpers } from "@root/fixtures/metamask";

export class BasePage {
  public url = "";
  protected elements: Record<string, Locator> = {};

  constructor(
    protected page: Page,
    protected metamask: ReturnType<typeof initializeHelpers>
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  async navigate(..._args: any[]) {
    await this.page.bringToFront();

    await this.page.addInitScript({
      content: String.raw`
        window.__USEDAPP_DEVTOOLS_HOOK__ = {
          send: () => {},
          init: () => {
            window.INITIALIZED = true;
          },
        };
      `,
    });
    await this.page.goto(this.url);

    await this.page.waitForFunction(() => (window as any).INITIALIZED === true);
  }
}
