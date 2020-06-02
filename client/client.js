	
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
const playerNameField= document.getElementById("playerName");
//const player2Name = document.getElementById("player2");

var images = [];
images.push(document.createElement("img"));
images.push(document.createElement("img"));
images[0].src = "https://www.pngkit.com/png/detail/205-2056266_player-o-into-tic-tac-toe-img-tic.png";
images[1].src = "https://www.pngkey.com/png/detail/205-2056274_tic-tac-toe-img-letter-o.png";

var rects = [];
var oHistory = {
	oMovedTiles: [],
	xMovedTiles: [],
	tilesUsed: []
};

var gameState = {
	xRow: [],
	xColumn: [],
	xDiagonal: 0,
	xAntiDiagonal: 0,
	oRow: [],
	oColumn: [],
	oDiagonal: 0,
	oAntiDiagonal: 0,
}

var turn = 0;
var playerID;
var playerName = "";

///
/// server connection.
///
const sock = io();

createGrid();
drawGrid();
pickName();

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
		//playerName = playerTurn.playerName;
	});

	canvas.onclick = evt => {

		//sock.on("playersTurn", )

		var clickedRect = getClickedRect(evt.offsetX, evt.offsetY);

		if(clickedRect != null) {			
			/*if(oHistory.tilesUsed.includes(clickedRect)) {
				return;
			}

			if(turn === -1) {
				return;
			}
*/
			if(turn == 0) {
				return;
			}
			// Sending turn to be stored as used tile in history.
			//oHistory.tilesUsed.push(clickedRect);
			sock.emit("usedTile", clickedRect);

			//if(/*turn == 0 */ playerID == 0) {
				//context.drawImage(images[playerID], clickedRect.x, clickedRect.y, clickedRect.w, clickedRect.h);
				message.innerHTML = playerName + "'s turn!";

				//oHistory.xMovedTiles.push(clickedRect);
				//sock.emit("playerXMove", clickedRect);

				sock.emit("checkWinState", clickedRect);

				/*if(!isWinState(clickedRect.row, clickedRect.column)){
					turn = 1;
				}*/
		/*	} else {
				context.drawImage(images[playerID], clickedRect.x, clickedRect.y, clickedRect.w, clickedRect.h);
				message.innerHTML = getPlayerName() + "'s turn!";
				
				//oHistory.oMovedTiles.push(clickedRect);
				//sock.emit("playerOMove", clickedRect);
				sock.emit("checkWinState", clickedRect);

				/*if(!isWinState(clickedRect.row, clickedRect.column)) {
					turn = 0;
				}*/
			//}
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

function isWinState(row, column) {
	

	if(turn == 0) {

		// Store the number of X at the row.
		gameState.xRow[row] = (gameState.xRow[row]) ? gameState.xRow[row] + 1 : 1;

		// Store the number of X at the column.
		gameState.xColumn[column] = (gameState.xColumn[column]) ? gameState.xColumn[column] + 1 : 1;
		
		// Store the number of X at diagonal.
		if(row == column){
			gameState.xDiagonal++;
		}

		// Store the number of X at anti diagonal.
		if(row + column == 2){
			gameState.xAntiDiagonal++;
		}

		// Checks if X has won the game.
		if(gameState.xRow[row] == 3 
			|| gameState.xColumn[column] == 3 
			|| gameState.xDiagonal == 3 
			|| gameState.xAntiDiagonal == 3) {
			console.log("Game WON!!!");
			message.innerHTML = getPlayerName() + " has won the game!";
			turn = -1;
			return true;
		}

	} else {
		// Store the number of O at the row.
		gameState.oRow[row] = (gameState.oRow[row]) ? gameState.oRow[row] + 1 : 1;
		
		// Store the number of O at the column.
		gameState.oColumn[column] = (gameState.oColumn[column]) ? gameState.oColumn[column] + 1 : 1;
		
		// Store the number of O at diagonal.
		if(row == column){
			gameState.oDiagonal++;
		}

		// Store the number of O at anti diagonal.
		if(row + column == 2){
			gameState.oAntiDiagonal++;
		}

		// Checks if O has won the game.
		if(gameState.oRow[row] == 3 
			|| gameState.oColumn[column] == 3 
			|| gameState.oDiagonal == 3 
			|| gameState.oAntiDiagonal == 3) {
			console.log("Game WON!!!");
			message.innerHTML = getPlayerName() + " has won the game!";
			turn = -1;
			return true;
		}
	}

	return false;
}

function getPlayerName() {
	if(turn === 0) {
		return player1Name.value;
	}

	return player2Name.value;
}


function pickName() {

	$.ajax({
		url: 'https://randomuser.me/api/',
		dataType: 'json',
		success: function(data) {

			playerNameField.value = data.results[0].name.title + " " + data.results[0].name.first + " " + data.results[0].name.last;

		}
	});


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

	sock.emit("playerName", {
		ID: playerID,
		name: playerNameField.value});

	if(text == "The Game Starts!"){
		game.style.display = "block";
		matchMaking.style.display = "none";
	}
});

sock.on("playerID", (ID) => {
	playerID = ID;
})