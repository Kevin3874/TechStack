const cheerio = require('cheerio');

const scrapeNewegg = async (page) => {
  try {
    await page.waitForTimeout(1000);

    // Fetch the raw HTML of the page
    const rawHTML = await page.content();
    const $ = cheerio.load(rawHTML);
    const uniqueProducts = new Map();

    $('.list-wrap .item-cells-wrap.border-cells.items-grid-view .item-cell').each((index, element) => {
      const productLinkEl = $(element).find('a.item-title');
      const productImageEl = $(element).find('.item-img img');
      const productPriceEl = $(element).find('.price-current strong');
      const productPriceDecimalEl = $(element).find('.price-current sup');

      const productLink = productLinkEl.attr('href');
      const productImage = productImageEl.attr('src');
      const productName = productLinkEl.text().trim();
      const productPrice = productPriceEl.text().trim();
      const productPriceDecimal = productPriceDecimalEl.text().trim();
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

    // Convert data to array
    let data = Array.from(uniqueProducts.values());
    data.push("Newegg");
    // Check for empty array, return []
    if (data.length === 1) {
      data.push("empty");
    }
    return data;
    
  } catch (e) {
    console.log('Scraping Newegg failed: ', e);
    throw('Scraping Newegg failed');
  } 
};

module.exports = scrapeNewegg;
