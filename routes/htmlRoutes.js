// Requires

var express = require("express")
var router = express.Router()

var db = require("../models");


// Routes

// GET Route: database -> client
router.get("/", function(req, res) {
    
    // Grab all documents from Articles collection
    db.Article.find({})

        // Promise function to push result into client
        .then(function(article) {
            res.render("index",{article: article});
        })

        // Catch function in case an error occurs. Send error to client
        .catch(function(err) {
            res.json(err);
        });
});

router.get("*", function(req, res) {
    res.status(404).send("404 - Page Not Found");
});

module.exports = router;