//const puppeteer = require('puppeteer-core')
// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
//require('dotenv').config({ path: './.env.local' });

//puppeteer.use(StealthPlugin());

const scrapeAmazon = async (page) => {
  //let browser;
  try {
    // browser = await puppeteer.connect({
    //   browserWSEndpoint: process.env.AUTH_ENDPOINT
    // });
    
    // browser = await puppeteer.launch({ headless: "new" });

    // const page = await browser.newPage();
    // page.setDefaultNavigationTimeout(2 * 60 * 1000);
    // await page.goto(URL, {waitUntil: 'networkidle2'});

    const products = await page.evaluate(() => {
      const uniqueProducts = new Map();
      const productContainers = document.querySelectorAll('div[data-asin]');
      productContainers.forEach(container => {
        const asin = container.getAttribute('data-asin');

        // Check for asin
        if (!asin || uniqueProducts.has(asin)) {
          return
        };

        // Selectors, add or adjust as needed
        const productNameEl = container.querySelector('h2 a.a-link-normal');
        const productPriceEl = container.querySelector('.a-price .a-offscreen');
        const productLinkEl = container.querySelector('h2 a.a-link-normal');
        const productImageEl = container.querySelector('.s-image');

        // Extract Data
        const productName = productNameEl ? productNameEl.innerText.trim() : null;
        const productPrice = productPriceEl ? productPriceEl.innerText.trim() : null;
        const productLink = productLinkEl ? 'https://www.amazon.com' + productLinkEl.getAttribute('href') : null;
        const productImage = productImageEl ? productImageEl.src : null;

        if (productName && productPrice && productLink) {
          uniqueProducts.set(asin, { 
            productName, 
            productPrice, 
            productLink,
            productImage 
          });
        }
      });

      // Conver to array
      let data = Array.from(uniqueProducts.values());
      data.push("Amazon");
      // Check for empty array, return []
      if (data.length === 1) {
        data.push("empty");
      }
      return data;
    });

    //console.log(products);
    //console.log("Size:", products.length);
    return products;
    
  } catch (e) {
    console.log('Scraping Amazon failed: ', e);
    throw('Scraping Amazon failed');
  } 
};

module.exports = scrapeAmazon;