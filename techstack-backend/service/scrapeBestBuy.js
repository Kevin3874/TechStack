const puppeteer = require('puppeteer-core');
require('dotenv').config({ path: './.env.local' });

const scrapeBestBuy = async (URL) => {
  let browser;
  try {
    browser = await puppeteer.connect({
      browserWSEndpoint: process.env.AUTH_ENDPOINT
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);
    await page.goto(URL);

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
        const productPrice = container.querySelector('.sku-list-item-price .priceView-customer-price span')?.innerText.trim();
        const productImage = container.querySelector('.image-link img.product-image')?.src;

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
      return Array.from(uniqueProducts.values());
    });

    console.log(products);
    console.log("Size:", products.length);
    
  } catch (e) {
    console.log('Scraping Best Buy failed: ', e);
  } finally {
    await browser?.close();
  }
};

scrapeBestBuy("https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002");

//module.exports = scrapeBestBuy;
