// Require mongoose database modeling tool
var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create a new CommentSchema object using the Schema constructor
var CommentSchema = new Schema({

    // Comment `title` is of type String
    title: String,

    // Comment `body` is of type String
    body: String

});

// Creates the model using above Schema
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;
