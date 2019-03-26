// ====================
// Require Modules
// ====================

// Express Server
var express = require("express");

// HTTP request logger
var logger =  require("morgan");

// MongoDB Modeling tool
var mongoose = require("mongoose");

// Promise based HTTP client for the browser and node.js
var axios = require("axios");

// HTTP scraper
var cheerio = require("cheerio");

// ==================================================
// Require models, set port, and initial Express
// ==================================================

// Require all models
var db = require("./models");

// Set port that app will listen on locally
var PORT = 12300;

// Initial Express
var app = express();

// =========================
// Configure Middleware
// =========================

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(espress.json());

// Set public as static folder
app.use(express.static("public"));

// Connect to Mongo DB (local)
mongoose.connect("mongodb://localhost/scraperHW", { useNewUrlParser: true });

// ===============
// Set routes
// ===============

// GET route for scraping
app.get("/scrape", function(req, res) {
    
    // Axios pull of body of html
    axios.get("https://www.npr.org/tags/170838685/book-news").then(function(response) {

        // Load html body into cheerio selector
        var $ = cheerio.load(response.data);

        // Pull each article tag
        $("article.item").each(function(i, element) {

            // Save an empty result object to be filled later
            var result = {};

            // Pull `title` of each article
            result.title = $(this)
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
        })

    })
})
