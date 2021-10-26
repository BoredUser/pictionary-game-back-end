/* global games, BONUS, round */
const leven = require('leven');
const GraphemeSplitter = require('grapheme-splitter');
const { events } = require('../utils/constants');
const {
	get3Words,
	wait,
	getHints,
	getScore
} = require('../utils/helpers');
const splitter = new GraphemeSplitter();

class Game {
	constructor(io, socket) {
		this.io = io;
		this.socket = socket;
	}

	chosenWord(playerID) {
		const { io } = this;
		return new Promise((resolve, reject) => {
			function rejection(err) { reject(err); }
			const socket = io.of('/').sockets.get(playerID);
			socket.on(events.CHOOSE_WORD, ({ word }) => {
				socket.to(socket.roomID).emit(events.HIDE_WORD, { word: splitter.splitGraphemes(word).map((char) => (char !== ' ' ? '_' : char)).join('') });
				socket.removeListener('disconnect', rejection);
				resolve(word);
			});
			socket.once('disconnect', rejection);
		});
	}

	resetGuessedFlag(players) {
		const { io } = this;
		players.forEach((playerID) => {
			const player = io.of('/').sockets.get(playerID);
			if (player) player.hasGuessed = false;
		});
	}

	async startGame() {
		const { io, socket } = this;
		const { rounds } = games[socket.roomID];
		const players = Array.from(await io.in(socket.roomID).allSockets());
		console.log(players, 'players')
		socket.to(socket.roomID).emit(events.START_GAME);
		for (let j = 0; j < rounds; j++) {
			/* eslint-disable no-await-in-loop */
			for (let i = 0; i < players.length; i++) {
				await this.giveTurnTo(players, i);
			}
		}
		io.to(socket.id).emit(EVENTS.GET_SCORE, { scores: games[socket.roomID]["Players"] });
		io.to(socket.roomID).emit(events.END_GAME, { stats: games[socket.roomID] });
		delete games[socket.roomID];
	}
	async giveTurnTo(players, i) {
		const { io, socket } = this;
		const { roomID } = socket;
		const { time } = games[roomID];
		const player = players[i];
		const prevPlayer = players[(i - 1 + players.length) % players.length];
		const drawer = io.of('/').sockets.get(player);
		if (!drawer || !games[roomID]) return;
		this.resetGuessedFlag(players);
		games[roomID].totalGuesses = 0;
		games[roomID].currentWord = '';

		for (const customId in customSocketIds){
			if (customSocketIds[customId] === player){
				games[roomID].drawer = customId;
			}
		}

		// games[roomID].drawer = player;
		// console.log("drawer>>>>>>>>>>>>>>>", drawer.to(roomID))
		io.to(prevPlayer).emit(events.DISABLE_CANVAS);
		drawer.to(roomID).broadcast.emit(events.CHOOSING_WORD, { name: drawer.player.name });
		io.to(player).emit(events.CHOOSE_WORD, get3Words(roomID));
		try {
			const word = await this.chosenWord(player);
			games[roomID].currentWord = word;
			io.to(roomID).emit(events.CLEAR_CANVAS);
			drawer.to(roomID).broadcast.emit(events.HINTS, getHints(word, roomID));
			games[roomID].startTime = Date.now() / 1000;
			io.to(roomID).emit(events.START_TIMER, { time });
			if (await wait(roomID, drawer, time)) drawer.to(roomID).broadcast.emit(events.LAST_WORD, { word });
		} catch (error) {
			console.log(error);
		}
	}

	getScore(data){
		const { io, socket } = this;
		io.to(socket.id).emit(EVENTS.GET_SCORE, { scores: games[socket.roomID]["Players"] });
	}

	onMessage(data) {
		const { io, socket } = this;
		const guess = data.message.toLowerCase().trim();
		if (guess === '') return;
		const currentWord = games[socket.roomID].currentWord.toLowerCase();
		const distance = leven(guess, currentWord);
		if (distance === 0 && currentWord !== '') {
				socket.emit(events.MESSAGE, { ...data, name: socket.player.name });
				if (games[socket.roomID].drawer !== socket.id && !socket.hasGuessed) {
						// const drawer = io.of('/').sockets.get(games[socket.roomID].drawer);
						const { startTime } = games[socket.roomID];
						const roundTime = games[socket.roomID].time;
						const roomSize = io.sockets.adapter.rooms.get(socket.roomID).size;
						socket.emit(events.CORRECT_GUESS, { message: 'You guessed it right!', id: socket.id });
						socket.broadcast.emit(events.CORRECT_GUESS, { message: `${socket.player.name} has guessed the word!`, id: socket.id });
						

						games[socket.roomID].totalGuesses++;
						games[socket.roomID]["Players"][data.id].score += getScore(startTime, roundTime);
						games[socket.roomID]["Players"][games[socket.roomID].drawer].score += BONUS;
						// io.in(socket.roomID).emit(events.UPDATE_SCORE, {
						// 		playerID: socket.id,
						// 		score: games[socket.roomID]["Players"][data.id].score,
						// 		drawerID: games[socket.roomID].drawer,
						// 		drawerScore: games[socket.roomID]["Players"][games[socket.roomID].drawer].score,
						// });
						if (games[socket.roomID].totalGuesses === roomSize - 1) {
								round.emit('everybodyGuessed', { roomID: socket.roomID });
						}
				}
				socket.hasGuessed = true;
		} else if (distance < 3 && currentWord !== '') {
				io.in(socket.roomID).emit(events.MESSAGE, { ...data, name: socket.player.name });
				if (games[socket.roomID].drawer !== socket.id && !socket.hasGuessed) socket.emit('closeGuess', { message: 'That was very close!' });
		} else {
				io.in(socket.roomID).emit(events.MESSAGE, { ...data, name: socket.player.name });
		}
}

	async getPlayers(data) {
		const { io, socket } = this;
		// console.log('get players called', socket, 'room id')
		const players = Array.from(await io.in(socket.roomID).allSockets());
		io.in(socket.roomID).emit(events.GET_PLAYERS,
			players.reduce((acc, id) => {
				const { player } = io.of('/').sockets.get(id);
				acc.push(player);
				return acc;
			}, []));
	}
}

module.exports = Game;
