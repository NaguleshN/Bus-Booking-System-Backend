import userModel from "../models/userModel.js";
import tripModel from '../models/tripModel.js';


class AdminService {
    getAllUsers = async() =>{
        const users = await userModel.find({ role: "user" });
        return users;
    }
    getAllOperator = async() =>{
        const operators = await userModel.find({ role: "operator" });
        return operators;
    }
    blockUnblockUser = async(userId) =>{
        const user = await userModel.findById(userId);
        user.isBlocked = !user.isBlocked;
        await user.save();
        return user;
    }
    getAlltrips = async() =>{
        const trips = await tripModel.find();
        return trips;
    }
}

export default AdminService;