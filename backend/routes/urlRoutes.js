const express = require("express");
const router = express.Router();

const { createShortUrl, redirectUrl } = require("../controllers/urlController");

router.post("/shorten", createShortUrl);
router.get("/:shortCode", redirectUrl);

module.exports = router;