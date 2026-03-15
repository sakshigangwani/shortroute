const Url = require("../models/Url");
const generateShortCode = require("../utils/generateCode");
const validUrl = require("valid-url");

exports.createShortUrl = async (req, res) => {
    try {
        const { originalUrl, customAlias } = req.body;

        if (!validUrl.isUri(originalUrl)) {
            return res.status(400).json({ message: "Invalid URL" });
        }

        // check if URL already exists
        const existingUrl = await Url.findOne({ originalUrl });

        if (existingUrl) {
            return res.json({
                shortUrl: `${process.env.BASE_URL}/${existingUrl.shortCode}`
            });
        }

        let shortCode;

        if (customAlias) {
            // check if alias already exists
            const aliasExists = await Url.findOne({ shortCode: customAlias });

            if (aliasExists) {
                return res.status(400).json({
                    message: "Custom alias already taken"
                });
            }

            shortCode = customAlias;

        } else {
            shortCode = generateShortCode();
        }

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

        const url = await Url.findOne({ shortCode });

        if (!url) {
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