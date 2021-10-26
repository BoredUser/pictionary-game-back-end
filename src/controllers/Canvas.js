class Canvas {
	constructor(io, socket) {
			this.io = io;
			this.socket = socket;
	}

	broadcastDrawing(data) {
		console.log('drawing >>>>>>')
			const { socket } = this;
			console.log("drawing Broadcasting to:", socket.roomID);
			socket.broadcast.to(socket.roomID).emit('drawing', data);
	}

	clearCanvas() {
		console.log("clearing Canvas")
			const { socket } = this;
			socket.broadcast.to(socket.roomID).emit('clearCanvas');
	}
}

module.exports = Canvas;
