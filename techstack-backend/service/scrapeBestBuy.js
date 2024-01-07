const scrapeBestBuy = async (page) => {
  try {
    await page.waitForTimeout(1000);
    
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
    console.log('Scraping BestBuy failed: ', e);
    throw('Scraping BestBuy failed');
  }
};

module.exports = scrapeBestBuy;
