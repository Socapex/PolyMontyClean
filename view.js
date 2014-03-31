

function StateMachine() {
    var state = 0;
    this.firstSelectedDoor = -1;

    // console.log("tomate");

    this.reset = function () {
        state = 0;
        this.firstSelectedDoor = -1;
    };

    this.nextState = function (clickedDoor)
    {

        var resultText = document.getElementById("Results");
        var winsText = document.getElementById("Wins");
        var winsWithSwitchText = document.getElementById("WinsWithSwitch");
        var playsText = document.getElementById("Plays");
        var instructText = document.getElementById("Instructions");


        // console.log("patate");

        switch(state)
        {
            // Selectionner premiere porte
            case 0:
                firstSelectedDoor = clickedDoor.getID();
                console.log(firstSelectedDoor);

                clickedDoor.select();
                view.showADoor();

                state += 1;
                break;

            // Change de porte?
            case 1:
                if(clickedDoor._opened)
                    break;


                
                clickedDoor.open();

                if (clickedDoor._winner)
                {
                    wins += 1;
                    resultText.innerHTML = "You have won!";

                    if (clickedDoor.getID() != firstSelectedDoor)
                    {
                        winsWithSwitch += 1;
                    }
                }

                else
                {
                    resultText.innerHTML = "You lost :(";
                }

                plays += 1;
                state += 1;
                


                winsText.innerHTML = "You have won " + wins + " times."
                winsWithSwitchText.innerHTML = "You have won " + winsWithSwitch + " times when switching."
                playsText.innerHTML = "You have played " + plays + " times."
                instructText.innerHTML = "Click a door to try again...";

                break;

            // Reset everything
            case 2:

                resultText.innerHTML = "";
                instructText.innerHTML = "Choose a door to win a car!";

                stateMachine.reset();
                view.closeAllDoors();
                view.reset();

                break;

            default:
                
        }
    };
};





function View(stateMachine) {
    var that = this;
    var doors = new Array;



    for (var i = 0; i < 3; ++i) {
        doors[i] = new Door((i + 1), "door" + (i + 1), stateMachine);
    }

    // Set winning door
    var winningDoor = Math.floor(Math.random()*3);
    doors[winningDoor].setWinner();

    this.closeAllDoors = function () {
        for (var i = 0; i < 3; ++i) {
            doors[i].close();
        }
    };


    this.reset = function () {

        for (var i = 0; i < 3; ++i) {
            doors[i].reset();
        }

        // Set winning door
        var winningDoor = Math.floor(Math.random()*3);
        doors[winningDoor].setWinner();

    };





    this.door = function (nb) {
        return doors[nb];
    };

    this.showADoor = function () {
        // console.log("showADoor");
        var elegibleDoors = new Array;

        for (var i = 0; i < 3; ++i)
        {
            // console.log("\nDoor", i + 1);
            // console.log("Winner:", doors[i]._winner);
            // console.log("Selected:", doors[i]._selected);
            // console.log("Opened:", doors[i]._opened);
            
            if (!doors[i]._winner && !doors[i]._selected)
            {
                elegibleDoors.push(doors[i]);
            }
        }

        var doorToShow = Math.floor(Math.random() * elegibleDoors.length);
        elegibleDoors[doorToShow].open();

    };
};










