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
        url.lastClickedAt = new Date();
        await url.save();

        res.redirect(url.originalUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.getAllUrls = async (req, res) => {
    try {
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        const { search } = req.query;

        const filter = {};

        if (search && String(search).trim()) {
            const searchRegex = new RegExp(String(search).trim(), "i");
            filter.$or = [
                { originalUrl: searchRegex },
                { shortCode: searchRegex }
            ];
        }

        const urls = await Url.find(filter)
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        const formatted = urls.map((item) => ({
            _id: item._id,
            originalUrl: item.originalUrl,
            shortCode: item.shortCode,
            shortUrl: `${baseUrl}/${item.shortCode}`,
            clickCount: item.clickCount,
            createdAt: item.createdAt,
            lastClickedAt: item.lastClickedAt || null
        }));

        res.json({ urls: formatted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteUrl = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Url.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "URL not found" });
        }

        res.json({ message: "URL deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAnalyticsSummary = async (req, res) => {
    try {
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

        const [
            totalUrls,
            totalClicks,
            topUrls,
            recentUrls
        ] = await Promise.all([
            Url.countDocuments(),
            Url.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$clickCount" }
                    }
                }
            ]),
            Url.find({})
                .sort({ clickCount: -1, createdAt: -1 })
                .limit(5)
                .lean(),
            Url.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .lean()
        ]);

        const totalClicksValue = totalClicks?.[0]?.total || 0;

        const formatUrl = (item) => ({
            _id: item._id,
            originalUrl: item.originalUrl,
            shortCode: item.shortCode,
            shortUrl: `${baseUrl}/${item.shortCode}`,
            clickCount: item.clickCount,
            createdAt: item.createdAt,
            lastClickedAt: item.lastClickedAt || null
        });

        res.json({
            summary: {
                totalUrls,
                totalClicks: totalClicksValue,
                averageClicks: totalUrls ? Number((totalClicksValue / totalUrls).toFixed(2)) : 0
            },
            topUrls: topUrls.map(formatUrl),
            recentUrls: recentUrls.map(formatUrl)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};