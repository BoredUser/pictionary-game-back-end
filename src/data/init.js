require( '../models/User' );

const mongoose = require( 'mongoose' );

mongoose.set( 'returnOriginal', false );
mongoose.set( 'runValidators', true );
// mongoose.set( 'useFindAndModify', false );

// mongodb is the name of the service
if( process.env.NODE_ENVIRONMENT !== 'production' ) {
    console.log( 'Connecting to mongodb://localhost:27017/workshopsDB' );
    mongoose.connect( 'mongodb://localhost:27017/pictionaryGameDB' );
} else {
    console.log( "password: ", process.env.DB_PASSWORD );
    console.log( "Username: ", process.env.DB_USER );
    const string = `mongodb+srv://rahulTambe:Qpalzmqm@cluster0.nznal.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    //const connection = `mongodb+srv://${process.env.DB_USER}:/${process.env.DB_PASSWORD}@cluster0.nznal.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    mongoose.connect( string );
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