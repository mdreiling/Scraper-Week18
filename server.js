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
app.use(express.json());

// Set public as static folder
app.use(express.static("public"));

// Connect to Mongo DB (local)
mongoose.connect("mongodb://localhost/scraperHW", { useNewUrlParser: true });


// ===============
// Set routes
// ===============

// GET Route: html(scrape) -> database
app.get("/scrape", function(req, res) {
    
    // Axios pull of body of html
    axios.get("https://www.npr.org/tags/170838685/book-news").then(function(response) {

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
        });

        // Send a message to the client
        res.send("Scrape Complete!");
    });
});

// GET Route: database -> client
app.get("/articles", function(req, res) {
    
    // Grab all documents from Articles collection
    db.Article.find({})

        // Promise function to push result into client
        .then(function(dbArticle) {
            res.json(dbArticle);
        })

        // Catch function in case an error occurs. Send error to client
        .catch(function(err) {
            res.json(err);
        });
});

// GET Route: Querying singular Article to show its Comments
app.get("/articles/:id", function(req, res) {

    // Prepare a query based off of the ID passed in the ID parameter
    db.Article.findOne({ _id: req.params.id })

        // Populate Article with all comments associated with it
        .populate("comment")
        .then(function(dbArticle) {

            // If the query was successful, send it back to the client
            res.json(dbArticle);
        })
        
        // Catch function in case an error occurs. Send error to client
        .catch(function(err) {
            res.json(err);
        });
});

// POST Route: Saving/Updating an Article's associated Comments
app.post("/articles/:id", function(req, res) {
    
    // Create a new Comment and pass the req.body to the entry
    db.Comment.create(req.body)

        // Add Comment to the Article with the same id
        .then(function(dbComment) {
            return db.Article.findOneAndUpdate({ _id: req.params.id}, { comment: dbComment._id}, { new: true });
        })

        // Send updated Article with new Comment back to client
        .then(function(dbArticle) {
            res.json(dbArticle);
        })

        // Catch function in case an error occurs. Send error to client
        .catch(function(err) {
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});