const express = require('express');
const scrapeRouter = require('./scrape.js');
const router = express.Router();

router.use('/scrape', scrapeRouter); 

module.exports = router;
