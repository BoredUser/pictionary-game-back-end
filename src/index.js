// require( './data/' );

require( './data/init' );

const express = require( 'express' );
const path = require( 'path' );
const cors = require( 'cors' );

const app = express();


// middlewares

app.use( cors() );
app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );


const PORT = process.env.PORT || 3000;

app.listen( PORT, error => {
    if( error ) {
        console.error( error.message );
        return;
    }

    console.log( `Check http://localhost:${PORT}` );
});

require ('./socket/index');










