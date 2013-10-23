/*
    Functionality:
        mouseIn: object expands outwards
        mouseOut: object contracts inwards
        mouseClick: pulse heartbeat
*/

function heartPulse(inputEvent, inputElement)
{
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    if (ellipse.attr('cy') < 60)
        pulseAmount*=-1;
    else if (ellipse.attr('cy') > 540)
        pulseAmount*=-1;
    raphaelElement.animate({cy: ellipse.attr('cy')- pulseAmount}, 1000, 'elastic');
}

function expand(inputEvent, inputElement)
{
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    raphaelElement.animate({transform: 's2.0',ry: ellipse.attr('ry')+10}, 1000, 'elastic');
    raphaelElement.attr('fill', '#7E0000');
} 

function contract(inputEvent, inputElement)
{
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    raphaelElement.attr('fill', '#E61919');
    raphaelElement.animate({transform: 's0.6',ry: ellipse.attr('ry')-10}, 1000, 'elastic');
}

function stateTest2()
{
	window.canvasWidth = 500;
    window.canvasHeight = 600;
    window.pulseAmount = 30;
    window.canvas = Raphael(1, 1, canvasWidth, canvasHeight);     
    var rectangle = canvas.rect(0, 0, canvasWidth, canvasHeight);
    window.ellipse = canvas.ellipse(150, 300, 50, 50);   
    ellipse.attr('fill','#E61919');
	var stateTable = {
        states: [
        {
            name: "reactionary",
            transitions: [
                {
                    input: "click", 
                    action: heartPulse,
                    endState: "reactionary"
                },
                {
                    input: "mouseIn",
                    action: expand,
                    endState: "reactionary"
                },
                {
                    input: "mouseOut",
                    action: contract,
                    endState: "reactionary"
                }]
        }]
    };
    window.stateMachine = new StateMachine(stateTable, ellipse.node);
}
window.onload = stateTest2;