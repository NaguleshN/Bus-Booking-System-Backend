import mongoose from 'mongoose';


const busSchema = new mongoose.Schema({
    operatorId : {
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    busType:{
        type:String,
        enum:["Sleeper","AC","Non-AC","Seater"],
        required : true
    },
    setlayout:[{
        seatNumber : {
            type:Number,
            required:true
        },
        isBooked:{
            type:Boolean,
            default:false
        }
    }],
    amenities:{
        type:String
    },
    totalSeats :{
        type:Number,
        required:true
    }
},{
    timestamps:true
});

module.export = mongoose.model("Bus", busSchema)