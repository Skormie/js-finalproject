const View = function(canvas) {
	this.tctx = document.createElement("canvas").getContext("2d");
	this.ctx = canvas.getContext("2d");
	var data =
		'<svg width="600px" height="600px" xmlns="http://www.w3.org/2000/svg"> \
<defs> \
	<pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse"> \
		<path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5" /> \
	</pattern> \
	<pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"> \
		<rect width="80" height="80" fill="url(#smallGrid)" /> \
		<path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1" /> \
	</pattern> \
</defs> \
<rect width="600px" height="600px" fill="url(#smallGrid)" /> \
</svg>';

	var DOMURL = window.URL || window.webkitURL || window;

	var img = new Image();
	var svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
	var url = DOMURL.createObjectURL(svg);

	img.onload = function() {
		DOMURL.revokeObjectURL(url);
	};
	img.src = url;

	this.clearCanvas = () => {
		this.tctx.resetTransform();
		this.tctx.fillStyle = "#000000";
		this.tctx.fillRect(0, 0, this.tctx.canvas.width, this.tctx.canvas.width);

		this.tctx.fillStyle = "#FF0000";
		this.tctx.fillRect(150, 56, 8, 8);
	};

	var oldX = 150;
	var oldY = 56;

	this.drawPlayer = (x, y, width, height, color) => {
		var camX = -x + this.tctx.canvas.width / 2; //Where we want to be.
		var camY = -y + this.tctx.canvas.height / 2;
		this.tctx.fillStyle = color;
		this.tctx.fillRect(150, 56, width / 2, height / 2);
		this.tctx.fillStyle = color;
		//console.log(x, y);
		this.tctx.fillRect(Math.round(x + camX - 8), Math.round(y + camY - 8), width, height);
		this.tctx.fillStyle = "#FF0000";
		objects.forEach(({ x, y }) => this.tctx.fillRect(x - 5, y - 5, 10, 10));
	};

	this.drawBackground = (x, y, width, height, color) => {
		if (img) {
			this.tctx.drawImage(img, 0, 0);
		}
		var camX = -x + this.tctx.canvas.width / 2; //Where we want to be.
		var camY = -y + this.tctx.canvas.height / 2;
		this.tctx.fillStyle = color;
		this.tctx.fillRect(150, 56, width / 2, height / 2);
		this.tctx.fillRect(140, 56, width / 2, height / 2);
		this.tctx.fillStyle = color;
		//console.log(x, y);
		this.tctx.fillRect(Math.round(x + camX), Math.round(y + camY), width, height);
		this.tctx.fillStyle = "#FF0000";
		objects.forEach(({ x, y }) => this.tctx.fillRect(x - 5, y - 5, 10, 10));
		this.tctx.restore();
	};

	// let cnt = 0;
	// const player = {
	// 	x: undefined,
	// 	y: undefined
	// };
	const xy = (x, y) => ({
		x,
		y
	});
	const dist = 0;
	const objects = [
		xy(0, 0),
		xy(dist, 0),
		xy(dist, dist),
		xy(0, dist),
		xy(-dist, dist),
		xy(-dist, 0),
		xy(-dist, -dist),
		xy(0, -dist),
		xy(dist, -dist)
	];
	const smoothCamera = 0.5;

	var cam_posX = 150; // TODO: Make an object for camera.
	var cam_posY = 75;
	var lastTs = Date.now();
	this.translateCanvas = function(x, y, time) {
		this.tctx.save();
		var delta = Date.now() - lastTs;
		lastTs = Date.now();
		time = (delta / 60) * smoothCamera; // This is like deltatime.

		var camX = -x + this.tctx.canvas.width / 2; //Where we want to be.
		var camY = -y + this.tctx.canvas.height / 2;
		cam_posX = this.lerp(cam_posX, camX, time);
		cam_posY = this.lerp(cam_posY, camY, time);
		//this.tctx.translate(Math.round(cam_posX), Math.round(cam_posY)); //Smooth Camera
		this.tctx.translate(Math.round(camX - 8), Math.round(camY - 8)); //Snappy Camera
	};

	this.lerp = function(v0, v1, t) {
		//Fast Approxmiate
		return v0 + t * (v1 - v0);
	};

	this.plerp = function(v0, v1, t) {
		//Percise Lerp
		return (1 - t) * v0 + t * v1;
	};

	this.draw = function(x, y) {
		//this.tctx.beginPath();
		//this.tctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
		//this.tctx.stroke();
		//objects.forEach(({ x, y }) => this.tctx.fillRect(x - 5, y - 5, 10, 10));
		this.ctx.drawImage(
			this.tctx.canvas,
			0,
			0,
			this.tctx.canvas.width,
			this.tctx.canvas.height,
			0,
			0,
			this.ctx.canvas.width,
			this.ctx.canvas.height
		);
	};

	// DEBUG
	this.translateCanvasRight = function() {
		this.ctx.translate(-10, 0);
	};

	this.translateCanvasLeft = function() {
		this.ctx.translate(10, 0);
	};

	this.zoomIn = function() {
		this.ctx.scale(0.5, 0.5);
	};

	this.zoomOut = function() {
		this.ctx.scale(1.5, 1.5);
	};
	// DEBUG END

	this.resize = (width, height, height_width_ratio) => {
		let dpi = window.devicePixelRatio;
		let style_height = +getComputedStyle(canvas)
			.getPropertyValue("height")
			.slice(0, -2);
		let style_width = +getComputedStyle(canvas)
			.getPropertyValue("width")
			.slice(0, -2);
		if (height / width > height_width_ratio) {
			canvas.setAttribute("height", Math.floor(width * height_width_ratio));
			canvas.setAttribute("width", Math.floor(width));
			// 	this.ctx.canvas.height = width * height_width_ratio;
			// 	this.ctx.canvas.width = width;
		} else {
			// 	this.ctx.canvas.height = height;
			// 	this.ctx.canvas.width = height / height_width_ratio;
			canvas.setAttribute("height", Math.floor(height));
			canvas.setAttribute("width", Math.floor(height / height_width_ratio));
		}
		// canvas.setAttribute("width", width * dpi);
		// canvas.setAttribute("height", height * dpi);
		// this.ctx.save();
		// this.ctx.scale(dpi, dpi);
		// this.ctx.beginPath();
		// this.ctx.rect(10, 10, 100, 20);
		// this.ctx.fillStyle = "#CC0000";
		// this.ctx.strokeStyle = "#000000";
		// this.ctx.fill();
		// this.ctx.stroke();
		// this.ctx.restore();
		this.ctx.imageSmoothingEnabled = false;
		this.ctx.globalCompositeOperation = "copy";
		this.ctx.shadowBlur = 20;
		this.ctx.shadowColor = "black";
		//this.tctx.imageSmoothingEnabled = false;
		//this.tctx.globalCompositeOperation = "copy";
	};
};

View.prototype = { constructor: View };
