//require('dotenv').config({ path: './.env.local' });
require('dotenv').config();

const scrapeAmazon = require("./scrapeAmazon");
const scrapeBestbuy = require("./scrapeBestBuy");
const scrapeNewegg = require("./scrapeNewegg");
const GetRetailers = require("../models/Retailers");
//const puppeteer = require("puppeteer-core");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeWithPuppeteer(browser, scrapeFunction, url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
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

async function scrapeGPU(query) {
  const queryWords = query.split(' ');
  let retailers = GetRetailers(queryWords);
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
      ],
      executablePath:
          process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
      ignoreDefaultArgs: ["--enable-automation"],
    });

    const [amazonData, bestbuyData, neweggData] = await Promise.all([
      scrapeWithPuppeteer(browser, scrapeAmazon, retailers[0]),
      scrapeWithPuppeteer(browser, scrapeBestbuy, retailers[1]),
      scrapeWithPuppeteer(browser, scrapeNewegg, retailers[2])
    ]);

    return { 
      Amazon: amazonData, 
      BestBuy: bestbuyData, 
      Newegg: neweggData 
    };

  } catch (error) {
    console.error("Scraping failed:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Helper function to introduce delay
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function randomDelay() {
  return 500 + Math.random() * 1000; // Random delay between 0.5 to 1.5 seconds
}


module.exports = scrapeGPU;
