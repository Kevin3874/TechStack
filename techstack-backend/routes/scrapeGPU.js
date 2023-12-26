const express = require("express");
const router = express.Router();
const scrapeGPUController = require("../controllers/scrapeGPUController.js");

router.get("/", scrapeGPUController.scrapeGPU);

module.exports = router;
