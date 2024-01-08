const cheerio = require('cheerio');

const scrapeAmazon = async (page) => {
  try {
    await page.waitForTimeout(1000);

    // Get the HTML content of the page
    const pageContent = await page.content();
    //console.log("Page Content:", pageContent); // Log the raw HTML content
    const $ = cheerio.load(pageContent);
    const uniqueProducts = new Map();

    $('div[data-asin]').each((i, el) => {
      const asin = $(el).data('asin');
      if (!asin) return;

      const productName = $(el).find('h2 a.a-link-normal').text().trim();
      const productPrice = $(el).find('.a-price .a-offscreen').text().trim();
      const productLink = 'https://www.amazon.com' + $(el).find('h2 a.a-link-normal').attr('href');
      const productImage = $(el).find('.s-image').attr('src');

      if (productName && productPrice && productLink) {
        uniqueProducts.set(productLink,{
          productName,
          productPrice,
          productLink,
          productImage
        });
      }
    });

     // Convert data to array
     let data = Array.from(uniqueProducts.values());
     // Check for empty array, return []
     if (data.length === 1) {
       data.push("empty");
     }
     return data;

  } catch (e) {
    console.log('Scraping Amazon failed: ', e);
    throw ('Scraping Amazon failed');
  }
};

module.exports = scrapeAmazon;
