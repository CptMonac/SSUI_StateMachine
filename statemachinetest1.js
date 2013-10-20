/*
    Functionality:
        onClick: change behaviour and functionality (red: attract, blue: repulse)
        mouseMove: red? follow mouse: repulsed from mouse
        mouseUp: pulse heartbeat
*/

function changeBehavior(inputEvent, inputElement)
{
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    if (raphaelElement.attr('fill') == 'red')
        raphaelElement.attr('fill', 'blue');
    else
        raphaelElement.attr('fill', 'red');
}

function moveAction(inputEvent, inputElement)
{
    var mouse = {'x': inputEvent.clientX, 'y': inputEvent.clientY};
    if (mouse.x > canvasWidth)
        mouse.x = canvasWidth;
    if (mouse.y > canvasHeight)
        mouse.y = canvasHeight;

    var raphaelElement = canvas.getById(inputElement.raphaelid);
    if (circle.attr('fill') == 'red')
        circle.animate({cx: mouse.x, cy: mouse.y}, 300, 'easeInOut');
    else
    {    
        if (mouse.x > canvasWidth/2)
            mouse.x = 40;
        else
            mouse.x = canvasWidth - 40;
        circle.animate({cx: mouse.x, cy: mouse.y}, 300, 'back-in');
    }
}

function heartPulse(inputEvent, inputElement)
{
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    if (raphaelElement.attr('fill') == 'red')
        raphaelElement.animate({transform: 's1.05'}, 1000, 'elastic');
    else
        raphaelElement.animate({transform: 's0.90'}, 1000, 'elastic');
}

function repulsedMouse(inputEvent, inputElement)
{
    console.log('not implemented');
}

function stateTest1()
{
	window.canvasWidth = 500;
    window.canvasHeight = 600;
    window.canvas = Raphael(1, 1, canvasWidth, canvasHeight);     
    var rectangle = canvas.rect(0, 0, canvasWidth, canvasHeight);
    window.circle = canvas.circle(150, 100, 50);   // Create circle at x = 150, y = 100, with radius 30
	circle.attr("fill", "red");

	var circleStateTable = {
        states: [
        {
            name: "attraction",
            transitions: [
                {
                    input: "click", 
                    action: changeBehavior,
                    endState: "repulsion"
                },
                {
                    input: "mouseUp",
                    action: heartPulse,
                    endState: "repulsion"
                }]
        },
        {
            name: "repulsion",
            transitions: [
                {
                    input: "click",
                    action: changeBehavior,
                    endState: "attraction"
                },
                {
                    input: "mouseUp",
                    action: heartPulse,
                    endState: "attraction"
                }
            ]
        }
        ]
    };

    var canvasStateTable = {
        states: [
        {
            name: "listener",
            transitions: [
                {
                    input: "mouseMove",
                    action: moveAction,
                    endState: "listener"
                }]
        }]
    };

    window.circleStateMachine = new StateMachine(circleStateTable, circle.node);
    window.canvasStateMachine = new StateMachine(canvasStateTable, window);
}
window.onload = stateTest1;