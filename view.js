

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


        // console.log("patate");

        switch(state)
        {
            // Selectionner premiere porte
            case 0:
                firstSelectedDoor = clickedDoor._id;
                console.log(firstSelectedDoor);

                clickedDoor.select();
                view.showADoor();

                state += 1;
                break;

            // Change de porte?
            case 1:
                if(!clickedDoor._opened)
                {
                    clickedDoor.open();

                    var resultText = document.getElementById("Results");
                    if (clickedDoor._winner)
                    {
                        wins += 1;
                        resultText.innerHTML = "You have won!";

                        if (clickedDoor._id != firstSelectedDoor)
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
                }

                var winsText = document.getElementById("Wins");
                var winsWithSwitchText = document.getElementById("WinsWithSwitch");
                var playsText = document.getElementById("Plays");
                var instructText = document.getElementById("Instructions");

                winsText.innerHTML = "You have won " + wins + " times."
                winsWithSwitchText.innerHTML = "You have won " + winsWithSwitch + " times when switching."
                playsText.innerHTML = "You have played " + plays + " times."
                instructText.innerHTML = "Click a door to try again...";

                break;

            // Reset everything
            case 2:
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


    this.reset = function () {

        if (this._selected)
            document.getElementById("door" + _id).style.backgroundColor = "grey";

        this._selected = false;
        this._opened = false;
        this._winner = false;


    };

    this.open = function () {
        // Logique
        this._opened = true;

        // Animation
        var ROTATION = "rotateY(-45deg)";
        $(_doorDiv).css("transform", ROTATION).css("-webkit-transform", ROTATION)
                .css("-ms-transform", "rotate(-45deg)");
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

    // this.open = open;
    this.close = close;

    this.onOpen = function(callback) {
        _onOpenCallback = callback;
    };




    // SETTERS / GETTERS
    this.setWinner = function () {
        this._winner = true;
    };


    // Click
    _doorDiv.on("click", function() {
        if (_onOpenCallback)
            _onOpenCallback(_that);//.call(this);

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