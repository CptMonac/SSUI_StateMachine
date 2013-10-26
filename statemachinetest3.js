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
    circle.drag(dragMove, dragStart, dragEnd);
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
    
    if (typeof raphaelElement.concentricContainer === 'undefined')
    {
        for (var i = 0; i < 6; i++)
        {
            var circle = canvas.circle(center.x, center.y, circleRadius+(3*i));
            circle.attr('stroke', 'red');
            raphaelElement.concentricContainer.push(circle);
        }
    }
    raphaelElement.concentricContainer.animate({transform: 's0'}, 500, 'linear');
}

function dragStart()
{
    this.center = {'x': this.attr('cx'), 'y': this.attr('cy')};
    this.concentricContainer = canvas.set();
    this.stop();
    circleContainer.exclude(this);
    this.attr('fill', '#f00');
    this.animate({r:circleRadius+10, opacity: 0.9},500, ">");

    for (var i = 0; i < 6; i++)
    {
        var circle = canvas.circle(this.center.x, this.center.y, circleRadius+(3*i));
        circle.attr('stroke', 'red');
        this.concentricContainer.push(circle);
    }
}

function dragMove(dx, dy)
{
    this.touchLocation = {'x': this.center.x+dx, 'y': this.center.y+dy};
    this.concentricContainer.attr('cx',this.touchLocation.x);
    this.concentricContainer.attr('cy',this.touchLocation.y);
} 

function dragEnd()
{
    this.attr('fill', '#a30000');
    this.concentricContainer.animate({transform: 's0'}, 1000, 'linear');
    this.animate({r:circleRadius, opacity: 0, cx: this.touchLocation.x, cy: this.touchLocation.y},800, "<");
    circleContainer.push(this);
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
                }]
        },
        {
            name: "control",
            transitions: [
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