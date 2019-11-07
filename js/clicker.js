const Clicker = function() {
	// This is basically a makeshift namespace.
	let self = this;
	let canvas = document.getElementById("game2_canvas");
	let context = canvas.getContext("2d");
	let bCanvas = document.createElement("canvas");
	let bContext = bCanvas.getContext("2d");
	let worldHeight = 135 * 2;
	let worldWidth = 256 * 2;

	this.sprite = o => {
		let sprite = {};
		sprite._frameIndex = 0;
		sprite._tick = 0;
		sprite._frameTicks = o._frameTicks || 0;
		sprite._frameLength = o._frameLength || 1;

		sprite.context_ = o.context_;
		sprite._width = o._width;
		sprite._height = o._height;
		sprite._loc = { x: o._x, y: o._y };
		sprite.array = new Array();
		sprite._image = new Image();
		sprite._image.src = `./media/clicker/monster/${o._resource}.png`;
		sprite._xmlhttp = new XMLHttpRequest();
		sprite.frames;
		sprite.renderReady = false;

		sprite._xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				sprite.frames = JSON.parse(this.responseText).frames;
				sprite._frameLength = Object.keys(sprite.frames).length; // Size of the object.
				for (var name in sprite.frames) sprite.array.push(name);
				console.log(sprite.array);
				sprite.renderReady = true; // Image Loaded Ready for render.
				delete sprite._xmlhttp; //remove this since we don't need it anymore.
			}
		};
		sprite._xmlhttp.open("GET", `./media/clicker/monster/${o._resource}.json`, true);
		sprite._xmlhttp.send();

		sprite.update = function() {
			sprite._tick += 1;

			if (sprite._tick > sprite._frameTicks) {
				sprite._tick = 0;
				sprite._frameIndex++;
				sprite._frameIndex %= sprite._frameLength;
				console.log(sprite._frameIndex);
			}
		};

		sprite.render = function() {
			if (!sprite.renderReady) return;
			//sprite.context.clearRect(0, 0, that.width, that.height);
			//console.log(this);
			//console.log(sprite);
			let name = this.array[sprite._frameIndex];
			//console.log(this.array[sprite._frameIndex]);
			//console.log(sprite.frames[name]);
			bContext.drawImage(
				sprite._image,
				sprite.frames[name].frame.x,
				sprite.frames[name].frame.y,
				sprite.frames[name].frame.w,
				sprite.frames[name].frame.h,
				sprite._loc.x, // Might make this a parameter at render.
				sprite._loc.y, // Might make this a parameter at render.
				sprite._width,
				sprite._height
			);
		};

		return sprite;
	};

	//bird.render();

	this.getCursorPosition = (canvas, event) => {
		let rect = canvas.getBoundingClientRect();
		let x = event.clientX - rect.left;
		let y = event.clientY - rect.top;
		x = Math.floor(x * (bCanvas.width / canvas.width));
		y = Math.floor(y * (bCanvas.height / canvas.height));
		return { x: x, y: y };
	};

	this.clearCanvas = () => {
		bContext.resetTransform();
		bContext.fillStyle = "#000000";
		bContext.fillRect(0, 0, bContext.canvas.width, bContext.canvas.height);
		bContext.fillStyle = "#FF0000";
		bContext.fillRect(150, 56, 8, 8);
	};

	this.DrawSquare = (x, y, w, h, c = "#FF0000") => {
		bContext.fillStyle = c;
		bContext.fillRect(x - w / 2, y - h / 2, w, h);
	};

	this.Draw = (x, y) => {
		// console.log("bCanvas W", bCanvas.canvas.width);
		// console.log("bCanvas H", bCanvas.canvas.height);
		// console.log("Canvas W", context.canvas.width);
		// console.log("Canvas H", context.canvas.height);
		context.drawImage(
			bContext.canvas,
			0,
			0,
			bCanvas.width,
			bCanvas.height,
			0,
			0,
			context.canvas.width,
			context.canvas.height
		);
	};

	var bird = this.sprite({
		context_: bContext,
		_width: 122,
		_height: 114,
		_x: 100,
		_y: 100,
		_frameTicks: 10,
		_resource: "bird"
	});

	this.Update = progress => {
		// Update the state of the world for the elapsed time since last render
		bird.update();
		bird.render();
	};

	this.Loop = timestamp => {
		var progress = timestamp - lastRender;
		//console.log("loop test");
		this.Update(progress);
		this.Draw();
		this.clearCanvas();

		lastRender = timestamp;
		window.requestAnimationFrame(this.Loop);
	};

	canvas.addEventListener("mousedown", function(e) {
		let coord = self.getCursorPosition(canvas, e);
		self.DrawSquare(coord.x, coord.y, 8, 8);
	});

	this.Resize = (width, height, height_width_ratio) => {
		let dpi = window.devicePixelRatio;
		if (height / width > height_width_ratio) {
			canvas.setAttribute("height", Math.floor(width * height_width_ratio));
			canvas.setAttribute("width", Math.floor(width));
		} else {
			canvas.setAttribute("height", Math.floor(height));
			canvas.setAttribute("width", Math.floor(height / height_width_ratio));
		}
		context.imageSmoothingEnabled = false;
		context.globalCompositeOperation = "copy";
		context.shadowBlur = 20;
		context.shadowColor = "black";
	};

	function getRelativeCoords(params) {
		return { x: event.offsetX, y: event.offsetY };
	}

	bCanvas.width = worldWidth;
	bCanvas.height = worldHeight;

	this.Resize(document.documentElement.clientWidth, document.documentElement.clientHeight, worldHeight / worldWidth);
	this.clearCanvas();
	var lastRender = 0;
	window.requestAnimationFrame(this.Loop);
};

Clicker.prototype = { constructor: Clicker };

//window.onload = new Clicker();
