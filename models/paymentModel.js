import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema({
    bookingId :{
        type:mongoose.Schema.ObjectId,
        ref:'Booking',
        required:true
    },
    userId :{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        enum:['UPI','Debit Card','Credit Card','Wallet'],
        required:true
    },
    transactionId:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:String,
        enum:['Success','Failed'],
        required:true
    }
},{
    timestamps:true
});

const paymentModel = mongoose.model('Payment',paymentSchema)
export default paymentModel;