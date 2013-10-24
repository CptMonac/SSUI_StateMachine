/*
    Functionality: Beacon
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
    circle.attr('opacity', 0.0);
    circle.node.centerX = centerX;
    circle.node.centerY = centerY;
    var stateMachine = new StateMachine(window.stateTable, circle.node);
    stateMachine.resetTimer(100);
    circleContainer.push(circle);
}

function moveCircle(inputEvent, inputElement)
{
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    var mousePosition = {'x': inputEvent.clientX, 'y': inputEvent.clientY};
    var horizontal_distance = (mousePosition.x - mouseClick.x);
    var vertical_distance = (mousePosition.y - mouseClick.y);

    raphaelElement.attr('cx', inputElement.centerX + horizontal_distance);
    raphaelElement.attr('cy', inputElement.centerY + vertical_distance);
}

function pulseHeart(inputEvent, inputElement)
{
    if (timerCount < 100)
        timerCount++;
    else
    {
        timerCount = 0;
        var raphaelElement = canvas.getById(inputElement.raphaelid);
        circleContainer.animate(
        {
            "0%":{transform: 's0.2', opacity: 0.0},
            "20%":{opacity: 1.0},
            "80%":{transform: 's1.2', opacity: 0.0}
        },1500, 'easeOut');
    }
}

function emitPulsar(inputEvent, inputElement)
{
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    if (inputEvent.type === 'mousedown')
    {
        mouseClick.x = inputEvent.clientX;
        mouseClick.y = inputEvent.clientY;
        inputElement.centerX = raphaelElement.attr('cx');
        inputElement.centerY = raphaelElement.attr('cy');
        raphaelElement.stop();
        circleContainer.exclude(raphaelElement);
        raphaelElement.attr('opacity', 1.0);
        raphaelElement.attr('fill', '#f00');
        raphaelElement.transform('s1.0');
    }
    else 
    {
        raphaelElement.attr('fill', '#a30000');
        circleContainer.push(raphaelElement);
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
    window.circleContainer = canvas.set();   
    var rectangle = canvas.rect(0, 0, canvasWidth, canvasHeight);
    window.circleRadius = 15;
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