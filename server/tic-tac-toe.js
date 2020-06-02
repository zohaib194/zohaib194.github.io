
class TicTacToe {

	constructor(p1, p2) {
		this.players = [p1, p2];
		this.names = [];
		this.oHistory = {
			playerMoves: [[], []],
			tilesUsed: []
		};

		this.randomPickPlayerToStart()

		this.sendMessageToPlayers("The Game Starts!");
		
		this.players.forEach((player, idx) => {

			player.on("usedTile", (tile) => {

				// Check if tile is used already.
				if(this.isTileUsed(tile)) {
					return;
				}
				// Store the tile as used tiles.
				this.oHistory.tilesUsed.push(tile);
					console.log(this.oHistory.tilesUsed);

				this.drawPlayerMovement(idx, tile);

				this.changeTurn(idx);
				
			})

			player.on("checkWinState", (move) => {
				this.oHistory.playerMoves[idx].push(move);
				this.checkWinState();
			});
		});

	/*	player[0].on("playerXMove", (move) => {
			this.oHistory.xMovedTiles.push(move);
		})

		player[1].on("playerOMove", (move) => {
			this.oHistory.oMovedTiles.push(move);
		})
*/
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

	checkWinState() {
		for (var i = 0; i < this.oHistory.moves.length; i++) {
			for (var j = 0; j < this.oHistory.moves[i].length; j++) {
				

				this.oHistory.moves[i][j]
			}
		}
	}
}

module.exports = TicTacToe;