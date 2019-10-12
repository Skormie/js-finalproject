const Engine = function(time_step, update, render) {
	this.accumulated_time = 0;
	(this.animation_frame_request = undefined),
		(this.time = undefined),
		(this.time_step = time_step),
		(this.updated = false);

	this.update = update;
	this.render = render;

	this.run = function(time_stamp) {
		this.animation_frame_request = window.requestAnimationFrame(this.handleRun);

		this.accumulated_time += time_stamp - this.time;
		this.time = time_stamp;

		if (this.accumulated_time >= this.time_step * 3) {
			this.accumulated_time = this.time_step;
		}

		while (this.accumulated_time >= this.time_step) {
			this.accumulated_time -= this.time_step;

			this.update(time_stamp);

			this.updated = true;
		}

		if (this.updated) {
			this.updated = false;
			this.render(time_stamp);
		}
	};

	this.handleRun = time_step => {
		this.run(time_step);
	};
};

Engine.prototype = {
	constructor: Engine,

	start: function() {
		this.accumulated_time = this.time_step;
		this.time = window.performance.now();
		this.animation_frame_request = window.requestAnimationFrame(this.handleRun);
	},

	stop: function() {
		window.cancelAnimationFrame(this.animation_frame_request);
	}
};

//Set the frame rate
var fps = 60,
	//Get the start time
	start = Date.now(),
	//Set the frame duration in milliseconds
	frameDuration = 1000 / fps,
	//Initialize the lag offset
	lag = 0;

const Core2 = function(fps, update, draw) {
	this.draw = draw;
	this.update = update;
	this.fps = fps;
	this.handleRun = fps => {
		//Calcuate the time that has elapsed since the last frame
		var current = Date.now(),
			elapsed = current - start;
		start = current;
		//Add the elapsed time to the lag counter
		lag += elapsed;

		//Update the frame if the lag counter is greater than or
		//equal to the frame duration
		while (lag >= frameDuration) {
			//Update the logic
			this.update(lagOffset, elapsed);
			//Reduce the lag counter by the frame duration
			lag -= frameDuration;
		}
		//Calculate the lag offset and use it to render the sprites
		var lagOffset = lag / frameDuration;
		this.draw(lagOffset, elapsed);

		//Frame data output:
		actualFps = Math.floor(1000 / elapsed);
		//console.log(actualFps);
		window.requestAnimationFrame(this.handleRun);
	};
};

Core2.prototype = {
	constructor: Core2,

	start: function() {
		window.requestAnimationFrame(this.handleRun);
		// 	this.time_elapsed = this.fps;
		// 	this.time = window.performance.now();
		// 	this.afr = window.requestAnimationFrame(this.handleRun);
	}

	// stop: function() {
	// 	window.cancelAnimationFrame(this.afr);
	// }
};
