const express = require("express");
const axios = require("axios");

const router = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY ;

router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;

    const url = `https://newsapi.org/v2/everything?q="student mental health" OR "college stress" OR "university mental health"&sortBy=publishedAt&pageSize=10&page=${page}&language=en&apiKey=${NEWS_API_KEY}`;

    const response = await axios.get(url);

    res.json({
      articles: response.data.articles || [],
    });
  } catch (err) {
    console.error("NewsAPI Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to fetch blogs",
    });
  }
});


module.exports = router;