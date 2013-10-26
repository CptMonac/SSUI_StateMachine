/*
    Functionality: Beacon
        timer: pulsing circles
        dragAction: emanate pulsar

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
    raphaelElement.attr('cx', inputEvent.pageX);
    raphaelElement.attr('cy', inputEvent.pageY);
    raphaelElement.concentricContainer.attr('cx', inputEvent.pageX);
    raphaelElement.concentricContainer.attr('cy', inputEvent.pageY);
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
    var center = {'x': raphaelElement.attr('cx'), 'y': raphaelElement.attr('cy')};
    
    if (inputEvent.type === 'mousedown')
    {
        raphaelElement.attr('cx', inputEvent.pageX);
        raphaelElement.attr('cy', inputEvent.pageY);
        raphaelElement.concentricContainer = canvas.set();
        raphaelElement.stop();
        circleContainer.exclude(raphaelElement);
        //raphaelElement.attr('fill', 'red');
        raphaelElement.attr('fill', '#f00');
        raphaelElement.animate({r:circleRadius+10, opacity: 0.9},500, ">");

        for (var i = 0; i < 6; i++)
        {
            var circle = canvas.circle(center.x, center.y, circleRadius+(3*i));
            circle.attr('stroke', 'red');
            raphaelElement.concentricContainer.push(circle);
        }
        raphaelElement.concentricContainer.animate({transform: 's2.0'}, 500, 'linear');
    }
    else 
    {
        raphaelElement.attr('fill', '#a30000');
        if (typeof raphaelElement.concentricContainer != 'undefined')
            raphaelElement.concentricContainer.remove(); 
        raphaelElement.animate({r:circleRadius, opacity: 0},500, "<");
        circleContainer.push(raphaelElement);
    }   
}

function stateTest3()
{
	window.canvasWidth = 500;
    window.canvasHeight = 600;
    window.circleCount = 5;
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