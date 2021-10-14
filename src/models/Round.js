const mongoose = require( 'mongoose' );
const scoreSchema = require('./Score');

const roundSchema = new mongoose.Schema({
    turnsList:{
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'Turn',
        default: [] 
    },
    // scores: {
    //     type: [ scoreSchema ],
    //     _id: false
    // }
});

mongoose.model( 'Round', roundSchema );