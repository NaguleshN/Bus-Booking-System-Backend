import userModel from "../models/userModel.js";
import tripModel from '../models/tripModel.js';


class AdminService {
    getAllUsers = async() =>{
        const users = await userModel.find({ role: "user" });
        return users;
    }

    getUser = async(userId) =>{
        const user = await userModel.findById(userId);
        if(!user){
            throw new Error("User is not found");
        }
        return user;
    }

    getAllOperator = async() =>{
        const operators = await userModel.find({ role: "operator" });
        return operators;
    }

    getOperator = async(operatorId) =>{
        const operator = await userModel.findById(operatorId);
        if(!operator){
            throw new Error("Operator is not found");
        }
        return operator;
    }

    blockUnblockUser = async(userId) =>{
        const user = await userModel.findById(userId);
        if(!user){
            throw new Error("User is not found");
        }
        user.isBlocked = !user.isBlocked;
        await user.save();
        return user;
    }

    getAllTrips = async() =>{
        const trips = await tripModel.find();
        return trips;
    } 
    
    getTrip = async(tripId) =>{
        const trip = await tripModel.findById(tripId);
        if(!trip){
            throw new Error("Trip is not found");
        }
        return trip;
    }

    updateTrip = async(tripData,tripId) =>{
        const { operatorId, busId, source,destination,departureTime,arrivalTime, price, availableSeats } = tripData ;
        
        const updateData = {};
        if (source) updateData.source = source;
        if (destination) updateData.destination = destination;
        if (departureTime) updateData.departureTime = departureTime;
        if (arrivalTime) updateData.arrivalTime = arrivalTime;
        if (price) updateData.price = price;
        if (availableSeats) updateData.availableSeats = availableSeats;
        
        const trip = await tripModel.findByIdAndUpdate(
            tripId,
            {$set: updateData},
        );
        return trip;

    }

    cancelTrip = async(tripId) =>{
        const trip = await tripModel.findById(tripId);
        if(!trip){
            throw new Error("Trip is not found");
        }
        if (trip.status === 'Cancelled') {
            throw new Error("Trip is already cancelled");
        }
        trip.status = 'Cancelled'
        await trip.save();
        return trip;
    }

    approveOperator =async(operatorId) =>{
        const operator = await userModel.findById(operatorId);
        if(!operator || operator.role != "operator"){
            throw new Error("Operator is not found");
        }
        operator.isVerified = true ;
        await operator.save();
        return operator;
    }
}

export default AdminService;