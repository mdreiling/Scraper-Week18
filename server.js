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
