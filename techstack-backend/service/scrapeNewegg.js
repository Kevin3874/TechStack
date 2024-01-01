const puppeteer = require('puppeteer-core');
require('dotenv').config({ path: './.env.local' });

const scrapeNewegg = async (URL) => {
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

      const productContainers = document.querySelectorAll('.item-cells-wrap.border-cells.items-grid-view .item-cell');
      productContainers.forEach(container => {
        // Selectors
        const productLinkEl = container.querySelector('a.item-title');
        const productImageEl = container.querySelector('.item-img img');
        const productPriceEl = container.querySelector('.price-current strong');
        const productPriceDecimalEl = container.querySelector('.price-current sup');

        // Extract data
        const productLink = productLinkEl ? productLinkEl.href : null;
        const productImage = productImageEl ? productImageEl.src : null;
        const productName = productLinkEl ? productLinkEl.innerText.trim() : null;
        const productPrice = productPriceEl ? productPriceEl.innerText.trim() : null;
        const productPriceDecimal = productPriceDecimalEl ? productPriceDecimalEl.innerText.trim() : null;
        const fullPrice = productPrice && productPriceDecimal ? `${productPrice}${productPriceDecimal}` : productPrice;

        if (productLink && !uniqueProducts.has(productLink)) {
          uniqueProducts.set(productLink, { 
            productName, 
            productPrice: fullPrice, 
            productLink, 
            productImage 
          });
        }
      });

      let data = Array.from(uniqueProducts.values());
      data.push("Newegg");
      return data;
    });

    console.log(products);
    console.log("Size:", products.length);
    
  } catch (e) {
    console.log('Scraping Newegg failed: ', e);
  } finally {
    await browser?.close();
  }
};

scrapeNewegg("https://www.newegg.com/GPUs-Video-Graphics-Cards/SubCategory/ID-48?recaptcha=pass&PageSize=36");

//module.exports = scrapeNewegg;
