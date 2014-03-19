

function init() {
    this.wins = 0;
    this.winsWithSwitch = 0;
    this.plays = 0;

    this.stateMachine = new StateMachine();
    this.view = new View(stateMachine);
}
