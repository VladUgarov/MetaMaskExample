# MetaShare e2e

[![Smoke](https://github.com/Prometeus-Network/metashare-e2e/actions/workflows/smoke.yaml/badge.svg)](https://github.com/Prometeus-Network/metashare-e2e/actions/workflows/smoke.yaml)

End-to-End tests for metashare.io These tests are used to ensure that MetaShare.io is running without significant mistakes.

Testing suite uses:

- Playwright https://playwright.dev/
- TypeScript https://www.typescriptlang.org/

### 🤖 Starting up

To run test you have to install Node.JS and npm on your machine.

```sh
// e.g using volta.sh
volta install node@16
```

1. Install the dependencies using `npm install`
2. Rename `.env.example` to `.env` and fill in with your credentials
3. Run `npm run test`

### 📁 Structure

```sh
 |- config # Configuration file/s
 |- fixtures # Predefined fixture sets & their factory functions
 |- pages # Sets of pages for the application
 |- tests # Test suites
```

### 📜 Pages

For the suite template we follow **PageObject** pattern to encapsulate each page internal responsibility.

Keep in mind that you should always extend a new page from `BasePage` as it has underlying logic to handle `useDapp` connection. You can find page template below:

```ts
import { config } from "@root/config";
import { BasePage } from "@root/pages";

class MyPage extends BasePage {
  url = `${config.host}/my-page`;

  elements = {
    button: this.page.locator("button"),
  };

  async clickButton() {
    const { button } = this.elements;

    await button.click();
  }
}
```

### 🔎 Locating elements

We use ARIA aware pattern to locate elements.

- Find element by text match
- Find element by _aria-\*_ attribute

> ⚠️ If element doesn't have any text or proper _aria-\*_ attribute please contact developers so they add it on the page.
