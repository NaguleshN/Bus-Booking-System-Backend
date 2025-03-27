import mongoose from 'mongoose';

const feedbackSchema = mongoose.Schema({
   
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
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const feedbackModel = mongoose.model("Feedback", feedbackSchema)
export default feedbackModel;