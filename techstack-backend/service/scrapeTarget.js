const cheerio = require('cheerio');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: './.env.local' });

const scrapeTarget = async (url) => {
  try {
    const scraperApiUrl = `http://api.scraperapi.com/?api_key=${process.env.SCRAPER_API_KEY}&url=${encodeURIComponent(url)}`;

    const response = await axios.get(scraperApiUrl);
    const rawHTML = response.data;
    const $ = cheerio.load(rawHTML);
    const uniqueProducts = new Map();

    $('.styles__StyledCol-sc-fw90uk-0.dOpyUp').each((index, element) => {
      const productLink = $(element).find('a.styles__StyledTitleLink-sc-14ktig2-1.cbOry').attr('href');
      const productImage = $(element).find('.ProductCardImage__PicturePrimary-sc-1y6rvoy-0.gXpSlS img').attr('src');
      const productName = $(element).find('a.styles__StyledTitleLink-sc-14ktig2-1.cbOry').text().trim();
      const productPrice = $(element).find('.styles__PriceStandardLineHeight-sc-b5yooy-0.kKRufV span').first().text().trim();

      // Check and add product to the map
      if (productLink && !uniqueProducts.has(productLink)) {
        uniqueProducts.set(productLink, {
          productName,
          productPrice,
          productLink: `https://www.target.com${productLink}`,
          productImage
        });
      }
    });
      
    // Convert data to array
    let data = Array.from(uniqueProducts.values());
    return data;
    
  } catch (e) {
    console.log('Scraping Target failed: ', e);
    throw('Scraping Target failed');
  } 
};
module.exports = scrapeTarget;