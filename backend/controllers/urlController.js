const Url = require("../models/Url");
const generateShortCode = require("../utils/generateCode");

exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "URL is required" });
    }

    const shortCode = generateShortCode();

    const newUrl = new Url({
      originalUrl,
      shortCode
    });

    await newUrl.save();

    res.json({
      shortUrl: `${process.env.BASE_URL}/${shortCode}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.redirectUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const url = await Url.findOne({shortCode});

        if(!url) {
            return res.status(404).json({ message: "URL not found" });
        }

        url.clickCount += 1;
        await url.save();

        res.redirect(url.originalUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}