function Door(id, divName, stateMachine) {
    var _that = this;
    var _id = id;
    var _doorDiv = $("#" + divName);
    var _onOpenCallback = stateMachine.nextState;
    this._selected = false;
    this._opened = false;
    this._winner = false;


    // Set goat image for everybody
    $("#room" + _id).css("background-image", "url(chevre.png)");
    $("#room" + _id).css("background-size", "cover");
    // $("#room" + _id).css("background-position", "center");

    this.reset = function () {

        if (this._selected)
            document.getElementById("door" + _id).style.backgroundColor = "grey";

        if (this._winner)
            $("#room" + _id).css("background-image", "none");


        $("#room" + _id).css("background-image", "url(chevre.png)");
        $("#room" + _id).css("background-size", "cover");
        
        this._selected = false;
        this._opened = false;
        this._winner = false;


    };




    this.open = function () {
        // Logique
        this._opened = true;

        var angle = 0.0;
        var FPS = 60.0;
        var TARGET_ANGLE = -100.0;
        var interval = setInterval(function () {
            angle += TARGET_ANGLE / (FPS * 2); // 2 seconds
            if (angle <= TARGET_ANGLE) {
                clearInterval(interval);
                return;
            }
            // Animation
            var ROTATION = "perspective( 600px ) rotateY(" + angle + "deg)";
            $(_doorDiv).css("transform", ROTATION).css("-webkit-transform", ROTATION);
        }, 1000 / FPS);
    };

    function close() {
        //Logique
        this._opened = false;

        // Animation
        var ROTATION = "rotateY(0deg)";
        $(_doorDiv).css("transform", ROTATION).css("-webkit-transform", ROTATION)
                .css("-ms-transform", "rotate(0deg)");
    }

    this.select = function() {
        this._selected = true;
        // console.log("door" + _id);
        document.getElementById("door" + _id).style.backgroundColor = "blue";
    };

    this.close = close;

    this.onOpen = function(callback) {
        _onOpenCallback = callback;
    };




    // SETTERS / GETTERS
    this.setWinner = function () {
        this._winner = true;
        $("#room" + _id).css("background-image", "url(car.png)");
        $("#room" + _id).css("background-size", "cover");
        $("#room" + _id).css("background-position", "center");


    };

    this.getID = function () {
        return _id;
    };


    // Click
    _doorDiv.on("click", function() {
        if (_onOpenCallback)
            _onOpenCallback(_that);

        // if (!_opened)
        // {
        //     open();
        // }
        // else
        // {
        //     close();
        // }

    });
}

/**
 * Gets the singleton instance of Host.
 */
var getHost = (function() {
    /**
     * Represents our game's host.
     */
    function Host() {
        // We block animations while one is already executing
        var animating_ = false;

        /**
         * Closes the host's text bubble.
         * @param callback A function that will be called when
         * the animation is done.
         */
        function closeBubble(callback) {
            if ($("#bubble").css("opacity") > 0) {
                $("#bubble").fadeTo(500, 0, function() {
                    if (callback)
                        callback();
                });
            } else {
                callback();
            }
        }
        this.closeBubble = closeBubble;

        /**
         * Displays a text bubble above the host.
         * @param text The text to put in the bubble.
         * @param callback A function that will be called when the
         * animation is completed.
         */
        this.say = function(text, callback) {
            if (animating_)
                return;
            animating_ = true;
            $("#bubble").text(text);
            $("#bubble").fadeTo(500, 1, function() {
                animating_ = false;
                if (callback)
                    callback();
            });
        }

        /**
         * Moves the host to a new position without any animation.
         * @param x The new x coordinate
         * @param y The new y coordinate
         */
        this.moveTo = function(x, y) {
            if (animating_)
                return;
            $("#host").css("left", x + "%").css("top", y + "%");
        }

        /**
         * Moves the host to a new position with an animation.
         * @param x The new x coordinate
         * @param y The new y coordinate
         * @param duration The time in milliseconds the animation will last.
         * @param callback A function that will be called when the animation
         *                 is complete.
         */
        this.moveToAnimated = function(x, y, duration, callback) {
            if (animating_)
                return;
            animating_ = true;
            closeBubble(function() {
                $("#host").animate(
                    {left:x + "%", top:y + "%"},
                    duration,
                    "swing",
                    function() {
                        animating_ = false;
                        if (callback)
                            callback();
                    }
                );
            });
        }

        /**
         * Makes the host fall.
         * @param callback A function that will be called when the animation
         *                 is complete.
         */
        this.fall = function(callback) {
            if (animating_)
                return;
            animating_ = true;
            closeBubble(function() {
                $("#host").css("transform", "rotateZ(-90deg)")
                    .css("-webkit-transform", "rotateZ(-90deg)");
                wait(1000, function() {
                    animating_ = false;
                    if (callback)
                        callback();
                });
            });
        }

        /**
         * Makes the host get up after he fell.
         * @param callback A function that will be called when the animation
         *                 is complete.
         */
        this.getUp = function(callback) {
            if (animating_)
                return;
            animating_ = true;
            closeBubble(function() {
                $("#host").css("transform", "rotateZ(0deg)")
                    .css("-webkit-transform", "rotateZ(0deg)");
                wait(1000, function() {
                    animating_ = false;
                    if (callback)
                        callback();
                });
            });
        }

        /**
         * Waits millis milliseconds before calling callback.
         * @param callback A function that will be called when the wait
         *                 finishes.
         */
        function wait(millis, callback) {
            setTimeout(callback, millis);
        }

        this.wait = wait;
    }

    var instance = new Host();

    return function() { return instance; }
})();