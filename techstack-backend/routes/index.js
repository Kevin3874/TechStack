const express = require('express');
const scrapeRouter = require('./scrape.js');
const testRouter = require('./test.js');
const router = express.Router();

router.use('/scrape', scrapeRouter); 
router.use('/test', testRouter);

module.exports = router;
