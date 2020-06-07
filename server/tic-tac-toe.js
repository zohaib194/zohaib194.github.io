
class TicTacToe {

	constructor(p1, p2) {
		this.players = [p1, p2];
		this.names = [];
		this.oHistory = {
			playerMoves: [[], []],
			tilesUsed: []
		};
		this.gameState = {
			xRow: [],
			xColumn: [],
			xDiagonal: 0,
			xAntiDiagonal: 0,
			oRow: [],
			oColumn: [],
			oDiagonal: 0,
			oAntiDiagonal: 0,
		}

		this.randomPickPlayerToStart()

		this.sendMessageToPlayers("The Game Starts!");
		
		this.players.forEach((player, idx) => {
			this.restartRequest(player, idx);

			player.on("usedTile", (tile) => {

				// Check if tile is used already.
				if(this.isTileUsed(tile)) {
					return;
				}
				// Store the tile as used tiles.
				this.oHistory.tilesUsed.push(tile);

				this.drawPlayerMovement(idx, tile);

				if(!this.checkForWinState(player, idx, tile)) {
					if(this.isTieState()) {
						this.players.forEach(p => p.emit("gameMessage", "It's a tie!"));
						this.sendGameMessage
					} else {
						this.changeTurn(idx);
					}
				}
			})
			
		});
	}

	restartRequest(player, idx) {
		player.on("restartRequest", (b) => {
			this.players[(idx) ? 0 : 1].emit("restartRequest", true);
		});

		player.on("restartAccepted", (b) => {
			// reset the the states and history.
			this.oHistory = {
				playerMoves: [[], []],
				tilesUsed: []
			};
			this.gameState = {
				xRow: [],
				xColumn: [],
				xDiagonal: 0,
				xAntiDiagonal: 0,
				oRow: [],
				oColumn: [],
				oDiagonal: 0,
				oAntiDiagonal: 0,
			}
			this.randomPickPlayerToStart();

			this.players.forEach(p => p.emit("restartGame", true));
		});

		player.on("restartDenied", (b) => {

		});
	}

	isTileUsed(tile) {
		for (var i = 0; i < this.oHistory.tilesUsed.length; i++) {
			if(JSON.stringify(this.oHistory.tilesUsed[i]) == JSON.stringify(tile)) {
				return true;
			}
		}

		return false;		
	}

	drawPlayerMovement(playerID, tile) {
		this.players.forEach(((player) => {
			player.emit("Draw", {ID: playerID, tile: tile});
		}));
	}

	changeTurn(playerID) {
		this.players[playerID].emit("changeTurn", 0);
		this.players[playerID].emit("gameMessage", "Opponent's turn!");
		this.players[(playerID) ? 0 : 1].emit("changeTurn", 1);
		this.players[(playerID) ? 0 : 1].emit("gameMessage", "Your turn!");
	}

	randomPickPlayerToStart() {
		var playerToStart = Math.round(Math.random());

		this.players[playerToStart].emit("changeTurn", 1);
		
		for (var i = 0; i < this.players.length; i++) {
			if(playerToStart == i) {
				this.players[i].emit("gameMessage", "Your turn!");
			} else {
				this.players[i].emit("gameMessage", "Opponent's turn!");
			}
		}

	}

	sendMessageToPlayers(msg) {
		this.players.forEach((p, idx) => p.emit("playerID", idx));
		this.players.forEach(p => p.emit("message", msg));
	}

	checkForWinState(player, idx, tile) {
		
		this.oHistory.playerMoves[idx].push(tile);

		if(this.isWinState(tile.row, tile.column, idx)) {
			this.sendGameWonState(idx);
			return true;
		}
		
		return false;
	}

	isTieState() {
		console.log(this.oHistory.tilesUsed.length)
		if(this.oHistory.tilesUsed.length == 9) {
			return true;
		}

		return false;
	}

	isWinState(row, column, idx) {

		if(idx == 0) {
			// Store the number of X at the row.
			this.gameState.xRow[row] = (this.gameState.xRow[row]) ? this.gameState.xRow[row] + 1 : 1;

			// Store the number of X at the column.
			this.gameState.xColumn[column] = (this.gameState.xColumn[column]) ? this.gameState.xColumn[column] + 1 : 1;
			
			// Store the number of X at diagonal.
			if(row == column){
				this.gameState.xDiagonal++;
			}

			// Store the number of X at anti diagonal.
			if(row + column == 2){
				this.gameState.xAntiDiagonal++;
			}

			// Checks if X has won the game.
			if(this.gameState.xRow[row] == 3 
				|| this.gameState.xColumn[column] == 3 
				|| this.gameState.xDiagonal == 3 
				|| this.gameState.xAntiDiagonal == 3) {
				
				return true;
			}
		} else {
			// Store the number of O at the row.
			this.gameState.oRow[row] = (this.gameState.oRow[row]) ? this.gameState.oRow[row] + 1 : 1;
			
			// Store the number of O at the column.
			this.gameState.oColumn[column] = (this.gameState.oColumn[column]) ? this.gameState.oColumn[column] + 1 : 1;
			
			// Store the number of O at diagonal.
			if(row == column){
				this.gameState.oDiagonal++;
			}
	
			// Store the number of O at anti diagonal.
			if(row + column == 2){
				this.gameState.oAntiDiagonal++;
			}
	
			// Checks if O has won the game.
			if(this.gameState.oRow[row] == 3 
				|| this.gameState.oColumn[column] == 3 
				|| this.gameState.oDiagonal == 3 
				|| this.gameState.oAntiDiagonal == 3) {

				return true;
			}
		}

		return false;
	}

	sendGameWonState(playerWonIdx) {
		for (var i = 0; i < this.players.length; i++) {
			this.players[i].emit("changeTurn", 0);
			
			if(i == playerWonIdx) {
				this.players[i].emit("gameMessage", "You have won the game!");
				this.players[i].emit("score", {
					"you": 1,
					"opponent": 0
				});
 
			} else {
				this.players[i].emit("gameMessage", "You have lost the game!");
				this.players[i].emit("score", {
					"you": 0,
					"opponent": 1
				});
			}
		}
	}

	restart() {

		sock.
		this.oHistory = {
			playerMoves: [[], []],
			tilesUsed: []
		};
		this.gameState = {
			xRow: [],
			xColumn: [],
			xDiagonal: 0,
			xAntiDiagonal: 0,
			oRow: [],
			oColumn: [],
			oDiagonal: 0,
			oAntiDiagonal: 0,
		}
	}
}

module.exports = TicTacToe;