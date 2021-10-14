// require( './data/' );

require( './data/index' );

const express = require( 'express' );
const path = require( 'path' );
const cors = require( 'cors' );

const app = express();
var http = require("http").createServer(app)
var io = require("socket.io")(http, {  cors: {    origin: "*",    methods: ["GET", "POST"]  }})

// middlewares
app.use( cors() );
app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );


const PORT = process.env.PORT || 3000;

// socket events 

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


http.listen( PORT, error => {
    if( error ) {
        console.error( error.message );
        return;
    }

    console.log( `Check http://localhost:${PORT}` );
});












