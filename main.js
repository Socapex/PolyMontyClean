

function init() {
    this.wins = 0;
    this.winsWithSwitch = 0;
    this.plays = 0;

    this.stateMachine = new StateMachine();
    this.view = new View(stateMachine);

    hostTest();
}

function hostTest() {
    var host = getHost();
    host.moveTo(110, 40)
    host.moveToAnimated(55, 40, 1000, function() {
        host.say("Hello, World!", function() {
            host.wait(3000, function() {
                host.fall(function() {
                    host.wait(3000, function() {
                        host.getUp(function() {
                            host.moveToAnimated(-50, 40, 2000);
                        });
                    })
                })
            })
        });
    });
}
