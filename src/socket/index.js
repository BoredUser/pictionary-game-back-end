const io = require("socket.io")((process.env.PORT || 3000), { cors: true });

let drawing;
io.on("connection", socket => {

    socket.on("join-room", (room) => {
		socket.join(room);
		socket.emit("joined");
        socket.emit("drawing", drawing);
	});

	socket.on("drawing", (data) => {
        if (data.action === "draw"){
            drawing = data.data;
            socket.to(data.room).emit("drawing", data.data);
        }
        else if(data.action === "clear"){
            drawing = null;
            socket.to(data.room).emit("clear");
        }
		
	});

    socket.on("checkAnswer", (data) =>{
        console.log(data);
    });
    
});