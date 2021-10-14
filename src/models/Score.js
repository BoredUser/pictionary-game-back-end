const mongoose = require( 'mongoose' );

const scoreSchema = new mongoose.Schema({
    user:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    score:{
        type: Number,
        default: 0
    }
})

module.exports = scoreSchema;