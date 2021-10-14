const mongoose = require( 'mongoose' );
var { nanoid } = require( 'nanoid' );
const scoreSchema = require('./Score');

const gameSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    numberOfRounds: {
        type: Number,
        required: true
    },
    usersList:{
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'User',
        default: [] 
    },
    roundsList:{
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'Round',
        default: [] 
    },
    // scores: {
    //     type: [ scoreSchema ],
    //     _id: false
    // },
    winner: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    gameType:{
        type: String,
        default: 'individual',
        enum: [ 'individual', 'team' ],
    }
});


const gameModel = mongoose.model( 'Game', gameSchema );

let checkIfIdExists = (id) => {
    gameModel.find({roomId : id}, function (err, docs) {
        if (!docs.length){
            return id
        }else{                
            return false
        }
    });
};

let getUniqueId = () =>{
    let id = nanoid(7);
    if(checkIfIdExists(id)){
        return id;
    }
    else{
        return getUniqueId();
    }
}

gameSchema.pre( 'save', function( done ){
    let game = this;
    game.roomId = getUniqueId();
    done();
});