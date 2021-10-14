require('../models/User');
require('../models/Turn');
require('../models/Round');
require('../models/Game');

const mongoose = require( 'mongoose' );

mongoose.set( 'returnOriginal', false );
mongoose.set( 'runValidators', true );

// mongodb is the name of the service
if( process.env.DOCKER === 'NO_DOCKER' ) {
    console.log( 'Connecting to mongodb://localhost:27017/pictionaryGameDB' );
    mongoose.connect( 'mongodb://localhost:27017/pictionaryGameDB' );
} else {
    console.log( 'Connecting to mongodb://mongodb/pictionaryGameDB' );
    mongoose.connect( 'mongodb://mongodb/pictionaryGameDB' );
}

mongoose.connection.on( 'connected', () => {
    console.log( 'connected' );
});

mongoose.connection.on( 'error', error => {
    console.error( error.message );
});

mongoose.connection.on( 'disconnect', error => {
    console.error( error.message );
});