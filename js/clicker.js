const Clicker = function() {
	// This is basically a makeshift namespace.
	let self = this;
	let canvas = document.getElementById("game2_canvas");
	let context = canvas.getContext("2d");
	let bCanvas = document.createElement("canvas");
	let bContext = bCanvas.getContext("2d");
	let background = new Image();
	let clickable = new Array();
	let textObjects = new Array();
	let damage = 10;
	let deltaTime = 0;
	this.i;
	background.src = "./media/clicker/background/parallax-mountain.png";
	this.worldHeight = 135 * 2;
	this.worldWidth = 256 * 2;

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
		bContext.drawImage(background, 0, 0, bContext.canvas.width, bContext.canvas.height); // Each frame I'm rewriting the canvas with the background image.
		//bContext.fillStyle = "#FF0000";
		//bContext.fillRect(150, 56, 8, 8);
	};

	this.DrawSquare = (x, y, w, h, c = "#FF0000") => {
		//bContext.fillStyle = c;
		bContext.fillRect(x - w / 2, y - h / 2, w, h);
	};

	this.Draw = (x, y) => {
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

	this.Update = deltaTime => {
		// Update the state of the world for the elapsed time since last render
		birdMonster.sprite.update();
		birdMonster.sprite.render(birdMonster.loc.x, birdMonster.loc.y);
		textObjects.forEach(text => {
			//console.log(deltaTime);
			text.update(deltaTime);
			text.render();
		});
		birdMonster.renderHp();
	};

	//var lastTs = Date.now();
	var delta = 0;
	this.Loop = timestamp => {
		deltaTime = timestamp - lastRender;
		//console.log("loop test");
		//deltaTime = Math.min(deltaTime, 0.15);
		deltaTime = deltaTime / 100; //- 6.9;
		deltaTime = Math.min(deltaTime, 0.15);
		//now = Date.now();
		//delta = (now - lastTs) / 100;
		//lastTs = now;
		this.Update(deltaTime);
		this.Draw();
		this.clearCanvas();

		lastRender = timestamp;
		window.requestAnimationFrame(this.Loop);
	};

	canvas.addEventListener("mousedown", function(e) {
		let coord = self.getCursorPosition(canvas, e);
		clickable.forEach(element => {
			if (
				// Checking if the clicked location is within our clickable objects area.
				coord.x >= element.loc.x &&
				coord.x <= element.loc.x + element.width &&
				coord.y >= element.loc.y &&
				coord.y <= element.loc.y + element.height
			) {
				// Here I'm getting the current clicked pixel and checking if it is alpha.
				let pixel = element.frame.getImageData(coord.x - element.loc.x, coord.y - element.loc.y, 1, 1).data;
				if (pixel[3]) {
					if (element.hasOwnProperty("health")) {
						if (element.health > 0) {
							element.health -= damage;
							textObjects.push(
								self.text({
									_context: bContext,
									_x: coord.x,
									_y: coord.y,
									_txt: damage,
									_color: "#FF0000"
								})
							);
						} else if (element.health < 0) element.health = 0;
					}
				}
			}
		});
		self.DrawSquare(coord.x, coord.y, 8, 8);
	});

	this.Resize = (width, height, height_width_ratio) => {
		let dpi = window.devicePixelRatio;
		if (height / width > height_width_ratio) {
			canvas.height = Math.floor(width * height_width_ratio);
			canvas.width = Math.floor(width);
		} else {
			canvas.height = Math.floor(height);
			canvas.width = Math.floor(height / height_width_ratio);
		}
		context.imageSmoothingEnabled = false;
		context.globalCompositeOperation = "copy";
		context.shadowBlur = 20;
		context.shadowColor = "black";
	};

	bCanvas.width = this.worldWidth;
	bCanvas.height = this.worldHeight;

	this.Resize(
		document.documentElement.clientWidth - 10,
		document.documentElement.clientHeight - 10,
		this.worldHeight / this.worldWidth
	);

	// Defining Object Classes
	this.text = o => {
		let text = {};
		text.loc = [o._x, o._y];
		text.gravity = [0, -10];
		text.velocity = [10, 10];
		text.context = o._context;
		text.context.font = "12px Minecraft";
		text.txt = o._txt;
		text.color = o._color || "#FF0000";

		text.render = (color = text.color) => {
			text.context.fillStyle = color;
			text.context.fillText(text.txt, text.loc[0], text.loc[1]);
		};

		text.update = deltaTime => {
			text.loc[0] = text.loc[0] + text.velocity[0] * deltaTime;
			text.loc[1] = text.loc[1] - text.velocity[1] * deltaTime;
			text.velocity[0] = text.velocity[0] + text.gravity[0] * deltaTime;
			text.velocity[1] = text.velocity[1] + text.gravity[1] * deltaTime;
		};

		return text;
	};

	var hitText = this.text({
		_context: bContext,
		_x: 100,
		_y: 100
	});

	// Sprite Class
	this.sprite = o => {
		let sprite = {};
		sprite.frameIndex = 0;
		sprite.tick = 0;
		sprite.frameTicks = o._frameTicks || 0;
		sprite.frameLength = o._frameLength || 1;
		sprite.context = o._context;
		sprite.width = o._width;
		sprite.height = o._height;
		sprite.loc = { x: o._x, y: o._y };
		sprite.array = new Array();
		sprite.image = new Image();
		sprite.image.src = `./media/clicker/monster/${o._resource}.png`;
		sprite.xmlhttp = new XMLHttpRequest();
		sprite.frames;
		sprite.renderReady = false;
		sprite.currentFrame = document.createElement("canvas");
		sprite.currentFrameContext = document.createElement("canvas").getContext("2d");
		sprite.currentFrameContext.imageSmoothingEnabled = false;
		sprite.gravity = [0, -2];
		sprite.velocity = [2, 2];

		sprite.xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				sprite.frames = JSON.parse(this.responseText).frames;
				sprite.frameLength = Object.keys(sprite.frames).length; // Size of the object.
				for (var name in sprite.frames) sprite.array.push(name);
				console.log(sprite.array);
				sprite.renderReady = true; // Image Loaded Ready for render.
				delete sprite.xmlhttp; //remove this since we don't need it anymore.
			}
		};
		sprite.xmlhttp.open("GET", `./media/clicker/monster/${o._resource}.json`, true);
		sprite.xmlhttp.send();

		sprite.update = function() {
			sprite.tick += 1;

			if (sprite.tick > sprite.frameTicks) {
				sprite.tick = 0;
				sprite.frameIndex++;
				sprite.frameIndex %= sprite.frameLength;
			}
		};

		sprite.render = function(x, y) {
			if (!sprite.renderReady) return; // Check if the image has been loaded.
			//sprite.context.clearRect(0, 0, that.width, that.height);
			//console.log(this);
			//console.log(sprite);
			let name = this.array[sprite.frameIndex];
			//console.log(this.array[sprite._frameIndex]);
			//console.log(sprite.frames[name]);
			sprite.currentFrame.width = sprite.frames[name].frame.w;
			sprite.currentFrame.height = sprite.frames[name].frame.h;
			sprite.currentFrameContext.clearRect(0, 0, sprite.currentFrame.width, sprite.currentFrame.height); // Clear the temp canvas that is going to hold our current frame.
			sprite.currentFrameContext.drawImage(
				// Draw the current frame to our canvas.
				sprite.image,
				sprite.frames[name].frame.x,
				sprite.frames[name].frame.y,
				sprite.frames[name].frame.w,
				sprite.frames[name].frame.h,
				0, //sprite.loc.x, // Might make this a parameter at render.
				0, //sprite.loc.y, // Might make this a parameter at render.
				sprite.width,
				sprite.height
			);
			sprite.context.drawImage(sprite.currentFrameContext.canvas, x, y); // Draw the current frame canvas to our buffer canvas.
		};

		return sprite;
	};

	var bird = this.sprite({
		_context: bContext,
		_width: 122,
		_height: 114,
		_x: 100,
		_y: 100,
		_frameTicks: 10,
		_resource: "bird"
	});

	//Monster Class (Basically the monster class inherits from sprite.)
	this.monster = o => {
		let monster = {};
		monster.maxHealth = o._maxHealth;
		monster.health = monster.maxHealth;
		monster.name = o._name;
		monster.sprite = o._sprite;
		monster.width = monster.sprite.width;
		monster.height = monster.sprite.height;
		monster.loc = {
			x: o._x || self.worldWidth / 2 - monster.width / 2,
			y: o._y || self.worldHeight / 2 - monster.height / 2
		};
		monster.image = monster.sprite.image;
		monster.frame = monster.sprite.currentFrameContext;

		monster.renderHp = () => {
			bContext.fillStyle = "#00FF00";
			bContext.fillRect(
				// Here i'm creating the monsters HP bar and adjusting it's size.
				monster.loc.x,
				monster.loc.y + monster.height + 10,
				Math.max(monster.width / (monster.maxHealth / monster.health), 0),
				8
			);
		};
		return monster;
	};

	var birdMonster = this.monster({
		_maxHealth: 100,
		_name: "Falcon",
		_sprite: bird
	});

	clickable.push(birdMonster);

	this.clearCanvas();
	var lastRender = 0;

	window.requestAnimationFrame(this.Loop);
};

Clicker.prototype = { constructor: Clicker };

//window.onload = new Clicker();
