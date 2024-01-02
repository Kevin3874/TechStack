const scrape = require('../service/scrapeService.js');
const express = require('express');
const app = express();

app.use(express.json());

exports.scrape = async (req, res) => { 
  // Preprocess
  if (req.length === 0) {
    res.status(400),send('Empty query')
  }
  const query = req.query.q;
  try {
    
    let data = await scrape(query);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(400).send('Error while scraping GPU data')
  }
}