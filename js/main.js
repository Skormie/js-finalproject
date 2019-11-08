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
loadScript("./js/clicker.js");

window.onload = function(event) {
	"use strict";
	var clickgame;
	var game1 = document.getElementById("game1");
	var game2 = document.getElementById("game2");
	var game3 = document.getElementById("game3");
	game1.style.display = "none"; // For whatever reason I have to do this for the button to work on first click.
	game2.style.display = "none";
	game3.style.display = "none";

	document.getElementById("btn_game1").addEventListener("click", () => {
		if (game1.style.display != "none") game1.style.display = "none";
		else game1.style.display = "block";
		game2.style.display = "none";
		game3.style.display = "none";
	});

	document.getElementById("btn_game2").addEventListener("click", () => {
		console.log(game2.style.display);
		if (game2.style.display != "none") {
			game2.style.display = "none";
		} else {
			game2.style.display = "block";
			if (typeof clickgame === "undefined") {
				clickgame = new Clicker();
			}
		}
		game1.style.display = "none";
		game3.style.display = "none";
	});

	document.getElementById("btn_game3").addEventListener("click", () => {
		if (game3.style.display != "none") game3.style.display = "none";
		else game3.style.display = "block";
		game2.style.display = "none";
		game1.style.display = "none";
	});

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
		view.clearCanvas(game.world.player.x, game.world.player.y, game.world.player.velocity_x);
		view.translateCanvas(game.world.player.x, game.world.player.y);
		view.drawBackground(
			game.world.player.x,
			game.world.player.y,
			game.world.player.width,
			game.world.player.height,
			game.world.player.color,
			lagOffset,
			elapsed
		);
		view.drawPlayer(
			game.world.player.x,
			game.world.player.y,
			game.world.player.width,
			game.world.player.height,
			game.world.player.color,
			lagOffset,
			elapsed
		);
		view.draw(game.world.player.x, game.world.player.y, game.world.player.velocity_x);
	};

	var update = function() {
		if (controller.left.active) game.world.player.moveLeft();
		if (controller.right.active) game.world.player.moveRight();
		if (controller.camLeft.active) view.translateCanvasLeft();
		if (controller.camRight.active) view.translateCanvasRight();
		if (controller.zoomIn.active) view.zoomIn();
		if (controller.zoomOut.active) view.zoomOut();
		if (controller.up.active) {
			game.world.player.jump();
		} else if (!controller.up.active) {
			game.world.player.upForce = 0;
		}

		game.update();
	};

	var onResize = function() {
		resize();
		if (clickgame != undefined) {
			clickgame.Resize(
				document.documentElement.clientWidth - 10,
				document.documentElement.clientHeight - 10,
				clickgame.worldHeight / clickgame.worldWidth
			);
		}
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
	window.onresize = onResize;

	resize();

	core.start();
};
