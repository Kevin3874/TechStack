const scrapeAmazon = require("./scrapeAmazonGPU");
const scrapeBestbuy = require("./scrapeBestBuyGPU");
const scrapeNewegg = require("./scrapeNeweggGPU");
const GPURetailers = require("../models/GPURetailers");

async function scrapeGPU() {
  try {
    let retailers = GPURetailers();
    const amazonData = await scrapeAmazon(retailers[0]);
    const bestbuyData = await scrapeBestbuy(retailers[1]);
    const neweggData = await scrapeNewegg(retailers[2]);
    return { 
      amazonDataGPU: amazonData, 
      bestbuyDataGPU: bestbuyData, 
      neweggDataGPU: neweggData 
    }
  } catch (error) {
    throw error;
  }
}

module.exports = scrapeGPU;
