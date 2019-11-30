const mongoose = require('mongoose');
const Schema  = mongoose.Schema;


const ExceptionSchema = new Schema({
    statusCode        : {type:Number},
    error        : {type:String},

},{
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});


module.exports = Exception = mongoose.model('Exception',ExceptionSchema,'exception');
