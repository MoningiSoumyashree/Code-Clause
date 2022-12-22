"use strict";

//An array of images for the game
const gameImages = [
    "images/one.png",
    "images/two.png",
    "images/three.png",
    "images/four.png",
    "images/five.png",
    "images/six.png",
    "images/seven.png",
    "images/eight.png",
    "images/nine.png",
    "images/ten.png"
];

//Variables to maintain state
var prevImage = null;
var numOfImagesFound = 0;

//Image object
function Image(id, name) {
    this._id = id;
    this._name = name;

    //Show the image
    this.show = function() {
        $("#" + this._id + " img").slideDown(300);
    };

    //Hide the image
    this.hide = function() {
        $("#" + this._id + " img").slideUp(300);
    };
}

//Board object
function Board(parentDivId) {
    //A counter to keep track of number of clicks
    this._clickscounter = 0;

    //A dictionary to hold => key: image-id and value: Image() object
    this._imageObjects = {};

    //Images parent div id
    this._parentDivId = parentDivId;

    //This function initializes the game board
    this.initialize = function() {
        //Create all the Image() objects and store them in this._imageObjects
        var imageObj;
        for(var j = 0; j < 2; ++j) {
            for(var i = 0; i < gameImages.length; ++i) {
                imageObj = new Image((""+j+i), gameImages[i]);
                this._imageObjects[(""+j+i)] = imageObj;
                $("#" + this._parentDivId).append('<div id="'+imageObj._id+'"><img src='+imageObj._name+'></div>');
            }
        }

        //Shuffle the images
        this.shuffleImages();
    };

    //This function resets the game board
    this.reset = function() {
        //Set counter back to zero
        this._clickscounter = 0;

        //Reset the counter (# turns) display
        $("#score").text("0");

        //Hide the images and make their parent divs visible
        $("#" + this._parentDivId + " div img").hide();
        $("#" + this._parentDivId + " div").css("visibility", "visible");

        //Reset the state variables
        prevImage = null;
        numOfImagesFound = 0;

        //Reset the result element
        $("#result").text("");

        //Shuffle the images and fill the board again
        this.shuffleImages();
    };

    //This function gets called when the div (containing image) is clicked
    this.divClicked = function(divElement) {
        var imageId = divElement.attr("id");

        //Get the image object
        var currImage = this._imageObjects[imageId];

        if($("#" + currImage._id + " img").is(":hidden")) {
            //Show the image
            currImage.show();

            if(prevImage === null) {
                prevImage = currImage;
            }
            else {
                if(prevImage._name !== currImage._name) {
                    setTimeout(function() {
                        prevImage.hide();
                        currImage.hide();
                        prevImage = null;
                    }, 300);
                }
                else {
                    //If the prevImage and currImage are same, then hide their parent div
                    $("#" + prevImage._id + " img").parent().css("visibility", "hidden");
                    $("#" + currImage._id + " img").parent().css("visibility", "hidden");
                    numOfImagesFound++;
                    prevImage = null;
                }
            }

            //Increase the counter and update the counter display on board
            this._clickscounter++;
            $("#score").text(this._clickscounter);

            //Check if the # of images guessed is the total # of images
            if(numOfImagesFound === gameImages.length) {
                $("#result").text("It took you " + this._clickscounter + " guesses");
                prevImage = null;
                numOfImagesFound = 0;
            }
        }
    };

    //This function performs random shuffling of the images
    this.shuffleImages = function() {
        var parentDiv = $("#" + this._parentDivId);
        var childrenDivs = parentDiv.children();
        while(childrenDivs.length) {
            parentDiv.append(childrenDivs.splice(Math.floor(Math.random() * childrenDivs.length), 1)[0]);
        }
    };
}

//Magic starts here
function main() {
    //Initialize the board
    var board = new Board("gameBoardHalloweenImages");
    board.initialize();

    //Bind event handlers to the "click" event
    $("#gameBoardHalloweenImages div").click(function() { board.divClicked($(this)); });
    $("#resetButton").click(function() { board.reset(); });
}

$(document).ready(main());
