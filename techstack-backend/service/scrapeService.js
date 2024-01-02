const scrapeAmazon = require("./scrapeAmazon");
const scrapeBestbuy = require("./scrapeBestBuy");
const scrapeNewegg = require("./scrapeNewegg");
const GetRetailers = require("../models/Retailers");

async function scrapeGPU(query) {
  try {
    const queryWords = query.split(' ');
    let retailers = GetRetailers(queryWords);
    const amazonData = await scrapeAmazon(retailers[0]);
    const bestbuyData = await scrapeBestbuy(retailers[1]);
    const neweggData = await scrapeNewegg(retailers[2]);
    return { 
      amazonData: amazonData, 
      bestbuyData: bestbuyData, 
      neweggData: neweggData 
    }
  } catch (error) {
    throw error;
  }
}

module.exports = scrapeGPU;
