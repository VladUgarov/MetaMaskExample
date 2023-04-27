import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { networks } from "./networks";

dotenv.config();

type E2EConfig = {
  statePath: string;
  downloadPath: string;
  metamaskPath: string;
  metamaskVersion: string;
  metamaskPassword: string;
  metamaskSeedPhrase: string;
  googleUser: string;
  googlePassword: string;
  host: string;
  authCookie?: string;
  sharedCookiePath: string;
  networks: typeof networks;
};

const storagePath = path.join(process.cwd(), ".cache/user-data");
const sharedCookiePath = path.join(storagePath, "shared-cookie.json");
const metamaskVersion = "10.8.1";
const downloadPath = path.join(process.cwd(), ".cache/extensions/metamask");
const metamaskPath = path.join(downloadPath, "v10_8_1");

const getAuthCookie = () => {
  const envAuthCookie = process.env.AUTH_COOKIE
    ? Buffer.from(process.env.AUTH_COOKIE, "base64").toString("utf8")
    : undefined;

  if (!envAuthCookie) {
    if (fs.existsSync(sharedCookiePath)) {
      const sharedCookie = fs.readFileSync(sharedCookiePath, "utf-8");

      return sharedCookie || undefined;
    }
  }

  return envAuthCookie;
};

export const config: E2EConfig = {
  statePath: storagePath,
  sharedCookiePath,
  metamaskVersion,
  downloadPath,
  metamaskPath,
  metamaskPassword: process.env.METAMASK_PASSWORD || "12345678",
  metamaskSeedPhrase: process.env.METAMASK_SEED_PHRASE || "",
  googlePassword: process.env.GOOGLE_PASSWORD || "",
  googleUser: process.env.GOOGLE_USER || "",
  host: process.env.APP_HOST || "https://dev.takeus.io",
  authCookie: getAuthCookie(),
  networks,
};
