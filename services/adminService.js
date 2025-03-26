import userModel from "../models/userModel.js";
import tripModel from '../models/tripModel.js';


class AdminService {
    getAllUsers = async() =>{
        const users = await userModel.find({ role: "user" });
        return users;
    }
    getAllUser = async(userId) =>{
        const user = await userModel.findById(userId);
        return user;
    }
    getAllOperator = async() =>{
        const operators = await userModel.find({ role: "operator" });
        return operators;
    }
    getOperator = async(operatorId) =>{
        const operator = await userModel.findById(operatorId);
        return operator;
    }
    blockUnblockUser = async(userId) =>{
        const user = await userModel.findById(userId);
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