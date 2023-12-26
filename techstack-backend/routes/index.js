const express = require('express');
const scrapeGPURouter = require('./scrapeGPU.js');
const router = express.Router();

router.use('/scrapeGPU', scrapeGPURouter); 

module.exports = router;
