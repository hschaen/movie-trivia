// =================== Table of Contents =========================== //

// 0. Declarations
// 1. Layout
// 2. Game Logic
// 3. Movie Logic
// 4. Click Functions

// =================== 0. Declarations =========================== //
// declare our variables
// numbers
var count = 0;
var random = 0;
var randomGif = 0;
var removeQuestionID = 0;
var answerItem = 0;
// arrays
var movies = [];
var newMovies = [];
var ques = [];
var questions = [];
var answerList = [];
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
var giphyImage = '';
// =================== 1. Layout =========================== //

//Start with some movies
if(sessionStorage.getItem("movies") === null) { //Check to see if there are any new movies added
    movies = ["The Matrix", "The Big Lebowski", "Finding Nemo", "Pulp Fiction"];
} else {
    movies = JSON.parse(sessionStorage.getItem("movies")); //show list of new movies if present
}
//Render movie buttons
var addButtons = function() {
    $("#movie-buttons").empty();
    for (var i = 0; i < movies.length; i++) {
        var newButton = $("<button>");
        newButton.text(movies[i]);
        newButton.attr("data-name", movies[i]);
        newButton.attr("type", "button");
        newButton.addClass("movie btn btn-primary mr-1 mt-3");
        $("#movie-buttons").append(newButton);
    }
}
function renderGame() {
    $("#movieTitle").text(movie);
    $("#questions").text("");
    $("#yourAnswer").attr("disabled", false);
    randomNum(); // pick a random number
    console.log("random: " + random);
    selectedQuestion = questions[random]; // pick a random question from our list
    $("#questions").text(selectedQuestion);
    $("#answersInput").html("<form><input type='text' id='yourAnswer' /><input type='submit' id='submitAnswer' type='button' class='btn btn-warning ml-1' value='Submit'></form>");
}
function displayControls() {
    $(".movie").attr("disabled", true);
    $('#nextQuestion').html("<button type='button' class='btn btn-primary' id='nextQuestionBtn'>Next Question</button>");
    $('#changeMovie').html("<button type='button' class='btn btn-primary' id='changeMovieBtn'>Change Movie</button>");
}
function GiphyAPI() {
    var giphyKey = "1CmJ9SOa5JjxE3R5S0TZxd9XDVWRMGSZ"; // change this key to your own
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + movie + "&limit=50&api_key=" + giphyKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        randomGif = Math.floor(Math.random() * response.data.length); //pick a random Gif
        giphyImage = response.data[randomGif].images.fixed_height.url; // get url of random gif
        $("#giphyImage img").attr("src",giphyImage); //set url to img src
    });
}
// =================== 2. Game Logic =========================== //
// Ask a question
var questions = [
    "Who directed this movie?", // position 0
    "Who was the lead actor?", // position 1
    "What year did this film come out?", // position 2
    "What was this movie rated?" // position 3
];
sessionStorage.setItem("questions", JSON.stringify(questions)); //store list of questions
function alreadyAdded() {
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
}
function startGame() {
    yourAnswer = $("#yourAnswer").val();
    answerItem = questions.indexOf(selectedQuestion); 
    if (answerList[answerItem] == "director") {
        if(yourAnswer.toLowerCase() == director) {
            $("#answer").text("You're Right! " + movie + " is directed by: " + director);
            rightAnswer();
        } else {
            wrongAnswer();
        }
    }
    if (answerList[answerItem] == "actor") {
        if(yourAnswer.toLowerCase() == actor) {
            $("#answer").text("You're Right! " + movie + " stars " + actor);
            rightAnswer();
        } else {
            wrongAnswer();
        }
    }
    if (answerList[answerItem] == "year") {
        if(yourAnswer.toLowerCase() == year) {        
            $("#answer").text("You're Right! " + movie + " came out in " + year);
            rightAnswer();                            
        } else {
            wrongAnswer();
        }
    }
    if (answerList[answerItem] == "rating") {
        if(yourAnswer.toLowerCase() == rating) {
            rightAnswer();
            $("#answer").text("You're Right! " + movie + " is rated: " + rating.toUpperCase());
        } else {
            wrongAnswer();
        }
    }
    $("#score").text(count);
    $("#yourAnswer").val("");
}
function removeQuestion() {
    removeQuestionID = questions.indexOf(selectedQuestion);
    questions.splice(removeQuestionID, 1);
    answerList.splice(removeQuestionID, 1);
}

function rightAnswer() {
    $("#yourAnswer").attr("disabled", true);
    GiphyAPI();
    count++; //keep score
    setTimeout(removeQuestion, 1000);
}
function wrongAnswer() {
    $("#giphyImage img").attr("src", ""); // turn the image blank
    $("#answer").text("You're Wrong. Try again."); // show wrong answer text

}
function storeQuestions() {
        for (var m = 0; m < questions.length; m++) {
        ques[m] = questions[m];
    }
}
function randomNum() {
    random = Math.floor(Math.random() * answerList.length);
}
// =================== 3. Movie Logic =========================== //

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
        director = response.Director.toLowerCase();
        actor = response.Actors.toLowerCase();
        year = response.Year.toLowerCase();
        rating = response.Rated.toLowerCase();
        answerList.push("director","actor","year","rating");
    });
}
// =================== 4. Click Functions =========================== //

//Add a movie
$("#submit-movie").click(function(e) {
    e.preventDefault();
    sessionStorage.clear();
    alreadyAdded();
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
    renderGame();
    checkMovie();
    displayControls();
    
});
// Start the Game
$(document).on("click","#submitAnswer", function(e) {
    e.preventDefault();
    startGame();
});

// Change the Selected Question
$(document).on("click","#nextQuestionBtn", function() {
    renderGame();
});

// Change the Selected Movie
$(document).on("click","#changeMovieBtn", function() {
    $('.movie').attr("disabled", false);
    // reset Questions list
    questions = JSON.parse(sessionStorage.getItem("questions"));
    emptyMovieInfo();

});

storeQuestions();
addButtons();

//Issues
// Reset button doesn't remove buttons
// Non-movies not being removed or alerted
// Question's answer not matching (incorrect response)
// After last question, need to ask user to pick new movie
// Leaderboard
// Store questions correct per movie. Each movie you should have a max score of 4.