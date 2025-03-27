import UserService from "../services/userService.js";

class UserController {
    constructor(){
        this.userService = new UserService();
    }

    getTrips = async(req,res) =>{
        try{
            const users = await this.userService.getTrips();
            return res.status(200).json({ message:"Trips are Fetched Successfully", users })
        } catch(err){
            return res.status(500).json({message:err.message})
        }
    }

    getTrip = async(req,res) =>{
        try{
            const tripId = req.params.id ;
            const user = await this.userService.getTrip(tripId);
            return res.status(200).json({ message:"Trip are Fetched Successfully", user })
        } catch(err){
            return res.status(500).json({message:err.message})
        }
    }

    viewProfile = async(req,res) => {
        try{
            const userId = req.params.id; 
            const profile = await this.userService.viewProfile(userId);
            return res.status(200).json({message:"User Profile"});
        }catch(err){
            return res.status(500).json({message:err.message})
        }
    }

    updateProfile = async(req,res) => {
        try{
            const userId = req.params.id;
            const update = req.body;
            const user = await this.userService.updateProfile(userId,update);
            return res.status(200).json({message:"User Profile Updated Successfully",user});
        }catch(err){
            return res.status(500).json({message:err.message})
        }
    }
}

export default UserController ;