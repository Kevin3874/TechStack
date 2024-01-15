const scrapeAmazon = require("./scrapeAmazon");
const scrapeBestBuy = require("./scrapeBestBuy");
const scrapeNewegg = require("./scrapeNewegg");
const scrapeTarget = require("./scrapeTarget");
const GetRetailers = require("../models/Retailers");
const initBrowser = require("./initBrowserService");
const scrapeWithPuppeteer = require("./scrapeWithPuppeteerService");


async function scrape(query) {
  let browser = await initBrowser();
  const queryWords = query.split(' ');
  let retailers = GetRetailers(queryWords);

  try {
    const [amazonData, bestbuyData, neweggData] = await Promise.all([
      scrapeAmazon(retailers[0]),
      scrapeWithPuppeteer(browser, scrapeBestBuy, retailers[1]),
      scrapeWithPuppeteer(browser, scrapeNewegg, retailers[2])
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

module.exports = scrape;
