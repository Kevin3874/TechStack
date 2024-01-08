const cheerio = require('cheerio');

const scrapeBestBuy = async (page) => {
  try {
    await page.waitForTimeout(1000);

    const rawHTML = await page.content();
    const $ = cheerio.load(rawHTML);
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
