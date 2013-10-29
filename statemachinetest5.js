/*
    Functionality: Beacon
        timer: pulsing circles
        dragAction: emanate pulsar

        http://bl.ocks.org/mbostock/4503672
        http://jsfiddle.net/Fy8vD/
        ------------------------------
        http://checkthis.com/--flu
        https://developer.mozilla.org/en-US/demos/detail/urban-arteries, http://www.clicktorelease.com/code/urban-arteries/
        https://code.google.com/p/android-labs/source/browse/trunk/NoiseAlert/src/com/google/android/noisealert/SoundMeter.java
        http://www.funf.org/about.html
        --------------------------
        Project Ideas:
        Real-time traffic visualization
        Interactive map of wifi locations/hotspots
        Interactive map of bus/train locations
        Real-time bus arrival/departure times combined with urban arteries
        Map of water fountains/restrooms
        Map of blind crosswalks in pgh

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
    circle.attr('fill', '#c7141a');
    circle.attr('stroke', '#c7141a');
    circle.attr('stroke-width', 3);
    circle.drag(dragMove, dragStart, dragEnd);
    circle.pulsar = false;
 
    //Add circle to state machine
    var stateMachine = new StateMachine(window.stateTable, circle.node);
    stateMachine.resetTimer(750);
    circleContainer.push(circle);
}

function handleKeyPress(inputEvent, inputElement)
{
    if (inputEvent.keyCode === 32)
    {
        if (keyPressCount < circleContainer.length)
            keyPressCount++;
        else
        {
            console.log('new circle');
            keyPressCount = 1;
            addCircle();
        }
    }
}

function pulseHeart(inputEvent, inputElement)
{
    //Add sphere of influence field to circle
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    if (raphaelElement.pulsar)
    {
        var field = raphaelElement.clone();
        field.attr('stroke', '#c7141a');
        field.attr('fill-opacity', 0);
        var expandAnimation = Raphael.animation({r: 160, "stroke-width": 1, "stroke-opacity": 1e-6, stroke: 'brown'},6000, 'linear', function(){this.remove();});
        field.animate(expandAnimation);
    }
    else
    {
        raphaelElement.animate(
        {
            "0%":{transform: 's0.5', opacity: 0.0},
            "20%":{opacity: 1.0},
            "100%":{transform: 's1.2', opacity: 0.0}
        },700, 'easeOut');
    }
}

function dragStart()
{
    this.center = {'x': this.attr('cx'), 'y': this.attr('cy')};
    this.pulsar = true;
    this.attr('fill', '#c0392b');
    this.animate({r:circleRadius+10, opacity: 0.9},500, ">");
}

function dragMove(dx, dy)
{
    this.attr('cx',this.center.x + dx);
    this.attr('cy',this.center.y + dy);
} 

function dragEnd()
{
    this.attr('fill', '#c7141a');
    this.animate({r:circleRadius, opacity: 1.0},500, "<");
    this.pulsar = false;
}

function stateTest3()
{
	window.canvasWidth = 500;
    window.canvasHeight = 600;
    window.pulseComplete = true;
    window.fieldAttenuation = 6;
    window.canvas = Raphael(1, 1, canvasWidth, canvasHeight); 
    window.circleContainer = canvas.set();   
    var rectangle = canvas.rect(0, 0, canvasWidth, canvasHeight);
    window.circleRadius = 15;
    window.timerCount = 0;
    window.keyPressCount = 1;
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
                    input: 'keyPress',
                    action: handleKeyPress,
                    endState: 'freedom'
                }]
        }]
    };

    //Populate canvas with random pulsing circle
    addCircle();
}
window.onload = stateTest3;