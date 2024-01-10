const cheerio = require('cheerio');
const axios = require('axios');
require('dotenv').config();

const scrapeAmazon = async (url) => {
  console.log("Scraping", url)
  try {
    // Replace with your ScraperAPI key
    const scraperApiUrl = `http://api.scraperapi.com/?api_key=${process.env.SCRAPER_API_KEY}&url=${encodeURIComponent(url)}`;

    const response = await axios.get(scraperApiUrl);
    const rawHTML = response.data;
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

    console.log("Finished scraping", url);

    let data = Array.from(uniqueProducts.values());
    return data;

  } catch (e) {
    console.log('Scraping Amazon failed: ', e);
    throw ('Scraping Amazon failed');
  }
};

module.exports = scrapeAmazon;
