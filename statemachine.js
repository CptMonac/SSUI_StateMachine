/*Standard State Machine Implementation Techniques
	(1). Nested Switch Statement
		+ Good for simple state machines
		+ Operations/Actions can be invoked anywhere
		+ Good for real-time applications because of minimal memory allocation
		- Not very modular/reusable/extensible
		- Can't create multiple instances of state machine
		- Can't pass around/access anonymously
	(2). State-Machine object with distributed conditional-checks
		* Each state responsible for determining successor state
		* Object contains array of states
		* Operations/Actions implemented using object methods
		+ Allows multiple instances of state machine
		+ Operations/Actions can be invoked anywhere by passing object around
		+ Machine state and operations can be accessed anonymously
		- Not very modular/reusable/extensible
		- Logic is hard to follow because it is distributed across multiple objects (Indirection)
	(3). State-Machine object with centralized lookup table
		* Object contains array of states
		* Each state has a list of outgoing transitions
		* Each transition has target state, action to perform, triggering event
		+ Allows multiple instances of state machine
		+ Operations/Actions can be invoked anywhere by passing object around
		+ Machine state and operations can be accessed anonymously
		+ Modular/reusable/extensible
		+ Easy to read/write
*/

function StateMachine(description, elementToAttach)
{
	//Initialize object fields
	this.stateTable = {};
	this.currentState = null;
	this.surface = elementToAttach;
	var self = this;

	//Create event for 30ms timer
	this.timerObject = window.setInterval(function()
	{
		var timerEvent = new Event('timer');
		elementToAttach.dispatchEvent(timerEvent);
	}, 30);
	
	//Translate raw input event into suitable string
	this.categorizeEvent = function(event)
	{ 
		switch(event.type)
		{
			case 'mousedown':
				return 'mouseDown';
			case 'mouseup':
				return 'mouseUp';
			case 'click':
				return 'click';
			case 'mousemove':
				return 'mouseMove';
			case 'mouseover':
				return 'mouseIn';
			case 'mouseout':
				return 'mouseOut';
			case 'keypress':
				return 'keyPress';
			case 'timer':
				return 'timerTick30Ms';
			default:
				return 'unhandled';
		}
	}
	//Update current state
	this.updateState = function(input_event, input_type)
	{
		var tempTransition = null;
		for (var i = 0; i < self.currentState.length; i++)
		{
			tempTransition = self.currentState[i];
			if (input_type === tempTransition.input)
			{
				tempTransition.action(input_event, self.surface);
				self.currentState = self.stateTable[tempTransition.endState];
				break;
			}
		}
	}
	//Respond to input event
	this.handleEvent = function(inputEvent)
	{
		var inputType = self.categorizeEvent(inputEvent);
		self.updateState(inputEvent, inputType);
	}
	this.resetTimer = function(inputTime)
	{
		window.clearInterval(self.timerObject);
		self.timerObject = window.setInterval(function()
		{
			var timerEvent = new Event('timer');
			elementToAttach.dispatchEvent(timerEvent);
		}, inputTime);
	}
	//Add event listeners for all required events
	elementToAttach.addEventListener('mousedown', this.handleEvent, false);
	elementToAttach.addEventListener('mouseup', this.handleEvent, false);
	elementToAttach.addEventListener('click', this.handleEvent, false);
	elementToAttach.addEventListener('mousemove', this.handleEvent, false);
	elementToAttach.addEventListener('mouseover', this.handleEvent, false);
	elementToAttach.addEventListener('mouseout', this.handleEvent, false);
	window.addEventListener('keypress', this.handleEvent, false);
	elementToAttach.addEventListener('timer', this.handleEvent, false);

	//Parse state description into state table
	this.parseDescription = function(inputDescription)
	{
		//Record initial state
		var initialState = inputDescription.states[0].name;
		var tempState = null;
		//Create state table
		for (var i = 0; i < inputDescription.states.length; i++)
		{
			tempState = inputDescription.states[i];
			self.stateTable[tempState.name] = tempState.transitions;
		}

		//Initialize state machine
		self.currentState = self.stateTable[initialState];
	}(description);
}
