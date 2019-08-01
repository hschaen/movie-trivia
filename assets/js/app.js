// declare our variables
// numbers
var count = 0;
var randome = 0;
// arrays
var movies = [];
var questions = [];
// strings
var newMovie = '';
var movie = '';
var selectedQuestion = '';
var director = '';
var actor = '';
var year = '';
var rating = '';
var yourAnswer = '';
var isAMovie = '';

//Start with some movies
movies = ["The Matrix", "The Big Lebowski", "Finding Nemo", "Pulp Fiction"];
// movies = sessionStorage.getItem("movies");
//Render movie buttons
var addButtons = function() {
    $("#movie-buttons").empty();
    for (var i = 0; i < movies.length; i++) {
        var newButton = $("<button>");
        newButton.text(movies[i]);
        newButton.attr("data-name", movies[i]);
        newButton.attr("type", "button");
        newButton.addClass("movie btn btn-primary mr-1");
        $("#movie-buttons").append(newButton);
    }
}

// Ask a question
var questions = [
    "Who directed this movie?",
    "Who was the lead actor?",
    "What year did this film come out?",
    "What was this movie rated?"
];

//Add a movie
$("#submit-movie").click(function(e) {
    e.preventDefault();
    if(!$('#add-movies').val()) {
        alert("Add a movie");
    } else {
        //if movie already exists in the array don't add it
        if (movies.indexOf($('#add-movies').val()) == -1) {
            newMovie = $("#add-movies").val().trim();
            movies.push(newMovie);
            addButtons();
            sessionStorage.setItem("movies", JSON.stringify(movies));
        } else {
            alert("Already Added.");
        }
    }
});

// Choose Your Movie
$(document).on("click",".movie", function() {
    movie = $(this).attr("data-name");
    
    //Find Movie Info
    findMovieInfo();
    random = Math.floor(Math.random() * movies.length);
    selectedQuestion = questions[random];
    renderGame();
    checkMovie();
});
// Start the Game
$(document).on("click","#submitAnswer", function(e) {
    e.preventDefault();
    yourAnswer = $("#yourAnswer").val();
    if (random == 0) {
        if(yourAnswer == director) {
            $("#answer").text("You're Right! " + movie + " is directed by: " + director);
            count++;
        } else {
            $("#answer").text("You're Wrong. Try again.");
        }
    }
    if (random == 1) {
        if(yourAnswer == actor) {
            $("#answer").text("You're Right! " + movie + " stars " + actor);
            count++;
        } else {
            $("#answer").text("You're Wrong. Try again.");
        }
    }
    if (random == 2) {
        if(yourAnswer == year) {
            $("#answer").text("You're Right! " + movie + " came out in " + year);
            count++;                                
        } else {
            $("#answer").text("You're Wrong. Try again.");
        }
    }
    if (random == 3) {
        if(yourAnswer == rating) {
            count++;
            $("#answer").text("You're Right! " + movie + " is rated: " + rating);
        } else {
            $("#answer").text("You're Wrong. Try again.");
        }
    }
    $("#score").text(count);
    $('#nextQuestion').html("<button type='button' class='btn btn-primary' id='nextQuestionBtn'>Next Question</button>");

});
$(document).on("click","#nextQuestionBtn", function() {
    renderGame();
});
function checkMovie() {
    if(isAMovie == "False") {
        alert("This is not a movie");
        // remove button that is not a movie
        // find the button by title
        $("[data-name=" + movie + "]").remove();
        // remove movie question info
        $('#movieInfo').empty();
        // remove the button
        movies.splice($.inArray(movie, movies), 1);
    }
}
function findMovieInfo() {
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);

        // Check if this is a movie or not
        isAMovie = response.Response;

        // Store Movie Info
        director = response.Director;
        actor = response.Actors;
        year = response.Year;
        rating = response.Rated;
    });
}
function renderGame() {
    $("#movieTitle").text(movie);
    random = Math.floor(Math.random() * movies.length);
    selectedQuestion = questions[random];
    $("#questions").text(selectedQuestion);
    $("#answersInput").html("<form><input type='text' id='yourAnswer' /><input type='submit' id='submitAnswer' type='button' class='btn btn-warning ml-1' value='Submit'></form>");
}
addButtons();