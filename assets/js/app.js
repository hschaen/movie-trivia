// declare our variables
// numbers
var count = 0;
var randome = 0;
var removeQuestionID = 0;
// arrays
var movies = [];
var newMovies = [];
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
var queryURL;
var apiKey;
var giphyImage = "";

//Start with some movies
if(sessionStorage.getItem("movies") === null) {
    movies = ["The Matrix", "The Big Lebowski", "Finding Nemo", "Pulp Fiction"];
} else {
    movies = JSON.parse(sessionStorage.getItem("movies"));
}
//Render movie buttons
var addButtons = function() {
    $("#movie-buttons").empty();
    console.log("I am empty inside");
    for (var i = 0; i < movies.length; i++) {
        var newButton = $("<button>");
        newButton.text(movies[i]);
        newButton.attr("data-name", movies[i]);
        newButton.attr("type", "button");
        newButton.addClass("movie btn btn-primary mr-1 mt-3");
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
sessionStorage.setItem("questions", JSON.stringify(questions));

//Add a movie
$("#submit-movie").click(function(e) {
    e.preventDefault();
    sessionStorage.clear();
    if(!$('#add-movies').val()) {
        alert("Add a movie");
    } else {
        //if movie already exists in the array don't add it
        if (movies.indexOf($('#add-movies').val()) == -1) {
            newMovie = $("#add-movies").val().trim();
            movies.push(newMovie);
            newMovies.push(newMovie);
            addButtons();
            sessionStorage.setItem("movies",JSON.stringify(movies));
            sessionStorage.setItem("newMovies",JSON.stringify(newMovies));
            $("#add-movies").val("");
           emptyMovieInfo();
        } else {
            alert("Already Added.");
        }
    }
});

// Reset Movie List
$('#movieReset').on("click", function() {
    movies.splice(4, newMovies.length);
    addButtons();
    sessionStorage.clear();
})

// Choose Your Movie
$(document).on("click",".movie", function() {
    movie = $(this).attr("data-name");
    
    //Find Movie Info
    findMovieInfo();
    random = Math.floor(Math.random() * movies.length);
    selectedQuestion = questions[random];
    renderGame();
    checkMovie();
    $(".movie").attr("disabled", true);
    $('#nextQuestion').html("<button type='button' class='btn btn-primary' id='nextQuestionBtn'>Next Question</button>");
    $('#changeMovie').html("<button type='button' class='btn btn-primary' id='changeMovieBtn'>Change Movie</button>");
    
});
// Start the Game
// When the game begins, Director is 0, Actor is 1, Year is 2, and Rated is 3. When Year is drawn and answered correct, Year is removed and Rated becomes number 2 in the array. This game needs logic to determine how many questions are left, and then assign a number to each question after each correct answer, and then assign the number to correct response. 

// Conditional logic has to match the random number to the first slot in the array. It has to know which item is in that slot, so it knows yourAnswer will match with the right director, actor, year, or rated variables.

$(document).on("click","#submitAnswer", function(e) {
    e.preventDefault();
    yourAnswer = $("#yourAnswer").val();
    if (random == 0) {
        if(yourAnswer == director) {
            $("#answer").text("You're Right! " + movie + " is directed by: " + director);
            rightAnswer();
        } else {
            wrongAnswer();
        }
    }
    if (random == 1) {
        if(yourAnswer == actor) { //if three answers have been answered correctly. there will not be a 3 array
            $("#answer").text("You're Right! " + movie + " stars " + actor);
            rightAnswer();
        } else {
            wrongAnswer();
        }
    }
    if (random == 2) {
        if(yourAnswer == year) { //if two answers have been answered correctly, there will not be a 2 array
            $("#answer").text("You're Right! " + movie + " came out in " + year);
            rightAnswer();                            
        } else {
            wrongAnswer();
        }
    }
    if (random == 3) { //if one answer has been answered correclty, there will not be a 3 array
        if(yourAnswer == rating) {
            rightAnswer();
            $("#answer").text("You're Right! " + movie + " is rated: " + rating);
        } else {
            wrongAnswer();
        }
    }
    $("#score").text(count);
    $("#yourAnswer").val("");
});
$(document).on("click","#nextQuestionBtn", function() {
    renderGame();
});
$(document).on("click","#changeMovieBtn", function() {
    $('.movie').attr("disabled", false);
    // reset Questions list
    questions = JSON.parse(sessionStorage.getItem("questions"));
    emptyMovieInfo();

});
function checkMovie() {
    if(isAMovie == "False") {
        alert("This is not a movie");
        // remove button that is not a movie
        // find the button by title
        $("[data-name=" + movie + "]").remove();
        // remove movie question info
        emptyMovieInfo();
        // remove the button
        movies.splice($.inArray(movie, movies), 1);
    }
}
function emptyMovieInfo() {
    $("#movieTitle, #questions, #answersInput").empty();
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
    $("#questions").text("");
    $("#yourAnswer").attr("disabled", false);
    random = Math.floor(Math.random() * questions.length);
    console.log(random);
    selectedQuestion = questions[random];
    $("#questions").text(selectedQuestion);
    $("#answersInput").html("<form><input type='text' id='yourAnswer' /><input type='submit' id='submitAnswer' type='button' class='btn btn-warning ml-1' value='Submit'></form>");
}
function removeQuestion() {
    removeQuestionID = questions.indexOf(selectedQuestion);
    questions.splice(removeQuestionID, 1);
}
function GiphyAPI() {
    var giphyKey = "1CmJ9SOa5JjxE3R5S0TZxd9XDVWRMGSZ";
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=Pulp+Fiction&&limit=50&api_key=" + giphyKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        random = Math.floor(Math.random() * response.data.length);
        console.log(random);
        giphyImage = response.data[random].images.fixed_height.url;
        console.log(giphyImage);
        $("#giphyImage img").attr("src",giphyImage);
    });
}
function rightAnswer() {
    $("#yourAnswer").attr("disabled", true);
    GiphyAPI();
    count++; //keep score
    removeQuestion();
}
function wrongAnswer() {
    $("#giphyImage img").attr("src", ""); // turn the image blank
    $("#answer").text("You're Wrong. Try again."); // show wrong answer text

}
addButtons();

//Issues
// Reset button doesn't remove buttons
// Non-movies not being removed or alerted
// Question's answer not matching (incorrect response)
// After last question, need to ask user to pick new movie
// Leaderboard