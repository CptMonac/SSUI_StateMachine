// Creates canvas 320 × 200 at 10, 50
function start()
{
	var displ = 15;
	var paper = Raphael(10, 50, 900, 700);

	// Creates circle at x = 50, y = 40, with radius 10
	var circle = paper.circle(150, 100, 80);
	// Sets the fill attribute of the circle to red (#f00)
	circle.attr("fill", "red");

	circle.node.onclick = function ()
	{
    	color = circle.attr('fill');
    	if (color === 'red')
    	{
    		circle.attr("fill", "blue");
    		circle.animate({transform: 's1.1'}, 500, 'elastic');
    	}
    	else
    	{
    		circle.attr('fill', 'red');
    		circle.animate({transform: 's1.0'}, 400, 'elastic');
    	}
    }

}
window.onload = start;