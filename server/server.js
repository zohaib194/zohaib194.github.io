const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const TicTacToe = require("./tic-tac-toe");

const app = express();
const clientPath = `${__dirname}/../client`

// server the static client files.
app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer = null;

// Connection is made by a player.
io.on("connection", (sock) => {
	console.log("someone is connected");

	if(waitingPlayer && sock != waitingPlayer) {
		// start a game
		new TicTacToe(waitingPlayer, sock);
		waitingPlayer = null;
	} else {
		waitingPlayer = sock;
		waitingPlayer.emit("message", "Searching for a player!");
	}
});

server.on("error", (err) => {
	console.error("Server error", err);
});

server.listen(process.env.PORT || 8080, () => {
	console.log('Tic-Tac-Toe started on 8080');
});