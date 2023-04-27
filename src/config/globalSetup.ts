import downloadMetamask from "@chainsafe/dappeteer/dist/metamaskDownloader";
import fs from "fs";
import { config } from ".";

const globalSetup = async () => {
  const { downloadPath, metamaskVersion, metamaskPath } = config;
  const metamaskExists = fs.existsSync(metamaskPath);

  if (!metamaskExists) {
    await downloadMetamask(metamaskVersion, downloadPath);
  }
};

export default globalSetup;
