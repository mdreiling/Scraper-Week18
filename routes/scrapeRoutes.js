// Requires

var express = require("express");
var router = express.Router();

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models");


// Routes

// GET Route: html(scrape) -> database
router.get("/", function(req, res) {
    
    // Axios pull of body of html
    axios.get("https://www.npr.org/tags/170838685/book-news")
    .then(function(response) {

        // Load html body into cheerio selector
        var $ = cheerio.load(response.data);

        // Pull each article tag
        $("article.item").each(function(i, element) {

            // Save an empty result object to be filled later
            var result = {};

            // Pull `headline` of each article
            result.headline = $(this)
                .children("div.item-info-wrap")
                .children("div.item-info")
                .children("h2.title")
                .text();

            // Pull `link` of each article
            result.link = $(this)
                .children("div.item-info-wrap")
                .children("div.item-info")
                .children("h2.title")
                .children("a")
                .attr("href");

            // Pull `summary` of each article
            result.summary = $(this)
                .children("div.item-info-wrap")
                .children("div.item-info")
                .children("p.teaser")
                .text();

            // Pull `image` for each article
            result.image = $(this)
                .children("div.item-image")
                .children("div.imagewrap")
                .children("a")
                .children("img")
                .attr("src");

            // Create a new Article using the scraped `result` object
            db.Article.create(result)

                // Promise function to show result in console
                .then(function(dbArticle) {

                    // View added result in the console
                    console.log(dbArticle);
                })

                // Catch in case of error
                .catch(function(err) {

                    // If an error occured, log it here
                    console.log("++ DB Article Create Error ++\n" + err)
                });

                console.log("Scrape complete!");

                res.send(result);
        });
    });
});



module.exports = router;