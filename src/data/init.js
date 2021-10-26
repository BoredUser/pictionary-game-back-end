require( '../models/User' );

const mongoose = require( 'mongoose' );

mongoose.set( 'returnOriginal', false );
mongoose.set( 'runValidators', true );
// mongoose.set( 'useFindAndModify', false );

// mongodb is the name of the service
if( process.env.DOCKER === 'NO_DOCKER' ) {
    console.log( 'Connecting to mongodb://localhost:27017/workshopsDB' );
    mongoose.connect( 'mongodb://localhost:27017/pictionaryGameDB' );
} else {
    console.log( 'Connecting to mongodb://mongodb/workshopsDB' );
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