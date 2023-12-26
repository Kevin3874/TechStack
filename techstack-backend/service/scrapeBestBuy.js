const puppeteer = require('puppeteer');

const scrapeBestBuy = async (URL) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL);
  const content = await page.content();
  await browser.close();
  return content
};

module.exports = scrapeBestBuy;