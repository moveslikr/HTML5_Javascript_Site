$(document).ready(function(){


//Canvas Create
var canvas = $("#canvas")[0];
var ctx = canvas.getContext("2d");




var w = $("#canvas").width();
var h = $("#canvas").height();

//Cell width for easy control
var cw = 10;
//Default direction
var d;
var food;
var score;
var highscore = 0;
var game_reset;
var in_game;

function init() {
	d = "right";
	create_snake();
	create_food();
	score = 0;
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	game_reset = false;
	ctx.font = "10px Lato"
	in_game = true;
	//Snake movement using a timer
	//Every 60ms
	if(typeof game_loop != "undefined") clearInterval(game_loop);
	game_loop = setInterval(paint, 60);
}

init();
//Create Snake

var snake_array; //an array of cells to make up the snake

function create_snake() {
	var length = 5; //Length of the snake
	snake_array = [] //Create an empty array for the snake

	for (var i = length - 1; i >= 0; i--) {
		//Create a horizontal snake starting from the top left
		snake_array.push({x:i,y:0})
	}
}


function create_food()
{
	//Creates a cell with x and y between 0-44 as there are 45 cells
	food = {
		x: Math.round(Math.random()*(w-cw)/cw),
		y: Math.round(Math.random()*(h-cw)/cw),
	};

}


function game_over()
{
	//When the game has ended
	//Pause the game
	//Display the score
		in_game = false;
		ctx.font = "30px Lato";
		ctx.fillStyle = "red";
		ctx.textAlign = "center";
		ctx.fillText("Game Over", canvas.width/2, canvas.height/2 + 20);
		ctx.font = "15px Lato";
		ctx.fillText("Score: " + score, canvas.width/2, canvas.height/2 -20 );
		ctx.fillText("Press Enter to continue", canvas.width/2, canvas.height - 20);

		//if score > highscore
		if (score > highscore) {
			highscore = score;
			$('#highscore').text("Highscore: " +highscore);	
		}

		
		
		
	//Wait for user input to restart
		if (game_reset == true) init();

}



create_food();
create_snake();
function paint() 
{

	//To remove the tail of the snake shown onscreen - need to repaint the canvas
	//Paint the canvas

	ctx.fillStyle = "white";
	ctx.fillRect(0,0,w,h);
	ctx.strokeStyle = "gray";
	ctx.strokeRect(0,0,w,h);

	//Movement logic here
	//Remove the tail cell and place it infront of the head cell
	var nx = snake_array[0].x;
	var ny = snake_array[0].y;

	//Direction based movement
	if(d == "right") nx++;
	else if(d == "left") nx--;
	else if(d == "up") ny--;
	else if(d == "down") ny++;

	//Game over clause
	//Restarts the game if the snake hits the wall
	//If it hits any of the walls
	if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx,ny,snake_array))
		{
			//restart game
			game_over();
			return;
		}


	//Snake eating food logic
	//If new head position matches the food position
	//Create a new head instead of moving the tail

	if(nx == food.x && ny == food.y)
	{
		var tail = {x:nx,y:ny};
		//Create new food
		create_food();
		score++;

	}
	else
	{
		//Shifting the snake head
		var tail = snake_array.pop() //Pops the last cell
		tail.x = nx;
		tail.y = ny;
	}

	snake_array.unshift(tail) //Puts the tail back as the head

	for (var i = 0; i < snake_array.length; i++) 
	{
		var c = snake_array[i];
		//Paint 10px wide cells
		paint_cell(c.x,c.y, "red")
		
	}


	//Paint the food
	paint_cell(food.x, food.y, "red")
	//Draw the score
	var score_text = "Score: " + score;
	ctx.fillText(score_text,20,h-5);
}

//Generic paint function for cells
function paint_cell(x,y,col) {
	ctx.fillStyle = col;
	ctx.fillRect(x*cw, y*cw,cw,cw)
	ctx.strokeStyle = "white";
	ctx.strokeRect(x*cw, y*cw,cw,cw)
}


//Collision function

function check_collision(x,y,array)
{
	//Checks if the provieded x/y coordinated exist in an array
	for (var i = 0; i < array.length; i++) 
	{
		if (array[i].x == x && array[i].y == y)
			return true;

	}
	return false;
		
}



//Keyboard controls
$(document).keydown(function(e)
{
	var key = e.which;
	//We will add another clause to prevent reverse gear
		if(key == "37" && d != "right" && in_game == true) d = "left";
		else if(key == "38" && d != "down"  && in_game == true) d = "up";
		else if(key == "39" && d != "left" && in_game == true) d = "right";
		else if(key == "40" && d != "up" && in_game == true) d = "down";
		else if(key == "13" && in_game == false) game_reset = true;
})


})