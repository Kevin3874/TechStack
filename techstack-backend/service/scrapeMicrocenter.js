const axios = require('axios');
const cheerio = require('cheerio');

const scrapeMicrocenter = async (URL) => {
  const response = await axios.get(URL);
  const $ = cheerio.load(response.data);
  return $('.product_wrapper').map((i, element) => {
    const $element = $(element);
    return {
      name: $element.find('.details h2 a').text(),
      price: $element.find('.price').text(),
      image: $element.find('.image img').attr('src'),
      url: $element.find('.details h2 a').attr('href'),
      retailer: 'Microcenter'
    };
  }).get();
};

module.exports = scrapeMicrocenter;