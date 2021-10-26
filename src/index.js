require( './data/init' );
const cors = require( 'cors' );
const express = require('express')
const app = new express();
const sockets = require('./sockets');
const constants = require('./utils/constants')
const { EventEmitter } = require('events');

global.round = new EventEmitter();
global.games = {};
global.customSocketIds = {};
global.BONUS = 250;
global.MAX_POINTS = 500;
global.EVENTS = constants.events


const authRouter = require( './routes/auth' );

const logger = require( './middleware/logger' );
const errorHandler = require( './middleware/error' );

app.use( cors() );

app.use( logger );

app.use( express.urlencoded( { extended: false } ) );

app.use( express.json() );

app.use( '/auth', authRouter );

app.get('/test', (req, res) => {
	res.json({ok: 'ok'})
})


// generic error handler
app.use( errorHandler );

const server = app.listen(  process.env.NODE_ENVIRONMENT !== 'production' ? 3000 :  process.env.PORT, () => {
	console.log(`Server listening on port 3000`);
});

sockets.initialize(server);
