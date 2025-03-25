import mongoose from 'mongoose';


const busSchema = new mongoose.Schema({
    operatorId : {
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    busNumber : {
        type:String,
        unique:true,
        required : true,
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
    totalSeats: {
        type: Number,
        validate: {
          validator: function(v) {
            return v === this.setlayout.length;
        },
          message: 'Total seats must match seat count'
        }
    }
},{
    timestamps:true
});

const busModel =mongoose.model("Bus", busSchema)
export default busModel;

// {
//     "operatorId": "507f191e810c19729de860ea",
//     "busType": "AC",
//     "seats": [
//       {"number": 1, "booked": false},
//       {"number": 2, "booked": true}
//     ],
//     "amenities": ["WiFi", "Charging Ports"],
//     "totalSeats": 2
//   }