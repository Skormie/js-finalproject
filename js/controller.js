const Controller = function() {
	this.left = new Controller.ButtonInput();
	this.right = new Controller.ButtonInput();
	this.camLeft = new Controller.ButtonInput();
	this.camRight = new Controller.ButtonInput();
	this.zoomIn = new Controller.ButtonInput();
	this.zoomOut = new Controller.ButtonInput();
	this.up = new Controller.ButtonInput();

	this.keyPressed = function(type, key_code) {
		var down = type == "keydown";

		if (key_code == 37) {
			this.left.getInput(down);
		} else if (key_code == 32) {
			this.up.getInput(down);
		} else if (key_code == 39) {
			this.right.getInput(down);
		}

		if (key_code == 65) {
			this.camLeft.getInput(down);
		} else if (key_code == 68) {
			this.camRight.getInput(down);
		}
		if (key_code == 49) {
			this.zoomIn.getInput(down);
		} else if (key_code == 50) {
			this.zoomOut.getInput(down);
		}
	};
};

Controller.prototype = { constructor: Controller };

Controller.ButtonInput = function() {
	this.active = this.down = false;
};

Controller.ButtonInput.prototype = {
	constructor: Controller.ButtonInput,
	getInput: function(down) {
		if (this.down != down) this.active = down;
		this.down = down;
	}
};
