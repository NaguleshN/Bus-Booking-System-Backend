import mongoose from 'mongoose';

const tripSchema  = mongoose.Schema({
    operatorId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    busId:{
        type:mongoose.Schema.ObjectId,
        ref:'Bus',
        required:true
    },
    source :{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    departureTime:{
        type:Date,
        required:true
    },
    arrivalTime:{
        type:Date,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    availableSeats:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['Scheduled','Cancelled','Completed'],
        default:'Scheduled'
    }
},{
    timestamps:true
});

module.export = mongoose.model("Trip",tripSchema)