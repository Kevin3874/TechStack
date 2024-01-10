const scrapeAmazon = require("./scrapeAmazon");
const scrapeBestBuy = require("./scrapeBestBuy");
const scrapeNewegg = require("./scrapeNewegg");
const GetRetailers = require("../models/Retailers");
const initBrowser = require("./initBrowserService");
require('dotenv').config();

let proxyUrl;
async function scrapeWithPuppeteer(browser, scrapeFunction, url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.waitForTimeout(randomDelay());
  const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36";
  await page.setUserAgent(userAgent);
  page.setDefaultNavigationTimeout(2 * 60 * 1000);
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Accept*': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(randomDelay());

  await page.mouse.move(Math.random() * 1280, Math.random() * 800)

  //console.log(`Intercepting requests for ${url} with user agent ${userAgent}`);
  await page.waitForTimeout(randomDelay());
  await page.setRequestInterception(true);
  await page.on('request', (req) => {
    if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  console.log(`Scraping ${url}`);
  const data = await scrapeFunction(page);
  console.log(`Finished scraping ${url}`)
  await page.close();
  return data;
}

async function scrape(query) {
  let browser = await initBrowser();
  const queryWords = query.split(' ');
  let retailers = GetRetailers(queryWords);

  try {
    const [amazonData, bestbuyData, neweggData] = await Promise.all([
      scrapeAmazon(retailers[0]),
      scrapeWithPuppeteer(browser, scrapeBestBuy, retailers[1]),
      scrapeWithPuppeteer(browser, scrapeNewegg, retailers[2]),
    ]);

    return { 
      Amazon: amazonData, 
      BestBuy: bestbuyData, 
      Newegg: neweggData 
    };

  } catch (error) {
    console.error("Scraping failed:", error);
  }
}

function randomDelay() {
  // Generate a random number between 1000 (1 second) and 5000 (5 seconds)
  return Math.floor(Math.random() * (1000 + 1)) + 500;
}

module.exports = scrape;
