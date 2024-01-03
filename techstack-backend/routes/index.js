const express = require('express');
const scrapeRouter = require('./scrape.js');
const testRouter = require('./test.js');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the TechStack API!');
});
router.use('/scrape', scrapeRouter); 
router.use('/test', testRouter);

module.exports = router;
