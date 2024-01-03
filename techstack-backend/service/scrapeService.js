const scrapeAmazon = require("./scrapeAmazon");
const scrapeBestbuy = require("./scrapeBestBuy");
const scrapeNewegg = require("./scrapeNewegg");
const GetRetailers = require("../models/Retailers");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeWithPuppeteer(browser, scrapeFunction, url) {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(2 * 60 * 1000);
  await page.goto(url, { waitUntil: 'networkidle2' });
  const data = await scrapeFunction(page);
  await page.close();
  return data;
}

async function scrapeGPU(query) {
  const queryWords = query.split(' ');
  let retailers = GetRetailers(queryWords);
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
  });
  try {
    const [amazonData, bestbuyData, neweggData] = await Promise.all([
      scrapeWithPuppeteer(browser, scrapeAmazon, retailers[0]),
      scrapeWithPuppeteer(browser, scrapeBestbuy, retailers[1]),
      scrapeWithPuppeteer(browser, scrapeNewegg, retailers[2])
    ])

    // Testing
    // const [amazonData, bestbuyData, neweggData] = await Promise.all([
    //   scrapeWithPuppeteer(browser, scrapeAmazon, "https://www.amazon.com/s?k=Graphics+Cards"),
    //   scrapeWithPuppeteer(browser, scrapeBestbuy, "https://www.bestbuy.com/site/searchpage.jsp?st=Graphics+Cards"),
    //   scrapeWithPuppeteer(browser, scrapeNewegg, "https://www.newegg.com/p/pl?d=graphics+card")
    // ])
    
    return { 
      amazonData: amazonData, 
      bestbuyData: bestbuyData, 
      neweggDta: neweggData 
    } 
    
  } catch (error) {
    console.error("Scraping failed:", error);
  } finally {
    await browser.close();
  }
}

module.exports = scrapeGPU;
