// Require mongoose database modeling tool
var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create a new CommentSchema object using the Schema constructor
var ArticleSchema = new Schema({

    // Article `headline` is required and of type String
    headline: {
        type: String,
        required: true
    },
    
    // Article `summary` is required and of type String
    summary: {
        type: String,
        required:true
    },

    // Article `link` is required and of type String
    link: {
        type: String,
        required: true
    },

    // Article `image` is required and of type String
    image: {
        type: String,
        required: true
    },

    // Comment object that stores a Comment ID to reference to the Comment Model
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }

});

// Creates the model using above Schema
var Article = mongoose.model("Article", ArticleSchema);

// Export the Comment model
module.exports = Article;
