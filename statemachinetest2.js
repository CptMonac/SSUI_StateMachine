/*
    Functionality:
        mouseIn: object expands outwards
        mouseOut: object contracts inwards
        mouseClick: pulse heartbeat
*/

function heartPulse(inputEvent, inputElement)
{
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    if (ellipse.attr('cy') != center.y)
        raphaelElement.animate({cy: ellipse.attr('cy')- pulseAmount, ry: radius+10, rx: radius-10}, 250, 'bounce'); //easeout
    else
        raphaelElement.animate({cy: ellipse.attr('cy')+ pulseAmount, ry: radius-10, rx: radius+10}, 250, 'easeIn', function(){heartPulse(inputEvent, inputElement)});
}

function expand(inputEvent, inputElement)
{
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    raphaelElement.animate({transform: 's2.0',ry: radius+10}, 500, 'elastic');
    raphaelElement.attr('fill', '#7E0000');
} 

function contract(inputEvent, inputElement)
{
    var raphaelElement = canvas.getById(inputElement.raphaelid);
    raphaelElement.attr('fill', '#E61919');
    raphaelElement.animate({transform: 's0.6',ry: radius, rx: radius}, 500, 'elastic');
}

function stateTest2()
{
	window.canvasWidth = 500;
    window.canvasHeight = 600;
    window.pulseAmount = 50;
    window.canvas = Raphael(1, 1, canvasWidth, canvasHeight);     
    var rectangle = canvas.rect(0, 0, canvasWidth, canvasHeight);
    window.center = {x: 150, y: 300};
    window.radius = 50;
    window.ellipse = canvas.ellipse(center.x, center.y, radius, radius);   
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