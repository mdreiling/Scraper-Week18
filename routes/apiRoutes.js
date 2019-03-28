// Requires

var express = require("express");
var router = express.Router();

var db = require("../models");


// Routes

// GET Route: database -> client
router.get("/articles", function(req, res) {
    
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
router.get("/articles/:id", function(req, res) {

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
router.post("/articles/:id", function(req, res) {
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

module.exports = router;