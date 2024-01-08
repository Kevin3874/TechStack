//require('dotenv').config({ path: './.env.local' });
require('dotenv').config();
//const puppeteer = require("puppeteer-core");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function initBrowser() {
  return await puppeteer.launch({
    args: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080',
    ],
    executablePath: process.env.NODE_ENV === "production"
      ? process.env.PUPPETEER_EXECUTABLE_PATH
      : puppeteer.executablePath(),
    headless: true,
    ignoreDefaultArgs: ["--enable-automation"],
  });
}

module.exports = initBrowser;