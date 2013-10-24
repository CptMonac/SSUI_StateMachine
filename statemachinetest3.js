/*
    Functionality:
        timer: pulsing circles
        dragAction: pulse circles faster

        http://bl.ocks.org/mbostock/4503672
        http://jsfiddle.net/Fy8vD/
*/
function addCircle()
{
    //Initialize circle parameters
    var minValue = {'x': circleRadius, 'y': circleRadius};
    var maxValue = {'x': canvasWidth - circleRadius, 'y': canvasHeight - circleRadius};
    var centerX = Math.floor(Math.random() * (maxValue.x - minValue.x + 1)) + minValue.x;
    var centerY = Math.floor(Math.random() * (maxValue.y - minValue.y + 1)) + minValue.y;

    //Draw circle
    var circle = canvas.circle(centerX, centerY, circleRadius);
    circle.attr('fill', '#a30000');
    var stateMachine = new StateMachine(window.stateTable, circle.node);
}

function moveCircle(inputEvent, inputElement)
{
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    var mousePosition = {'x': inputEvent.clientX, 'y': inputEvent.clientY};
    var center = {'x': raphaelElement.attr('cx'), 'y': raphaelElement.attr('cy')};
    var horizontal_distance = (mousePosition.x - mouseClick.x);
    var vertical_distance = (mousePosition.y - mouseClick.y);

    raphaelElement.attr('cx', center.x + horizontal_distance);
    raphaelElement.attr('cy', center.y + vertical_distance);
}

function pulseHeart(inputEvent, inputElement)
{
    if (timerCount < 100)
        timerCount++;
    else
    {
        timerCount = 0;
        var raphaelElement = canvas.getById(inputElement.raphaelid);
        raphaelElement.animate({opacity: 0.0, transform: 's0.1'}, 100, 'easeOut', function(){pulseDisappear(inputEvent, inputElement);});
    }
}

function pulseDisappear(inputEvent, inputElement)
{
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    raphaelElement.animate({opacity: 1.0}, 100, 'easeOut', function(){pulseEmergence(inputEvent, inputElement);});
}

function pulseEmergence(inputEvent, inputElement)
{
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    raphaelElement.animate({opacity: 0.0, transform: 's1.2'}, 100, 'easeOut');
}


function emitPulsar(inputEvent, inputElement)
{
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    if (inputEvent.type === 'mousedown')
    {
        mouseClick.x = inputEvent.clientX;
        mouseClick.y = inputEvent.clientY;
    }
    console.log('pulsar!!!');
    
}

function stateTest3()
{
	window.canvasWidth = 500;
    window.canvasHeight = 600;
    window.circleCount = 5;
    window.mouseClick = {'x': 0, 'y': 0};
    window.canvas = Raphael(1, 1, canvasWidth, canvasHeight);     
    var rectangle = canvas.rect(0, 0, canvasWidth, canvasHeight);
    window.circleRadius = 50;
    window.timerCount = 0;
    window.stateTable = {
        states: [
        {
            name: "freedom",
            transitions: [
                {
                    input: 'timerTick30Ms', 
                    action: pulseHeart,
                    endState: 'freedom'
                },
                {
                    input: 'mouseDown',
                    action: emitPulsar,
                    endState: 'control'
                }]
        },
        {
            name: "control",
            transitions: [
                {
                    input: 'mouseMove',
                    action: moveCircle,
                    endState: 'control'
                },
                {
                    input: 'mouseOut',
                    action: emitPulsar,
                    endState: 'freedom'
                },
                {
                    input: 'mouseUp',
                    action: emitPulsar,
                    endState: 'freedom'
                }]
        }]
    };

    //Populate canvas with random pulsing circles
    for (var i = 0; i < circleCount; i++)
    {
        addCircle();
    }
}
window.onload = stateTest3;