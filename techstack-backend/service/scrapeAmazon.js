const cheerio = require('cheerio');

const scrapeAmazon = async (page) => {
  try {
    await page.waitForTimeout(1000);

    const rawHTML = await page.content();
    const $ = cheerio.load(rawHTML);
    const uniqueProducts = new Map();

    $('div[data-asin]').each((i, el) => {
      const asin = $(el).data('asin');
      if (!asin) return;

      const productName = $(el).find('h2 a.a-link-normal').text().trim();
      const productPrice = $(el).find('.a-price .a-offscreen').text().trim();
      const productLink = 'https://www.amazon.com' + $(el).find('h2 a.a-link-normal').attr('href');
      const productImage = $(el).find('.s-image').attr('src');

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
    console.log('Scraping Amazon failed: ', e);
    throw ('Scraping Amazon failed');
  }
};

module.exports = scrapeAmazon;
