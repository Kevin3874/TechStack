const axios = require('axios');
const cheerio = require('cheerio');

const scrapeBestBuy = async (url) => {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
      }
    });
    const $ = cheerio.load(html);
    const uniqueProducts = new Map();

    $('ol.sku-item-list > li.sku-item').each((i, el) => {
      const productLinkEl = $(el).find('h4.sku-title > a');
      const productLink = 'https://www.bestbuy.com' + productLinkEl.attr('href');

      if (!productLink || uniqueProducts.has(productLink)) return;

      const productName = productLinkEl.text().trim();
      const productPriceEl = $(el).find('.sku-list-item-price .priceView-customer-price span');
      const productImageEl = $(el).find('.image-link img.product-image');

      const productPrice = productPriceEl.text().trim();
      const productImage = productImageEl.attr('src');

      if (productName && productPrice && productLink) {
        uniqueProducts.set(productLink, {
          productName,
          productPrice,
          productLink,
          productImage
        });
      }
    });

    let data = Array.from(uniqueProducts.values());
    return data;

  } catch (e) {
    console.log('Scraping BestBuy failed: ', e);
    throw ('Scraping BestBuy failed');
  }
};

module.exports = scrapeBestBuy;
