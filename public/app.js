// Grab articles as JSON from the /articles route
$.getJSON("/articles", function(data) {

    // For loop to cycle through all entries
    for (let i = 0; i < data.length; i++) {

        // Add information to client with appropriate data tags
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});