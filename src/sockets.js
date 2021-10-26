const socketio = require('socket.io');

const Room = require('./controllers/Room');
const Canvas = require('./controllers/Canvas');
const Game = require('./controllers/Game');
const { events } = require('./utils/constants');
// const Disconnect = require('./controllers/Disconnect');
// const Game = require('./controllers/Game');

module.exports.initialize = (server) => {
    const io = socketio(server);
    io.on('connection', (socket) => {
        console.log('connected user', socket.id);

        socket.on(events.SET_CUSTOM_CLIENT_ID, (data) => new Room(io, socket).setCustomId(data));
        socket.on(events.CREATE_ROOM, (data) => new Room(io, socket).createRoom(data));
        socket.on(events.GET_ROOMS, (data) => new Room(io, socket).getPublicRooms(data));
        socket.on(events.JOIN_ROOM,  async (data) => await new Room(io, socket).joinRoom(data));
        socket.on(events.DRAWING, (data) => new Canvas(io, socket).broadcastDrawing(data));
        socket.on(events.CLEAR_CANVAS, () => new Canvas(io, socket).clearCanvas());
        socket.on(events.START_GAME, async () => { await new Game(io, socket).startGame(); });
        socket.on(events.GET_PLAYERS, async (data) => { await new Game(io, socket).getPlayers(data); });
        socket.on(events.MESSAGE,  (data) => new Game(io, socket).onMessage(data));
        socket.on(events.GET_ROOM_PLAYERS, (data) =>  new Room(io, socket).getRoomPlayers(data));
        socket.on(events.GET_SCORE, (data) => new Game(io, socket).getScore(data));
        
        // socket.on('disconnect', () => new Disconnect(io, socket).onDisconnect());
    });
};
