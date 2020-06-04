	
var canvas = document.getElementById('canvas');

if(!canvas) {
	console.error("ERROR: Canvas is undefined!");
}

const NR_OF_TILES = 9;
const TILE_SIZE = canvas.width / 3 - 5;
const OFFSET = 2.5;
const CELL_X = canvas.width / 3;
const CELL_Y = canvas.height / 3;

const message = document.getElementById("message");

var images = [];
images.push(document.createElement("img"));
images.push(document.createElement("img"));
images[0].src = "https://www.pngkit.com/png/detail/205-2056266_player-o-into-tic-tac-toe-img-tic.png";
images[1].src = "https://www.pngkey.com/png/detail/205-2056274_tic-tac-toe-img-letter-o.png";

var rects = [];

var turn = 0;

///
/// server connection.
///
const sock = io();

createGrid();
drawGrid();

function createGrid(){
	var canvas = document.getElementById('canvas');

	var nextRow = 0;
	var nextColumn = 0;
	for (var i = 0; i < NR_OF_TILES; i++) {
		if(i !== 0 && i % 3 === 0) {
			nextRow += 1;
			nextColumn = 0;
		}

		if(i % 3 !== 0) {
			nextColumn += 1;
		}

		rects.push({
			row: nextRow,
			column: nextColumn,
			x: nextRow * CELL_X + OFFSET,
			y: nextColumn * CELL_Y + OFFSET,
			w: TILE_SIZE,
			h: TILE_SIZE
		});
	}
}

function drawGrid() {
	var canvas = document.getElementById('canvas');
	var context;

	if(!canvas) {
		console.error("ERROR: Canvas is undefined!");
		return
	}

	context = canvas.getContext('2d');

	if(!context) {
		console.error("ERROR: Context is undefined!");
		return;
	}

	for (var i = 0; i < rects.length; i++) {
		context.fillRect(rects[i].x, rects[i].y, rects[i].w, rects[i].h);
	}

	// On 2nd player move!
	sock.on("Draw", (Obj) => {
		context.drawImage(images[Obj.ID], Obj.tile.x, Obj.tile.y, Obj.tile.w, Obj.tile.h);
	});

	sock.on("changeTurn", (t) => {
		turn = t;
	});

	canvas.onclick = evt => {

		var clickedRect = getClickedRect(evt.offsetX, evt.offsetY);

		if(clickedRect != null) {			

			if(turn == 0) {
				return;
			}

			// Sending turn to be stored as used tile in history.
			sock.emit("usedTile", clickedRect);
		}
	}
}

function getClickedRect(xOffset, yOffset) {
	for (var i = 0; i < rects.length; i++) {
		if(xOffset <= rects[i].x + rects[i].w
			&& xOffset >= rects[i].x
			&& yOffset <= rects[i].y + rects[i].h
			&& yOffset >= rects[i].y) {
			console.log("LOG: Rectangle " + i + " is clicked!");
			return rects[i];
		}
	}

	return null;
}

/*
*
* Server Connection
* 
*/
// On connection we receive "message" event from the server.
sock.on("message", (text) => {
	const serverMessage = document.querySelector("#serverMessage");
	const matchMaking = document.querySelector("#MatchMaking");
	const game = document.querySelector("#Game");

	serverMessage.innerText = text;
	setTimeout(() => {
		if(text == "The Game Starts!"){
			game.style.display = "block";
			matchMaking.style.display = "none";
		}
	}, 2000);
});

sock.on("gameMessage", (msg) => {
	message.innerHTML = msg;
});