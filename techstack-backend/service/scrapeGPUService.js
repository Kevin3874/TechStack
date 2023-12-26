const scrapeAmazon = require("./scrapeAmazon");
const scrapeBestbuy = require("./scrapeBestBuy");
const scrapeMicrocenter = require("./scrapeMicrocenter");
const scrapeNewegg = require("./scrapeNewegg");
const GPURetailers = require("../models/GPURetailers");

async function scrapeGPU() {
  try {
    let retailers = GPURetailers();
    const amazonData = await scrapeAmazon(retailers[0]);
    const bestbuyData = await scrapeBestbuy(retailers[1]);
    const microcenterData = await scrapeMicrocenter(retailers[2]);
    const neweggData = await scrapeNewegg(retailers[3]);
    return { amazonData, bestbuyData, microcenterData, neweggData }
  } catch (error) {
    throw error;
  }
}

module.exports = scrapeGPU;
