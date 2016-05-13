$(document).ready(function(){
	
	//Canvas Create
var canvas = $("#canvas")[0];
var ctx = canvas.getContext("2d");

	//Find offset of the canvas - to create coordinates local to the canvas not the screen
var canvasOffset = $("#canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

	//Width and height variables for easy use
var w = $("#canvas").width();
var h = $("#canvas").height();

	//Mouse coordinates
var mouseX = w/2;
var mouseY = h -75;
var newmouseX = mouseX;

	//Paddle dimensions

var Paddle = {

	height : 15,
	width : 100,
	h_center : 7.5,
	w_center : 50

}
	//Ball variables

var Ball = {

	x : w/2 - 6,
	y : mouseY - 100,
	width : 12,
	dy : 5,
	dx : 5,
	angle : (3*Math.PI)/2,
	speed : 8
}

	//Brick variables
var Bricks = [];




//Functions _________________________________

function init() {

	create_bricks();
	
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, w, h)

	if(typeof game_loop != "undefined") clearInterval(game_loop);
	game_loop = setInterval(draw, 1000/60);
}

//Game _____________________

init()
	
function draw() {

	
	// Erase ball
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.fillRect(Ball.x-1, Ball.y-1, Ball.width+2, Ball.width+2)

	// Erase bat
	ctx.fillRect(mouseX - Paddle.w_center - 1, mouseY - Paddle.h_center - 1, Paddle.width+2, Paddle.height+2);

	// Move ball
	Move_Ball()

	// Draw ball
	ctx.fillStyle = "black";
	ctx.fillRect(Ball.x, Ball.y, Ball.width, Ball.width)

	// Move bat
	mouseX = newmouseX

	// Draw bat
	ctx.fillStyle = "black";
	if (mouseX < Paddle.width/2) mouseX = Paddle.width/2;
	else if (mouseX > Paddle.w-Paddle.width/2) mouseX = Paddle.w-width/2;

	ctx.fillRect(mouseX - Paddle.w_center, mouseY - Paddle.h_center, Paddle.width, Paddle.height);



	//Draw Bricks
	draw_bricks(Bricks);

	//Draw gray border
	ctx.strokeStyle = "gray";
	ctx.strokeRect(0,0,w,h);		
	ctx.closePath();

	//Check Collisions
	check_collisions();
	
}

function create_bricks(){

	var y_pos = 100
	var x_pos = 125
	var object
	var obj_strength = 5


	//4 rows
	for (var i = 0; i < 5; i++) {
		//10 columns 
		for (var j = 0; j < 10; j++) {
			object = {
				xpos: x_pos,
				ypos : y_pos,
				width : 50,
				height : 20,
				strength : obj_strength,
				active : true
				
			}
			Bricks.push(object)
			
			x_pos = x_pos + 55;

		}
		x_pos = 125
		y_pos = y_pos + 50
		obj_strength = obj_strength - 1
	}
}


function draw_bricks(Bricks) {
	// Draw the bricks in the brick array

	for (var i = 0; i < Bricks.length; i++) {

		if(Bricks[i].strength == 5) {	ctx.fillStyle = "violet"}
		else if(Bricks[i].strength == 4) {	ctx.fillStyle = "red"}
		else if(Bricks[i].strength == 3) {	ctx.fillStyle = "green"}
		else if(Bricks[i].strength == 2) {	ctx.fillStyle = "blue"}
		else if(Bricks[i].strength == 1) {	ctx.fillStyle = "yellow"}

		else if(Bricks[i].strength == 0) {Bricks[i].active = false}

		ctx.fillRect(Bricks[i].xpos, Bricks[i].ypos, Bricks[i].width,Bricks[i].height)
	}

	//Need to draw over bricks where active == false

}

function Move_Ball() {
	ball_left = Ball.x
	ball_right = Ball.x + Ball.width
	ball_top = Ball.y
	ball_bottom = Ball.y + Ball.width

	//Check if any collisions with bat

	//Check if any collision with wall

	//Left
	if ( ball_left < 0){
		Ball.x = 0
		Ball.angle = Math.PI - Ball.angle
	}
	else if ( ball_right > w) {
		Ball.x = w - Ball.width
		Ball.angle  = Math.PI - Ball.angle
	}

	else if ( ball_top < 0) {
		Ball.y = 0
		Ball.angle = Math.PI*2 - Ball.angle
	}

	else if ( ball_bottom > h) {
		Ball.y = h - Ball.width
		Ball.angle = Math.PI*2 - Ball.angle
	}

	//Update the ball position
	Ball.x = Ball.x + Math.cos(Ball.angle)*Ball.speed
	Ball.y = Ball.y + Math.sin(Ball.angle)*Ball.speed


}

function check_collisions() {

//Check collision between bat and ball

	if ( Ball.x <= mouseX + Paddle.w_center &&
		 Ball.x + Ball.width >= mouseX - Paddle.w_center &&
		 Ball.y <= mouseY + Paddle.h_center &&
		 Ball.y + Ball.width >= mouseY - Paddle.h_center)
	{

		//Collision detected
		console.log("Collision!!")

		//If hit on the top change x direction based on distance from centre

		Ball.angle = (3*Math.PI)/2 + (((Ball.x + Ball.width/2)-(mouseX)) / Paddle.w_center) * (Math.PI/4)
	}

}



 $("#canvas").mousemove(function (e) {
   		
			newmouseX = parseInt(e.clientX - offsetX);
            //mouseY = parseInt(e.clientY - offsetY);
           // console.log(mouseX,mouseY)

        });
		
})

