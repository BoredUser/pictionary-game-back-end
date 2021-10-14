const mongoose = require( 'mongoose' );
const scoreSchema = require('./Score');

const turnSchema = new mongoose.Schema({
    drawingUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    wordToGuess:{
        type: String,
        required: true
    },
    scores: {
        type: [ scoreSchema ],
        _id: false
    }
});

mongoose.model( 'Turn', turnSchema );