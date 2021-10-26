const { nanoid } = require("nanoid");

class Room {
	constructor(io, socket) {
		this.io = io;
		this.socket = socket;
	}

	createRoom(data) {
		console.log("create room called: ", data);
		const { socket, io } = this;
		const id = nanoid(10);
		games[id] = {
			rounds: Number(data.rounds),
			time: Number(data.time) * 1000,
			customWords: [],
			isPrivate: data.type,
			name: data.gameName,
			creator: data.id,
		};
		games[id]["Players"] = {};
		games[id]["Players"][data.id] = {};
		games[id]["Players"][data.id].score = 0;
		games[id]["Players"][data.id].name = data.name;
		socket.player = data;
		socket.roomID = id;
		socket.join(id);
		io.to(socket.id).emit(EVENTS.CREATED_ROOM, { gameID: id });
		console.log("CREATED GAME");
	}

	async joinRoom(data) {
		const { io, socket } = this;
		const roomID = data.id;
		const players = Array.from(await io.in(roomID).allSockets());
		games[roomID]["Players"][data.player.id] = {};
		games[roomID]["Players"][data.player.id].score = 0;
		games[roomID]["Players"][data.player.id].name = data.player.name;
		socket.player = data.player;
		socket.join(roomID);
		socket.roomID = roomID;
		socket.to(roomID).emit(EVENTS.JOIN_ROOM, data.player);
		socket.to(roomID).emit(
			EVENTS.PLAYER_JOIN,
			players.reduce((acc, id) => {
				if (socket.id !== id) {
					const { player } = io.of("/").sockets.get(id);
					acc.push(player);
				}
				return acc;
			}, [])
		);
		console.log("JOINED GAME");
	}

	getRoomPlayers(data) {
		const { io, socket } = this;
		if (games[data.id] !== undefined) {
            console.log(games[data.id]);
			io.to(data.id).emit(EVENTS.GET_ROOM_PLAYERS, { players: games[data.id]["Players"] , creator:  games[data.id]["creator"]});
			// socket
			// 	.to(data.id)
			// 	.emit(EVENTS.GET_ROOM_PLAYERS, games[data.id]["Players"]);
		}
		console.log("GET PLAYERS");
	}

	getPublicRooms(data) {
		const { io } = this;
		let publicGames = [];
		for (const key in games) {
			if (!games[key].isPrivate) {
				const game = games[key];
				publicGames.push({ gameName: game.name, key: key });
			}
		}
		io.to(data.id).emit(EVENTS.GET_ROOMS, { games: publicGames });
	}

	setCustomId(data) {
        const { socket } = this;
		customSocketIds[data.customId] = data.id;
		for (const key in games) {
            // console.log("_______________________________");
            // console.log("games :", games[key]);
            
			for (const player in games[key]["Players"]) {
            
				if (player == data.customId) {
					socket.roomID = key;
					socket.join(key);
                    // console.log("match");
				}
			}
		}
        // console.log("_______________________________");
        // console.log(new Date());
		// console.log("joinedPlayers: ", customSocketIds);
        // console.log("_______________________________");
	}
}

module.exports = Room;
