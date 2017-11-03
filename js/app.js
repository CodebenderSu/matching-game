//The Font Awesome classes to be inserted into each card.
var cards = [
    "fa-anchor",
    "fa-anchor",
    "fa-bicycle",
    "fa-bicycle",
    "fa-bolt",
    "fa-bolt",
    "fa-bomb",
    "fa-bomb",
    "fa-cube",
    "fa-cube",
    "fa-diamond",
    "fa-diamond",
    "fa-leaf",
    "fa-leaf",
    "fa-paper-plane-o",
    "fa-paper-plane-o"
    ];
var flippedCards = [];
var matchesMade = 0;
var moves = 0;
var score, time, timer;
var started = false;

/*
 * This initializes the game, closing the modal if it's open,
 * resetting the scoreboard, calling the generate() function,
 * and adding an event listener for cards being clicked
 * to call the matchMaker function.
 */
function gameStart() {
  //Hides the modal if it's open
  if ($("#gameOverModal").hasClass("show")) {
    $("#gameOverModal").modal("hide");
  };
  //Resets the moves and stars score
  moves = 0;
  $(".moves").html(moves);
  score();
  flippedCards = [];
  //Generates the cards
  generate(cards);
  //Click listener to flip a card
  $(".card").click(function() {
    matchMaker(this);
  });
};
/*
 * This passes the array to the shuffle function,
 * and then adds them to the DOM under the <div class="deck"> element
 */
function generate(array) {
  $(".deck").empty();
  shuffle(array);
  array.forEach(function createHTML(item) {
    $(".deck").append('<div class="card">\n\
                        <figure class="front"></figure>\n\
                        <figure class="back">\n\
                          <i class="fa ' + item + ' fa-2x"></i>\n\
                        </figure>\n\
                      </div>');
  });
};
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
      }
  return array;
};
/*
 * Tests for if the card that is passed into the function has
 * been flipped. If so, it tests for number of flipped cards
 * to determine whether to test for a match, unflip the cards,
 * or do nothing.
 */
function matchMaker(card) {
  //Starts the game clock if it hasn't been
  if (started == false) {
    gameClock(true);
  };
  if ($(card).hasClass("flipped") == false) {
    //Each card adds 2 values, hence testing for array length of 4
    if (flippedCards.length < 4) {
      $(card).addClass("flipped");
      var cardType = $(card).find("i").attr("class");
      //Both are added for purpose of comparisons and ease of access
      flippedCards.push(card, cardType);
      //Determines what to do when there are two flipped cards
      if (flippedCards.length == 4) {
        moves++;
        $(".moves").html(moves);
        score();
        if (flippedCards[1] == flippedCards[3]) {
          setTimeout(match, 1800);
        } else {
          setTimeout(unflip, 1800);
        };
      };
    };
  };
};
/*
 * simply adds a .match class to the cards and provides a
 * counter to test for game completion
 */
function match() {
  $(flippedCards[0]).find("figure.back").addClass("match");
  $(flippedCards[2]).find("figure.back").addClass("match");
  flippedCards = [];
  matchesMade++;
  //Ends the game when all matches have been made
  if (matchesMade == 8) {
    gameClock(false);
    matchesMade = 0;
    gameOver();
  };
};
//flips the cards back over and clears the array
function unflip() {
  $(flippedCards[0]).removeClass("flipped");
  $(flippedCards[2]).removeClass("flipped");
  flippedCards = [];
};
//adjusts the score according to number of moves made
function score() {
  if (moves == 0) {
    $(".fa-star-o").addClass("fa-star").removeClass("fa-star-o");
  } else if (moves == 13) {
    $(".fa-star").last().addClass("fa-star-o").removeClass("fa-star");
  } else if (moves == 17) {
    $(".fa-star").last().addClass("fa-star-o").removeClass("fa-star");
  } else if (moves == 21) {
    $(".fa-star").last().addClass("fa-star-o").removeClass("fa-star");
  };
  return;
};
//Opens a modal and resets the game
function gameOver() {
  //Populate modal with score data
  $(".stars i").clone().appendTo($(".final-score").text("Score: "));
  $(".final-moves").text("Moves: " + moves);
  $(".final-time").text("Time: " + time);
  $("#gameOverModal").modal("show");
  //Reset the game on click
  $(".close").click(function() {
    gameStart();
  });
  $(".btn").click(function() {
    gameStart();
  });
};
/*
 * Provides all functionality for the game clock, taking
 * a boolean value passed to it to turn it on or off.
 */
function gameClock(boolean) {
  started = boolean;
  function resetClock() {
    $(".time").text("00:00");
  };
  //Game clock start
  if (boolean) {
    //Grabs a starting point
    var startDate = new Date();
    //Formats time in 00:00 format
    function formatTime(num) {
      return ((num < 10 ? "0" : "") + num);
    };
    /*
     * Each interval, the difference between the starting point
     * and current time determines number of seconds passed.
     */
    timer = setInterval(function() {
      var totalSeconds = (new Date() - startDate) / 1000;
      var minutes, seconds;
      minutes = Math.floor(totalSeconds / 60);
      seconds = Math.floor(totalSeconds % 60);
      minutes = formatTime(minutes);
      seconds = formatTime(seconds);
      time = minutes.toString() + ":" + seconds.toString();
      $(".time").text(time);
    }, 1000);
  //Game clock stop
  } else {
    clearInterval(timer);
    setTimeout(resetClock(), 500);
  };
};
//Runs the game on page load
$(document).ready(function() {
  gameStart();
  //Restart button click listener
  $(".restart").click(function() {
    gameClock(false);
    gameStart();
  });
});
