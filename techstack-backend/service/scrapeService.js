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
  const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36";
  await page.setUserAgent(userAgent);
  console.log(`Intercepting requests for ${url} with user agent ${userAgent}`);
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Accept*': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  });
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  page.setDefaultNavigationTimeout(2 * 60 * 1000);
  await page.goto(url, { waitUntil: 'networkidle2' });
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
    // browser = await puppeteer.connect({
    //   browserWSEndpoint: process.env.SBR_WS_ENDPOINT,
    // });
    browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote"
      ],
      executablePath:
          process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    });
    const [amazonData, neweggData] = await Promise.all([
      scrapeWithPuppeteer(browser, scrapeAmazon, retailers[0]),
      //scrapeWithPuppeteer(browser, scrapeBestbuy, retailers[1]),
      scrapeWithPuppeteer(browser, scrapeNewegg, retailers[2])
    ])

    // Testing
    // const [amazonData, bestbuyData, neweggData] = await Promise.all([
    //   scrapeWithPuppeteer(browser, scrapeAmazon, "https://www.amazon.com/s?k=Graphics+Cards"),
    //   scrapeWithPuppeteer(browser, scrapeBestbuy, "https://www.bestbuy.com/site/searchpage.jsp?st=Graphics+Cards"),
    //   scrapeWithPuppeteer(browser, scrapeNewegg, "https://www.newegg.com/p/pl?d=graphics+card")
    // ])
    return { 
      Amazon: amazonData, 
      //BestBuy: bestbuyData, 
      Newegg: neweggData 
    } 
    
  } catch (error) {
    console.error("Scraping failed:", error);
  } finally {
    await browser.close();
  }
}

module.exports = scrapeGPU;
