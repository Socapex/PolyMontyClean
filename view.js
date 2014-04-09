

function StateMachine(host) {
    var _that = this;
    var state = 0;
    this.readyToClick = true;
    this.firstSelectedDoor = -1;

    // console.log("tomate");

    this.reset = function () {
        state = 0;
        this.firstSelectedDoor = -1;
        view.closeAllDoors();
        view.reset();
        _that.readyToClick = true;
    };

    this.resetHost = function ()
    {
        host.moveToAnimated(68, 52, 500, function() {
            host.say("Choose a door to win a car!", stateMachine.reset)
        });
    }

    this.nextState = function (clickedDoor)
    {

        //var resultText = document.getElementById("Results");
        var winsText = document.getElementById("Wins");
        var winsWithSwitchText = document.getElementById("WinsWithSwitch");
        var playsText = document.getElementById("Plays");
        //var instructText = document.getElementById("Instructions");


        // Dont allow click if animating stuff
        if (!_that.readyToClick)
            return;

        switch(state)
        {
            // Selectionner premiere porte
            case 0:

                _that.readyToClick = false;
                firstSelectedDoor = clickedDoor.getID();

                clickedDoor.select();

                host.closeBubble(function() {
                    host.say("I will now open an empty door.", function() {
                        host.wait(1000, function() {
                            host.moveToAnimated(50, 50, 1000, view.showADoor)
                        })
                    })
                })

                state += 1;
                break;

            // Change de porte?
            case 1:
                if(clickedDoor._opened)
                    break;

                _that.readyToClick = false;
                
                clickedDoor.open();

                // Override the door saying we can open the door, or else BAD THINGS HAPPEN TO KITTENS OMG!
                _that.readyToClick = false;

                if (clickedDoor._winner)
                {
                    wins += 1;
                    host.say("Congratulations, you have won!", function() {
                        host.wait(1000, stateMachine.resetHost)
                    });

                    if (clickedDoor.getID() != firstSelectedDoor)
                    {
                        winsWithSwitch += 1;
                    }
                }

                else
                {
                    host.say("You lost, better luck next time.", function() {
                        host.wait(1000, stateMachine.resetHost)
                    });
                }

                plays += 1;

                winsText.innerHTML = "Wins ratio: " + (wins/plays).toFixed(2) + ".";
                winsWithSwitchText.innerHTML = "Wins with switch ratio: " + (winsWithSwitch/plays).toFixed(2) + ".";
                playsText.innerHTML = "You have played " + plays + " times.";

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

        elegibleDoors[doorToShow].open(stateMachine);

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
            angle += TARGET_ANGLE / (FPS * 1); // 1 seconds
            if (angle <= TARGET_ANGLE) {
                clearInterval(interval);
                return;
            }
            // Animation
            var ROTATION = "perspective( 600px ) rotateY(" + angle + "deg)";
            $(_doorDiv).css("transform", ROTATION).css("-webkit-transform", ROTATION);
        }, 1000 / FPS);

        // Tell the statemachine we can open a new door
        stateMachine.readyToClick = true;
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




        // SETTERS / GETTERS

        this.getAnimating = function()
        {
            return animating_;
        }
    }

    var instance = new Host();

    return function() { return instance; }
})();