const scrapeAmazon = require("./scrapeAmazon");
const scrapeBestbuy = require("./scrapeBestBuy");
const scrapeNewegg = require("./scrapeNewegg");
const GetRetailers = require("../models/Retailers");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require("dotenv").config();
puppeteer.use(StealthPlugin());

async function scrapeWithPuppeteer(browser, scrapeFunction, url) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  // const userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/${Math.random().toFixed(3)} (KHTML, like Gecko) Chrome/${Math.floor(Math.random() * 10) + 80}.0.${Math.floor(Math.random() * 1000)}.0 Safari/${Math.random().toFixed(3)}`;
  // await page.setUserAgent(userAgent);

  //page.setDefaultNavigationTimeout(2 * 60 * 1000);
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
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
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
