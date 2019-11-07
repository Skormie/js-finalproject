const Game = function() {
	this.world = {
		friction: 0.7,
		gravity: 3,

		player: new Game.Player(),

		height: 135, //144//72
		width: 256, //128

		collideObject: function(object) {
			/*if (object.x < 0) {
				object.x = 0;
				object.velocity_x = 0;
			} else if (object.x + object.width > this.width) {
				object.x = this.width - object.width;
				object.velocity_x = 0;
			}*/
			if (object.y < 0) {
				object.y = 0;
				object.velocity_y = 0;
			} else if (object.y + object.height > this.height) {
				object.jumping = false;
				object.y = this.height - object.height;
				object.velocity_y = 0;
			}
		},

		update: function(l, e) {
			this.player.velocity_y += this.gravity - this.player.upForce;
			//console.log(l);
			this.player.update();

			this.player.velocity_x *= this.friction;
			this.player.velocity_y *= this.friction;

			this.collideObject(this.player);
		}
	};

	this.update = function(l, e) {
		this.world.update(l, e);
	};
};

Game.prototype = { constructor: Game };

Game.Player = function(x, y) {
	this.color = "#ff0000";
	this.height = 16;
	this.jumping = true;
	this.upForce = 0;
	this.velocity_x = 0;
	this.velocity_y = 0;
	this.width = 16;
	this.x = 150;
	this.y = 75;
	this.oldX = 150;
	this.oldY = 75;
};

Game.Player.prototype = {
	constructor: Game.Player,

	jump: function() {
		if (!this.jumping && !this.upForce) {
			this.color = "#" + Math.floor(Math.random() * 16777216).toString(16);
			if (this.color.length != 7) {
				this.color = this.color.slice(0, 1) + "0" + this.color.slice(1, 6);
			}

			this.jumping = true;
			this.velocity_y -= 20;
		} else if (this.jumping && !this.upForce && this.velocity_y < 0) {
			this.upForce = 1.5;
			this.velocity_y -= 5.5;
		}
	},

	moveLeft: function() {
		this.velocity_x -= 0.5;
	},
	moveRight: function() {
		this.velocity_x += 0.5;
	},
	update: function(l, e) {
		var renderX = (this.x + this.velocity_x - this.oldX) * l + this.oldX;
		var renderY = (this.y + this.velocity_y - this.oldY) * l + this.oldY;
		//console.log(this.x, this.velocity_x, this.oldX, l, (this.x + this.velocity_x - this.oldX) * l + this.oldX);
		this.oldX = this.x;
		this.oldY = this.y;
		//this.x = renderX;
		//this.y = renderY;
		this.x += this.velocity_x;
		this.y += this.velocity_y;
	}
};
