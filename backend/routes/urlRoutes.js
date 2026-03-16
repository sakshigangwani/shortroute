const express = require("express");
const router = express.Router();

const {
	createShortUrl,
	redirectUrl,
	getAllUrls,
	deleteUrl,
	getAnalyticsSummary
} = require("../controllers/urlController");

router.post("/shorten", createShortUrl);
router.get("/urls", getAllUrls);
router.delete("/urls/:id", deleteUrl);
router.get("/analytics/summary", getAnalyticsSummary);
router.get("/:shortCode", redirectUrl);

module.exports = router;