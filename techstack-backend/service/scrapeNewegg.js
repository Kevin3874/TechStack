const cheerio = require('cheerio');
const axios = require('axios');

const scrapeNewegg = async (url) => {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
      }
    });
    const $ = cheerio.load(html);
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
    return data;
    
  } catch (e) {
    console.log('Scraping Newegg failed: ', e);
    throw('Scraping Newegg failed');
  } 
};

module.exports = scrapeNewegg;
