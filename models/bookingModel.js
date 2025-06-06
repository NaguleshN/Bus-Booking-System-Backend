import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
    userId :{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    tripId :{
        type:mongoose.Schema.ObjectId,
        ref:'Trip',
        required:true
    },
    seatsBooked:[{ 
        type: Number, 
        required: true 
    }],
    seatsCancelled:[{
        type: Number,
        default: [],
    }],
    totalPrice :{
        type:Number,
        required:true
    },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Failed'], 
        default: 'Pending' 
    },
    bookingStatus: { 
        type: String, 
        enum: ['Confirmed', 'Cancelled'], 
        default: 'Confirmed' 
    },
},{
    timestamps:true
});

const bookingModel = mongoose.model("Booking",bookingSchema);
export default bookingModel;