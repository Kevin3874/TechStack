const cheerio = require('cheerio');
const axios = require('axios');

const scrapeAmazon = async (url) => {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
      }
    });
    const $ = cheerio.load(html);
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
