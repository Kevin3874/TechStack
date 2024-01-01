const puppeteer = require('puppeteer-core');
require('dotenv').config({ path: './.env.local' });

const scrapeNewegg = async (URL) => {
  let browser;
  try {
    browser = await puppeteer.connect({
      browserWSEndpoint: process.env.AUTH_ENDPOINT
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30 * 1000);
    await page.goto(URL);

    const products = await page.evaluate(() => {
      const uniqueProducts = new Map();
      const listWrap = document.querySelector('.list-wrap');

      if (listWrap) {
        const itemGroups = listWrap.querySelectorAll('.item-cells-wrap.border-cells.items-grid-view');

        itemGroups.forEach(group => {
          const productContainers = group.querySelectorAll('.item-cell');
          productContainers.forEach(container => {
            const productLinkEl = container.querySelector('a.item-title');
            const productLink = productLinkEl ? productLinkEl.href : null;
            const productImageEl = container.querySelector('.item-img img');
            const productImage = productImageEl ? productImageEl.src : null;
            const productName = productLinkEl ? productLinkEl.innerText.trim() : null;
            const productPriceEl = container.querySelector('.price-current strong');
            const productPriceDecimalEl = container.querySelector('.price-current sup');
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
        });
      }

      // Conver to array
      let data = Array.from(uniqueProducts.values());
      data.push("Newegg");
      return data;
    });

    //console.log(products);
    //console.log("Size:", products.length);
    return products;
    
  } catch (e) {
    console.log('Scraping Newegg failed: ', e);
  } finally {
    await browser?.close();
  }
};

//scrapeNewegg("https://www.newegg.com/p/pl?d=graphics+card");

module.exports = scrapeNewegg;
