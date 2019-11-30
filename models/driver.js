const mongoose = require('mongoose');
const Schema  = mongoose.Schema;


var DriverSchema = new Schema({
    driverName        : {type:String},
    driverRating        : {type:String},
    vehicleNumber        : {type:String},
    
    currentLocation: {
        type: { type: String },
        coordinates: []
       },
},{
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

DriverSchema.index({ currentLocation: "2dsphere" });

module.exports = Driver = mongoose.model('Driver',DriverSchema,'driver');
