const scrapeGPU = require('../service/scrapeGPUService.js');
const express = require('express');
const app = express();

app.use(express.json());

exports.scrapeGPU = async (req, res) => { 
  try {
    let data = await scrapeGPU();
  } catch (error) {
    console.log(error);
    res.status(400).send('Error while scraping GPU data')
  }
}