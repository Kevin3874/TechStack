const scrapeNewegg = async (page) => {
  try {
    const products = await page.evaluate(() => {
      const uniqueProducts = new Map();
      const listWrap = document.querySelector('.list-wrap');

      // Check for list wrap selector
      if (listWrap) {
        const itemGroups = listWrap.querySelectorAll('.item-cells-wrap.border-cells.items-grid-view');

        itemGroups.forEach(group => {
          const productContainers = group.querySelectorAll('.item-cell');
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
        });
      }

      // Convert data to array
      let data = Array.from(uniqueProducts.values());
      data.push("Newegg");
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
    console.log('Scraping Newegg failed: ', e);
    throw('Scraping Newegg failed');
  } 
};

module.exports = scrapeNewegg;