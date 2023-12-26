const puppeteer = require('puppeteer');

const scrapeNewegg = async (URL) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL);
  const content = await page.content();
  await browser.close();
  return content
};
module.exports = scrapeNewegg;