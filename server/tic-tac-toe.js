
class TicTacToe {

	constructor(p1, p2) {
		this.players = [p1, p2];
		this.names = [];
		this.moves = [[], []];
		this.oHistory = {
			oMovedTiles: [],
			xMovedTiles: [],
			tilesUsed: []
		};


		this.sendMessageToPlayers("The Game Starts!");
		this.randomPickPlayerToStart();
		
		this.players.forEach((player, idx) => {
			player.on("playerName", (player) => {
				this.names[player.ID] = player.playerName;
			});

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
				
				// Update player screens.
				/*if(player == this.players[0]) {
					
					this.players[1].emit("Draw", {ID: idx, tile: tile});

					this.players[1].emit("validMove", {playerName: this.names[0], turn: 1});
					
					this.players[0].emit("turn", {playerName: this.names[1], turn: 0});
				} else {
					
					this.players[0].emit("Draw", {ID: idx, tile: tile});
					this.players[0].emit("validMove", {playerName: this.names[1], turn: 1});

					this.players[1].emit("turn", {playerName: this.names[0], turn: 0});
				} */
			})

			player.on("checkWinState", (move) => {
				this.moves[idx].push(move);
			})
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
		this.players[playerID].emit("changeTurn", 0)
		this.players[(playerID) ? 0 : 1].emit("changeTurn", 1);
	}

	randomPickPlayerToStart() {
		var playerToStart = Math.round(Math.random());

		this.players[playerToStart].emit("changeTurn", 1);
	}

	sendMessageToPlayers(msg) {
		this.players.forEach((p, idx) => p.emit("playerID", idx));
		this.players.forEach(p => p.emit("message", msg));
		var randomPickPlayerIdx = Math.floor(Math.random());
		this.players[randomPickPlayerIdx].emit({playerName: this.names[randomPickPlayerIdx], turn: 0});
	}
}

module.exports = TicTacToe;