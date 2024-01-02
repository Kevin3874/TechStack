//const puppeteer = require('puppeteer-core')
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config({ path: './.env.local' });

puppeteer.use(StealthPlugin());

const scrapeBestBuy = async (URL) => {
  let browser;
  try {
    // browser = await puppeteer.connect({
    //   browserWSEndpoint: process.env.AUTH_ENDPOINT
    // });

    browser = await puppeteer.launch({ headless: "new" });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);
    await page.goto(URL, {waitUntil: 'networkidle2'});

    const products = await page.evaluate(() => {
      const uniqueProducts = new Map();

      const productContainers = document.querySelectorAll('ol.sku-item-list > li.sku-item');
      productContainers.forEach(container => {
        const productLinkEl = container.querySelector('h4.sku-title > a');
        const productLink = 'https://www.bestbuy.com' + productLinkEl?.getAttribute('href');
        
        // Check for unique product link
        if (!productLink || uniqueProducts.has(productLink)) {
          return;
        }

        const productName = productLinkEl?.innerText.trim();
        // Selectors
        const productPriceEl = container.querySelector('.sku-list-item-price .priceView-customer-price span');
        const productImageEl = container.querySelector('.image-link img.product-image');

        // Extract Data
        const productPrice = productPriceEl ? productPriceEl.innerText.trim() : null;
        const productImage = productImageEl ? productImageEl.src : null;

        if (productName && productPrice && productLink) {
          uniqueProducts.set(productLink, { 
            productName, 
            productPrice, 
            productLink, 
            productImage 
          });
        }
      });

      // Convert Map to Array
      let data = Array.from(uniqueProducts.values());
      data.push("BestBuy");
      return data;
    });

    //console.log(products);
    //console.log("Size:", products.length);
    return products;
    
  } catch (e) {
    console.log('Scraping Best Buy failed: ', e);
  } finally {
    await browser?.close();
  }
};

scrapeBestBuy("https://www.bestbuy.com/site/searchpage.jsp?st=Graphics+Cards");

module.exports = scrapeBestBuy;
