
var portes = [];
var canvas;
var canvas2d;

// Peut-etre faire une porte par default? Pas trop sur comment les "new" marchent en javascript
//
//var porte = {
//    x : 0,
//    y : 0,
//    width : 0,
//    height : 0,
//    selected : false,
//    fillStyle : "rgba(200, 0, 0, 1)",
//    prize : false
//};


function onLoad()
{
    canvas = document.getElementById('canvas');
    canvas.addEventListener("mousedown", doMouseDown, false);

    if (canvas.getContext){
        canvas2d = canvas.getContext('2d');

        var doorWidth = 50;
        var doorHeight = 100;
        var padding = (canvas.width - (doorWidth * 3)) / 4;

        portes = initPortes(padding, doorWidth, doorHeight);
        setPrize();
        drawDoors();
        drawText();

    }    
}







// CALCULES STUFF

function calculateProbabilities()
{
    var numSelect = 0;

    portes.forEach(function(porte){
        if (!porte.selected)
            numSelect++;
    });

    return 1/numSelect*100;
}








// DRAWING TEXT STUFF

function drawText()
{
    // TODO: Trouver une maniere cool de gerer le text et la traduction :)

    //On doit clear le text a tout les fois qu'on ecrit!
    clearTextArea();

    canvas2d.font = "14px Helvetica";
    canvas2d.fillStyle = "Black";
    canvas2d.fillText("Current probabilities: " + Math.floor(calculateProbabilities()) + "%" , 5, 30);
}

function clearTextArea()
{
    var maxY = portes[0].y;
    canvas2d.clearRect(0, 0, canvas.width, maxY);


}









// DRAWING DOOR STUFF

function initPortes(padding, doorWidth, doorHeight)
{
    var arr = [];
    for (var i = 0; i < 3; i++) 
    {
        var porte = {
            x : (padding * (i+1)) + (doorWidth*i),
            y : canvas.height - doorHeight,
            width : doorWidth,
            height : doorHeight,
            selected : false,
            fillStyle : "rgba(200, 0, 0, 1)",
            winning : false,
            shown : false
        };

        arr.push(porte);
    }

    return arr;
}

function setPrize()
{
    var porteGagnante = Math.floor(Math.random()*3);
    console.log("Porte gagnante: " + porteGagnante);
    portes[porteGagnante].winning = true;
}

function drawDoors()
{
    portes.forEach(function(porte) {
        canvas2d.fillStyle = porte.fillStyle;
        canvas2d.fillRect(porte.x, porte.y, porte.width, porte.height);
    });
}

function doMouseDown(event)
{
    // On check tout les parents puisque le mouseclick retourn la valeur de x, y
    // sur la PAGE et non le CANVAS. Mais le canvas peut etre dans un div dans un div etc.
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    console.log("clicked x= " + canvasX + " y= " + canvasY );
    checkInsideDoor(canvasX, canvasY);
}

function checkInsideDoor(x, y)
{
    portes.forEach(function(porte) {
        if (x > porte.x && x < porte.x + porte.width)
            if (y > porte.y && y < porte.y + porte.height)
                selectDoor(porte);
    });

    drawDoors();
}

function selectDoor(porte)
{
    console.log("clicked inside door");
    deselectAllDoors();

    porte.selected = true;
    porte.fillStyle = "blue";

    drawText();
    //openDoor();
}

function deselectAllDoors()
{
    portes.forEach(function(porte) {
        porte.selected = false;
        porte.fillStyle = "rgba(200, 0, 0, 1)";
    });
}

function openDoor()
{
    portes.forEach(function(porte){
        if(porte.shown)
            return;
    });

    portes.forEach(function (porte){
       if(!porte.selected && !porte.winning)
       {
           porte.shown = true;
           porte.fillStyle = "gray";
           return;
       }


    });
}