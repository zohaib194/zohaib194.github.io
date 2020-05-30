const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const clientPath = `${__dirname}/../client`

// server the static client files.
app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

io.on("connection", (sock) => {
	console.log("someone is connected");
	sock.emit("message", "Searching for a player!");
})

server.on("error", (err) => {
	console.error("Server error", err);
})

server.listen(8080, () => {
	console.log('Tic-Tac-Toe started on 8080');
})