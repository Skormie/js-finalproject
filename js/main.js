function loadScript(url) {
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;
	head.appendChild(script);
}

loadScript("./js/controller.js");
loadScript("./js/view.js");
loadScript("./js/core.js");
loadScript("./js/game.js");

window.onload = function(event) {
	"use strict";
	//gameEngineThis = this;

	// window.requestAnimationFrame =
	// 	window.requestAnimationFrame ||
	// 	function(callback) {
	// 		window.setTimeout(callback, 16);
	// 	};

	// if (!window.requestAnimationFrame) {
	// 	window.requestAnimationFrame = (function() {
	// 		return (
	// 			window.webkitRequestAnimationFrame ||
	// 			window.mozRequestAnimationFrame ||
	// 			window.oRequestAnimationFrame ||
	// 			window.msRequestAnimationFrame ||
	// 			function(callback, fps) {
	// 				window.setTimeout(callback, 1000 / 60); // frames per second
	// 			}
	// 		);
	// 	})();
	// }

	var keyPressed = e => controller.keyPressed(e.type, e.keyCode);

	var resize = function() {
		view.resize(
			document.documentElement.clientWidth - 32,
			document.documentElement.clientHeight - 32,
			game.world.height / game.world.width
		);
		view.draw();
	};

	var draw = function(lagOffset, elapsed) {
		//update();
		view.clearCanvas(game.world.player.x, game.world.player.y, game.world.player.velocity_x);
		view.drawPlayer(
			game.world.player.x,
			game.world.player.y,
			game.world.player.width,
			game.world.player.height,
			game.world.player.color,
			lagOffset,
			elapsed
		);
		view.translateCanvas(game.world.player.x, game.world.player.y /*, core.time, core.fps*/);
		view.drawBackground(
			game.world.player.x,
			game.world.player.y,
			game.world.player.width,
			game.world.player.height,
			game.world.player.color,
			lagOffset,
			elapsed
		);
		//view.translateCanvas(game.world.player.x, game.world.player.y /*, core.time, core.fps*/);
		view.draw(game.world.player.x, game.world.player.y, game.world.player.velocity_x);
		//requestAnimationFrame(draw);
		//window.requestAnimationFrame(() => draw());
		//window.cancelAnimationFrame(requestID);
		//requestID = undefined;
		//requestID = window.requestAnimationFrame(draw);
	};

	// var draw = function(lagOffset, elapsed) {
	// 	//view.clearCanvas("#000000");
	// 	view.bigDraw(
	// 		game.world.player.x,
	// 		game.world.player.y,
	// 		game.world.player.width,
	// 		game.world.player.height,
	// 		game.world.player.color,
	// 		lagOffset,
	// 		elapsed
	// 	);
	// 	//view.translateCanvas(game.world.player.x, game.world.player.y /*, core.time, core.fps*/);
	// 	//view.draw(game.world.player.x, game.world.player.y, game.world.player.velocity_x);
	// };

	var update = function(l, e) {
		if (controller.left.active) game.world.player.moveLeft();
		if (controller.right.active) game.world.player.moveRight();
		if (controller.camLeft.active) view.translateCanvasLeft();
		if (controller.camRight.active) view.translateCanvasRight();
		if (controller.zoomIn.active) view.zoomIn();
		if (controller.zoomOut.active) view.zoomOut();
		if (controller.up.active) {
			game.world.player.jump();
			controller.up.active = false;
		}

		game.update(l, e);
	};

	//Objects
	var controller = new Controller();
	var view = new View(document.querySelector("canvas"));
	var core = new Engine(1000 / 60, draw, update);
	var game = new Game();

	view.tctx.canvas.height = game.world.height;
	view.tctx.canvas.width = game.world.width;

	window.onkeydown = keyPressed;
	window.onkeyup = keyPressed;
	window.onresize = resize;

	resize();
	//draw();

	core.start();
};
