import mongoose from 'mongoose';

const tripSchema = mongoose.Schema({
    operatorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    busId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bus',
        required: true
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    totalSeats: {
        type: [Number],
        required: true,
    },
    departureTime: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value < this.arrivalTime;
            },
            message: "Departure time must be before arrival time."
        }
    },
    
    price: {
        type: Number,
        required: true,
        min:0
    },
    seatNumbers: {
        type: [Number],
        required: true,
    },
    
    availableSeats: {
        type: Number,
        required: true,
        min: [0, "Available seats cannot be negative"],
        validate: {
            validator: function (value) {
                return value === this.seatNumbers.length;
            },
            message: "Available seats count must match the number of seat numbers."
        }
    },
    
    status: {
        type: String,
        enum: ['Scheduled', 'Cancelled', 'Completed'],
        default: 'Scheduled'
    },
    feedbacks: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Feedback'
    }],
}, {
    timestamps: true
});

const tripModel = mongoose.model("Trip", tripSchema);
export default tripModel;
